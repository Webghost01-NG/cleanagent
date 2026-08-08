// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CVAAuditWrapper
 * @dev Cleanverse Verified Assets (CVA) Provenance & Mandate Audit Ledger
 * Records immutable on-chain logs for all autonomous agent mandates, rebalance cycles, and blocked CVI compliance violations.
 */
contract CVAAuditWrapper {
    address public owner;

    struct AuditRecord {
        uint256 recordId;
        address agentAddress;
        address targetPoolAddress;
        string actionType; // "REBALANCE", "DEPOSIT", "WITHDRAW", "BLOCKED_CVI_VIOLATION"
        uint256 amountUSD;
        bool isSuccessful;
        bytes32 cviCertificateHash;
        bytes32 provenanceTxHash;
        string details;
        uint256 timestamp;
    }

    AuditRecord[] private _auditTrail;

    event CVAExecutionLogged(
        uint256 indexed recordId,
        address indexed agentAddress,
        address indexed targetPool,
        string actionType,
        uint256 amountUSD,
        bool isSuccessful,
        bytes32 provenanceTxHash
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "CVA: Caller is not protocol owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function logAgentExecution(
        address agentAddress,
        address targetPoolAddress,
        string calldata actionType,
        uint256 amountUSD,
        bool isSuccessful,
        bytes32 cviCertificateHash,
        string calldata details
    ) external returns (uint256 recordId, bytes32 provenanceTxHash) {
        recordId = _auditTrail.length + 1;
        provenanceTxHash = keccak256(
            abi.encodePacked(recordId, agentAddress, targetPoolAddress, amountUSD, block.timestamp, block.prevrandao)
        );

        AuditRecord memory record = AuditRecord({
            recordId: recordId,
            agentAddress: agentAddress,
            targetPoolAddress: targetPoolAddress,
            actionType: actionType,
            amountUSD: amountUSD,
            isSuccessful: isSuccessful,
            cviCertificateHash: cviCertificateHash,
            provenanceTxHash: provenanceTxHash,
            details: details,
            timestamp: block.timestamp
        });

        _auditTrail.push(record);

        emit CVAExecutionLogged(
            recordId,
            agentAddress,
            targetPoolAddress,
            actionType,
            amountUSD,
            isSuccessful,
            provenanceTxHash
        );

        return (recordId, provenanceTxHash);
    }

    function getAuditRecord(uint256 recordId) external view returns (AuditRecord memory) {
        require(recordId > 0 && recordId <= _auditTrail.length, "CVA: Invalid record ID");
        return _auditTrail[recordId - 1];
    }

    function getTotalRecords() external view returns (uint256) {
        return _auditTrail.length;
    }
}
