// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CVIIdentityRegistry
 * @dev Cleanverse Verified Identity (CVI) On-Chain Attestation Registry
 * Stores KYC verification tiers, accredited investor certificates, and pool compliance ratings.
 */
contract CVIIdentityRegistry {
    address public owner;

    struct Identity {
        address wallet;
        string name;
        string entityType; // "Individual", "Institutional Fund", "DeFi Liquidity Pool"
        bool isVerified;
        bool isAccredited;
        uint8 kycTier;     // Tier 0: Unverified, Tier 1: Standard, Tier 2: Institutional
        bytes32 cviCertificateHash;
        uint256 verifiedAt;
    }

    mapping(address => Identity) private _identities;

    event CVIIdentityUpdated(address indexed wallet, bool isVerified, bool isAccredited, uint8 kycTier, bytes32 certificateHash);
    event CVIIdentityRevoked(address indexed wallet, string reason);

    modifier onlyOwner() {
        require(msg.sender == owner, "CVI: Caller is not protocol owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerCVIIdentity(
        address wallet,
        string calldata name,
        string calldata entityType,
        bool isAccredited,
        uint8 kycTier,
        bytes32 certificateHash
    ) external onlyOwner {
        require(wallet != address(0), "CVI: Invalid wallet address");

        _identities[wallet] = Identity({
            wallet: wallet,
            name: name,
            entityType: entityType,
            isVerified: true,
            isAccredited: isAccredited,
            kycTier: kycTier,
            cviCertificateHash: certificateHash,
            verifiedAt: block.timestamp
        });

        emit CVIIdentityUpdated(wallet, true, isAccredited, kycTier, certificateHash);
    }

    function revokeCVIIdentity(address wallet, string calldata reason) external onlyOwner {
        require(_identities[wallet].isVerified, "CVI: Wallet is not verified");
        _identities[wallet].isVerified = false;
        _identities[wallet].isAccredited = false;
        _identities[wallet].kycTier = 0;

        emit CVIIdentityRevoked(wallet, reason);
    }

    function isVerified(address wallet) external view returns (bool) {
        return _identities[wallet].isVerified;
    }

    function isAccredited(address wallet) external view returns (bool) {
        return _identities[wallet].isAccredited;
    }

    function getKYCTier(address wallet) external view returns (uint8) {
        return _identities[wallet].kycTier;
    }

    function getIdentity(address wallet) external view returns (Identity memory) {
        return _identities[wallet];
    }
}
