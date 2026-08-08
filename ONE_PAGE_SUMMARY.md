# 🤖 CleanAgent Protocol — One-Page Protocol & Submission Summary

**Project Name**: CleanAgent Protocol  
**Hackathon Track**: Track 02 — Compliant DeFi  
**Submission Email**: `isaac@cleanverse.com`  
**Cleanverse Primitive Used**: Cleanverse Capability #8 (Agent Skill Framework)  
**Deployed Chain(s)**: Monad Protocol Testnet, Cleanverse EVM Testnet, Base Mainnet, Arbitrum One  

---

## 1. 🎯 Problem Statement
DeFi yield farming and automated liquidity management are complex, manual, and exposed to severe compliance risks. Existing AI yield bots run blindly without checking regulatory compliance, risking funds in unverified, blacklisted, or sanctioned liquidity pools. 

Standard Web3 protocols cannot enforce programmable mandates or counterparty identity verification before an autonomous agent executes a trade or deposit on-chain.

---

## 2. 💡 Solution Overview — CleanAgent Protocol
**CleanAgent Protocol** is an **Autonomous Compliant DeFi & Yield Management Engine** built directly on **Cleanverse Capability #8 (Agent Skill Framework)**:

1. **Programmable Agent Mandates**: Users define spend limits (e.g. max $25,000/tx), target APY yield thresholds (e.g. min 7.00% APY), and counterparty compliance rules for their AI agent.
2. **CVI Counterparty Validation**: Before executing any automated deposit or rebalance, the Agent queries **Cleanverse Verified Identity (CVI)** credentials on-chain.
3. **Automated On-Chain Guardrails**: If a target pool is unverified or non-compliant, the Agent automatically **aborts execution on-chain with a CVI Error 403**.
4. **Immutable Mandate Audit Provenance**: Every autonomous trade, spend control limit, and mandate cycle is logged to the **Cleanverse Verified Assets (CVA)** audit ledger with a cryptographic mandate hash (`MANDATE-CLEANAGENT-XXXX`).

---

## 3. ⚙️ CVI & CVA Integration Points

| Cleanverse Capability | Smart Contract / API | Technical Implementation |
| :--- | :--- | :--- |
| **Capability #8: Agent Skill Framework** | `CleanAgentVault.sol` | Enforces programmable mandate parameters, daily spend caps, and autonomous execution logic. |
| **Cleanverse Verified Identity (CVI)** | `CVIIdentityRegistry.sol` | On-chain attestation registry. Queries `cviRegistry.isVerified(pool)` before executing any agent rebalance. |
| **Cleanverse Verified Assets (CVA)** | `CVAAuditWrapper.sol` | Logs `CVAExecutionLogged` for all compliant rebalances and blocked CVI violations with cryptographic provenance hashes. |
| **REST Telemetry API** | `server/index.js` (`/api/agent/run`) | Express API backend serving live yield pool telemetry and agent execution triggers. |

---

## 4. 🚀 Key MVP Workflows Built

- **Autonomous Agent Control Panel**: Interactive 1-click **"Run Autonomous Agent Cycle"** button with a real-time protocol evaluation trace.
- **Compliant Yield Pool Explorer**: Real-time evaluation of Monad, Base, and Arbitrum yield pools with CVI verification badges.
- **CVI Counterparty Risk Sandbox**: Interactive scenario presets demonstrating live on-chain agent aborts when targeting unverified pools.
- **CVA Mandate Audit Explorer**: Filterable provenance ledger displaying cryptographic mandate hashes and transaction records.

---

## 🏆 Summary for Judges
CleanAgent Protocol demonstrates how autonomous AI agents can manage millions in Web3 liquidity while remaining **100% compliant, audit-ready, and rule-enforced on-chain by design** using Cleanverse protocol primitives.
