// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CVIIdentityRegistry.sol";
import "./CVAAuditWrapper.sol";

/**
 * @title CleanAgentVault
 * @dev Autonomous Compliant DeFi Agent Vault Built on Cleanverse Capability #8 (Agent Skill Framework)
 * Enforces programmable mandates: max daily spend limits, target yield threshold, and CVI counterparty checks.
 */
contract CleanAgentVault {
    address public owner;
    CVIIdentityRegistry public cviRegistry;
    CVAAuditWrapper public cvaAudit;

    struct AgentMandate {
        uint256 maxSpendPerTxUSD;
        uint256 maxDailySpendUSD;
        uint256 currentDailySpendUSD;
        uint256 lastSpendTimestamp;
        uint256 minRequiredYieldBps; // e.g. 500 = 5.00% APY
        bool requireAccreditedPoolOnly;
        bool isAgentActive;
    }

    AgentMandate public mandate;

    event AgentMandateUpdated(uint256 maxSpendPerTx, uint256 maxDailySpend, uint256 minYieldBps, bool requireAccredited);
    event AutonomousRebalanceExecuted(address indexed targetPool, uint256 amountUSD, uint256 expectedYieldBps, bytes32 provenanceTxHash);
    event AutonomousExecutionBlocked(address indexed targetPool, uint256 amountUSD, string reason);

    modifier onlyOwner() {
        require(msg.sender == owner, "CleanAgent: Caller is not vault owner");
        _;
    }

    constructor(address _cviRegistryAddress, address _cvaAuditAddress) {
        require(_cviRegistryAddress != address(0), "CleanAgent: Invalid CVI Registry address");
        require(_cvaAuditAddress != address(0), "CleanAgent: Invalid CVA Audit address");

        owner = msg.sender;
        cviRegistry = CVIIdentityRegistry(_cviRegistryAddress);
        cvaAudit = CVAAuditWrapper(_cvaAuditAddress);

        // Default Mandate Configuration
        mandate = AgentMandate({
            maxSpendPerTxUSD: 50000,
            maxDailySpendUSD: 200000,
            currentDailySpendUSD: 0,
            lastSpendTimestamp: block.timestamp,
            minRequiredYieldBps: 600, // 6.00% APY
            requireAccreditedPoolOnly: false,
            isAgentActive: true
        });
    }

    function setAgentMandate(
        uint256 _maxSpendPerTx,
        uint256 _maxDailySpend,
        uint256 _minYieldBps,
        bool _requireAccredited,
        bool _isActive
    ) external onlyOwner {
        mandate.maxSpendPerTxUSD = _maxSpendPerTx;
        mandate.maxDailySpendUSD = _maxDailySpend;
        mandate.minRequiredYieldBps = _minYieldBps;
        mandate.requireAccreditedPoolOnly = _requireAccredited;
        mandate.isAgentActive = _isActive;

        emit AgentMandateUpdated(_maxSpendPerTx, _maxDailySpend, _minYieldBps, _requireAccredited);
    }

    /**
     * @dev Core Autonomous Execution Engine
     * Evaluates yield pool, checks CVI counterparty compliance, verifies spend controls, and executes rebalance.
     */
    function executeAutonomousRebalance(
        address targetPoolAddress,
        uint256 amountUSD,
        uint256 poolYieldBps
    ) external onlyOwner returns (bool success, string memory statusMessage) {
        require(mandate.isAgentActive, "CleanAgent: Agent mandate is currently paused");

        // Reset daily spend tracker if 24 hours have passed
        if (block.timestamp >= mandate.lastSpendTimestamp + 1 days) {
            mandate.currentDailySpendUSD = 0;
            mandate.lastSpendTimestamp = block.timestamp;
        }

        // 1. Spend Control Checks
        if (amountUSD > mandate.maxSpendPerTxUSD) {
            string memory errStr = "Agent Mandate Violation: Tx amount exceeds per-transaction limit";
            cvaAudit.logAgentExecution(address(this), targetPoolAddress, "BLOCKED_SPEND_LIMIT", amountUSD, false, bytes32(0), errStr);
            emit AutonomousExecutionBlocked(targetPoolAddress, amountUSD, errStr);
            return (false, errStr);
        }

        if (mandate.currentDailySpendUSD + amountUSD > mandate.maxDailySpendUSD) {
            string memory errStr = "Agent Mandate Violation: Daily spend limit exceeded";
            cvaAudit.logAgentExecution(address(this), targetPoolAddress, "BLOCKED_DAILY_LIMIT", amountUSD, false, bytes32(0), errStr);
            emit AutonomousExecutionBlocked(targetPoolAddress, amountUSD, errStr);
            return (false, errStr);
        }

        // 2. Yield Threshold Check
        if (poolYieldBps < mandate.minRequiredYieldBps) {
            string memory errStr = "Agent Mandate Violation: Pool yield below target APY threshold";
            cvaAudit.logAgentExecution(address(this), targetPoolAddress, "BLOCKED_LOW_YIELD", amountUSD, false, bytes32(0), errStr);
            emit AutonomousExecutionBlocked(targetPoolAddress, amountUSD, errStr);
            return (false, errStr);
        }

        // 3. Cleanverse CVI Counterparty Verification Check
        bool isPoolVerified = cviRegistry.isVerified(targetPoolAddress);
        if (!isPoolVerified) {
            string memory errStr = "Cleanverse CVI Error 403: Target liquidity pool is not Cleanverse CVI verified";
            cvaAudit.logAgentExecution(address(this), targetPoolAddress, "BLOCKED_CVI_UNVERIFIED", amountUSD, false, bytes32(0), errStr);
            emit AutonomousExecutionBlocked(targetPoolAddress, amountUSD, errStr);
            return (false, errStr);
        }

        if (mandate.requireAccreditedPoolOnly && !cviRegistry.isAccredited(targetPoolAddress)) {
            string memory errStr = "Cleanverse CVI Error 403: Target pool lacks Institutional Accreditation Certificate";
            cvaAudit.logAgentExecution(address(this), targetPoolAddress, "BLOCKED_CVI_NOT_ACCREDITED", amountUSD, false, bytes32(0), errStr);
            emit AutonomousExecutionBlocked(targetPoolAddress, amountUSD, errStr);
            return (false, errStr);
        }

        // Execution Approved & Provenance Recorded
        mandate.currentDailySpendUSD += amountUSD;

        bytes32 poolCertHash = cviRegistry.getIdentity(targetPoolAddress).cviCertificateHash;
        (, bytes32 txHash) = cvaAudit.logAgentExecution(
            address(this),
            targetPoolAddress,
            "AUTONOMOUS_REBALANCE",
            amountUSD,
            true,
            poolCertHash,
            "Compliant CVI Counterparty Rebalance Executed"
        );

        emit AutonomousRebalanceExecuted(targetPoolAddress, amountUSD, poolYieldBps, txHash);
        return (true, "Cleanverse CVI Compliance Passed: Autonomous Rebalance Executed Successfully");
    }
}
