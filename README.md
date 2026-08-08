# 🤖 CleanAgent Protocol — Next.js Edition

> **Autonomous Compliant DeFi & Yield Execution Engine**  
> *Built for Hackathons, Monad Testnet, and Enterprise Compliant DeFi.*

[![Next.js](https://img.shields.io/badge/Framework-Next.js%2016-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/UI-React%2019-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%204-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

---

## 📌 Executive Summary

**CleanAgent Protocol** is an autonomous AI-driven yield management platform that enforces regulatory & risk compliance on-chain before executing trades.

Traditional DeFi yield bots operate blindly, depositing funds into unverified, high-risk, or non-compliant liquidity pools. CleanAgent solves this by combining:
1. **Programmable Smart Mandates**: Per-transaction spend limits ($5k–$100k) and APY target floors.
2. **Cleanverse Verified Identity (CVI)**: On-chain attestation registry querying KYC/AML clearance before deposit (`CVI Error 403` revert on unverified pools).
3. **Cleanverse Verified Assets (CVA)**: Cryptographic audit provenance ledger logging immutable execution hashes on Monad Testnet.

---

## 🏗️ Architecture Overview

```
                          ┌────────────────────────────────┐
                          │    Next.js 16 App Router UI    │
                          │ (Kwala Design System & Dark/Light)│
                          └───────────────┬────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
     ┌────────────────────────┐                      ┌────────────────────────┐
     │   Web3 Wallet Modal    │                      │  Natural Language AI   │
     │  (MetaMask / Phantom)  │                      │    Agent Console Chat  │
     └────────────┬───────────┘                      └────────────┬───────────┘
                  │                                               │
                  └───────────────────────┬───────────────────────┘
                                          │
                                          ▼
                      ┌───────────────────────────────────────┐
                      │    Next.js API Routes / API Backend   │
                      │  (/api/agent/run, /api/cvi, /api/cva)  │
                      └───────────────────┬───────────────────┘
                                          │
       ┌──────────────────────────────────┼──────────────────────────────────┐
       ▼                                  ▼                                  ▼
┌─────────────┐                    ┌─────────────┐                    ┌─────────────┐
│ CleanAgent  │                    │ CVIIdentity │                    │  CVAAudit   │
│  Vault.sol  │                    │Registry.sol │                    │ Wrapper.sol │
└─────────────┘                    └─────────────┘                    └─────────────┘
```

---

## 🚀 Developer Quickstart Guide

### Prerequisites
- Node.js **>= 18.0.0**
- npm **>= 9.0.0**

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/Webghost01-NG/cleanagent.git
cd cleanagent

# Install dependencies inside the Next.js app
cd next-app
npm install
```

### 2. Running Locally (Next.js Dev Server)

```bash
# Start Next.js App Router server on port 3000
npm run dev
```

Open **`http://localhost:3000`** in your browser to launch the dApp!

### 3. Production Build & Verification

```bash
# Compile optimized Next.js build
npm run build

# Start production server
npm run start
```

---

## 📂 Repository Structure

```
cleanagent/
├── next-app/                      # Full Next.js 16 App Router Project
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js            # Main dApp layout & tab router
│   │   │   ├── globals.css        # Kwala MCP theme tokens & dot grid
│   │   │   └── api/               # Serverless Next.js API Routes
│   │   │       ├── stats/
│   │   │       ├── pools/
│   │   │       ├── agent/run/
│   │   │       ├── cvi/identities/
│   │   │       └── cva/audit-trail/
│   │   ├── components/            # Reusable UI Components
│   │   │   ├── Navbar.jsx         # Header & Theme Toggle Switch
│   │   │   ├── HeroAndMasonry.jsx # Landing Hero & Capability Grid
│   │   │   ├── AgentChat.jsx      # AI Console with Auto-Scroll
│   │   │   ├── AgentControlPanel.jsx # Dashboard & Execution Terminal
│   │   │   ├── CompliantPools.jsx # Yield Vault Compliance Ratings
│   │   │   ├── AgentAuditExplorer.jsx # CVA Provenance Audit Trail
│   │   │   ├── DocsView.jsx       # Interactive Technical Specs
│   │   │   └── WalletModal.jsx    # Web3 Wallet Connection Modal
│   │   └── services/              # Web3 Wallet Helpers
│   │       └── web3.js
├── contracts/                     # Solidity Smart Contracts
│   ├── CleanAgentVault.sol        # Mandate Guardrails Contract
│   ├── CVIIdentityRegistry.sol    # On-Chain KYC Attestation Registry
│   └── CVAAuditWrapper.sol        # Cryptographic Provenance Logger
├── README.md                      # Developer & Judge Documentation
└── ONE_PAGE_SUMMARY.md            # Architecture Summary
```

---

## 📜 Smart Contract Reference

### `CleanAgentVault.sol`
Primary vault contract enforcing per-transaction spend limits and APY floors:

```solidity
function executeRebalanceMandate(address targetPool, uint256 amountUSD) external nonReentrant {
    require(amountUSD <= mandate.maxSpendPerTxUSD, "Mandate: Spend limit exceeded");
    require(cviRegistry.isVerified(targetPool), "CVI Error 403: Unverified pool counterparty");
    
    IERC20(usdc).transfer(targetPool, amountUSD);
    cvaWrapper.logAgentExecution(msg.sender, targetPool, amountUSD);
}
```

### `CVIIdentityRegistry.sol`
On-chain attestation contract verifying target pool KYC/AML status (`isVerified`).

### `CVAAuditWrapper.sol`
Audit logger recording immutable cryptographic signatures (`0x8f3c...`) for institutional compliance.

---

## ⚡ REST API Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/stats` | `GET` | Returns global protocol AUM and total executions count |
| `/api/pools` | `GET` | Lists target DeFi yield vaults with CVI attestation status |
| `/api/agent/mandate` | `GET / POST` | Reads or updates mandate guardrails on-chain |
| `/api/agent/run` | `POST` | Triggers autonomous execution cycle & evaluates mandates |
| `/api/cva/audit-trail` | `GET` | Fetches cryptographic CVA mandate provenance records |

---

## 🤝 Contributing & Hackathon Submission

Built with ❤️ by **Webghost01-NG** for the **Cleanverse Hackathon**.

- **GitHub Repository**: [github.com/Webghost01-NG/cleanagent](https://github.com/Webghost01-NG/cleanagent)
- **Live Local App**: `http://localhost:3000`
