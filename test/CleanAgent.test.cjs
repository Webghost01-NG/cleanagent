const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CleanAgent Protocol - Smart Contract Test Suite", function () {
  let cviRegistry, cvaAudit, cleanAgentVault;
  let owner, poolVerified, poolUnverified, user;

  beforeEach(async function () {
    [owner, poolVerified, poolUnverified, user] = await ethers.getSigners();

    // 1. Deploy CVI Registry
    const CVI = await ethers.getContractFactory("CVIIdentityRegistry");
    cviRegistry = await CVI.deploy();

    // 2. Deploy CVA Audit Wrapper
    const CVA = await ethers.getContractFactory("CVAAuditWrapper");
    cvaAudit = await CVA.deploy();

    // 3. Deploy CleanAgent Vault
    const Vault = await ethers.getContractFactory("CleanAgentVault");
    cleanAgentVault = await Vault.deploy(
      await cviRegistry.getAddress(),
      await cvaAudit.getAddress()
    );

    // Register poolVerified as a Cleanverse CVI Verified Pool
    const certHash = ethers.keccak256(ethers.toUtf8Bytes("CVI-CERT-POOL-VERIFIED"));
    await cviRegistry.registerCVIIdentity(
      poolVerified.address,
      "Monad Compliant Yield Pool",
      "DeFi Liquidity Pool",
      true, // Accredited
      2,    // Institutional Tier
      certHash
    );
  });

  it("Should approve autonomous rebalance into CVI Verified Pool", async function () {
    const result = await cleanAgentVault.executeAutonomousRebalance.staticCall(
      poolVerified.address,
      10000, // $10,000 USD
      850    // 8.50% APY
    );

    expect(result.success).to.equal(true);
    expect(result.statusMessage).to.include("Cleanverse CVI Compliance Passed");
  });

  it("Should block autonomous rebalance into Unverified Pool via CVI Error 403", async function () {
    const result = await cleanAgentVault.executeAutonomousRebalance.staticCall(
      poolUnverified.address,
      10000,
      850
    );

    expect(result.success).to.equal(false);
    expect(result.statusMessage).to.include("Cleanverse CVI Error 403");
  });

  it("Should block autonomous execution if spend limit is exceeded", async function () {
    const result = await cleanAgentVault.executeAutonomousRebalance.staticCall(
      poolVerified.address,
      60000, // Exceeds per-tx limit ($50k)
      850
    );

    expect(result.success).to.equal(false);
    expect(result.statusMessage).to.include("Agent Mandate Violation");
  });
});
