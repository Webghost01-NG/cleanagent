# 🤖 CleanAgent Protocol
> **Autonomous Compliant DeFi & Yield Management Engine Built on Cleanverse Agent Skill Framework (Capability #8)**

[![Cleanverse Protocol](https://img.shields.io/badge/Cleanverse-CVI%20%26%20CVA%20v2.0-emerald)](https://cleanverse.com)
[![Track 02](https://img.shields.io/badge/Track%2002-Compliant%20DeFi-purple)](https://cleanverse.com/hackathon)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

## 📌 Executive Summary
**CleanAgent Protocol** solves the single largest risk in automated Web3 yield farming: **non-compliant liquidity routing**. Standard AI yield bots execute trades blindly without checking regulatory compliance, risking funds in unverified or sanctioned liquidity pools.

Built on **Cleanverse Capability #8 (Agent Skill Framework)**, CleanAgent empowers users to deploy autonomous financial mandates (e.g. *"Auto-rebalance $50,000 USDC into the highest yielding compliant pools"*). Before executing any transaction, the AI Agent checks counterparty **Cleanverse Verified Identity (CVI)** credentials on-chain. If a destination pool is unverified or non-compliant, the Agent automatically aborts execution with `Agent Mandate Violation 403: Counterparty Lacks CVI Clearance`.

Every autonomous trade, spend control limit, and mandate cycle is logged to **Cleanverse Verified Assets (CVA)** with cryptographic mandate provenance hashes.

---

## 🛠️ Architecture & Core Components

- **Smart Contracts (`/contracts`)**:
  - `CVIIdentityRegistry.sol`: On-chain identity whitelisting registry for liquidity pools and investors.
  - `CVAAuditWrapper.sol`: Cryptographic mandate provenance & audit logger.
  - `CleanAgentVault.sol`: Autonomous agent execution engine enforcing spend controls, CVI counterparty checks, and yield pool rebalancing.
- **REST API Backend (`/server`)**:
  - Express server on `http://localhost:5001` serving live pool telemetry, agent execution triggers, and CVA audit logs.
- **Web3 Frontend (`/client`)**:
  - Vite + React + Tailwind CSS v4 dApp featuring an interactive 1-click **"Run Autonomous Agent Cycle"** button with a real-time protocol evaluation trace.

---

## 🚀 Quick Start

```bash
# 1. Install Backend Dependencies
npm install

# 2. Run Express Protocol Server
npm run server

# 3. Launch React Client
cd client
npm install
npm run dev
```

---
© 2026 CleanAgent Protocol Team — Built for Cleanverse Build: Trusted Assets Hackathon.
