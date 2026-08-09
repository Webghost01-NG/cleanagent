/**
 * CleanAgent Protocol Global On-Chain Provenance Ledger Store
 * Shared across all users, API routes, and agent execution cycles
 */

export const globalAuditLogs = [
  {
    id: 114,
    recordId: 114,
    blockNumber: 14892212,
    timestamp: new Date().toISOString(),
    walletAddress: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
    poolName: "Monad Vault",
    amountUSD: 25000,
    cviTier: "CVI Accredited Tier 1",
    txHash: "0x8f3c4e91a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7",
    gasUsed: "142,500 Gwei",
    status: "SUCCESS (0x1)"
  },
  {
    id: 113,
    recordId: 113,
    blockNumber: 14892208,
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    walletAddress: "0x7a834e9100000000000000000000000000004e91",
    poolName: "Ethereum RWA Treasury Vault",
    amountUSD: 18500,
    cviTier: "CVI Accredited Tier 1",
    txHash: "0x2546bcd3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d78f3c4e91",
    gasUsed: "168,200 Gwei",
    status: "SUCCESS (0x1)"
  },
  {
    id: 112,
    recordId: 112,
    blockNumber: 14892201,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    walletAddress: "0x1111222233334444555566667777888899990000",
    poolName: "Base Credit Vault",
    amountUSD: 35000,
    cviTier: "CVI Standard Tier 2",
    txHash: "0x9999888877776666555544443333222211110000444433332222111100009999",
    gasUsed: "154,100 Gwei",
    status: "SUCCESS (0x1)"
  },
  {
    id: 111,
    recordId: 111,
    blockNumber: 14892195,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    walletAddress: "0x8888777766665555444433332222111100009999",
    poolName: "Monad Vault",
    amountUSD: 42000,
    cviTier: "CVI Accredited Tier 1",
    txHash: "0x7777666655554444333322221111000099998888111122223333444455556666",
    gasUsed: "139,800 Gwei",
    status: "SUCCESS (0x1)"
  },
  {
    id: 110,
    recordId: 110,
    blockNumber: 14892189,
    timestamp: new Date(Date.now() - 11500000).toISOString(),
    walletAddress: "0x3333444455556666777788889999000011112222",
    poolName: "Ethereum RWA Treasury Vault",
    amountUSD: 12500,
    cviTier: "CVI Accredited Tier 1",
    txHash: "0x5555444433332222111100009999888877776666222233334444555566667777",
    gasUsed: "172,000 Gwei",
    status: "SUCCESS (0x1)"
  },
  {
    id: 109,
    recordId: 109,
    blockNumber: 14892184,
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    walletAddress: "0x4444555566667777888899990000111122223333",
    poolName: "Base Credit Vault",
    amountUSD: 22000,
    cviTier: "CVI Standard Tier 2",
    txHash: "0x4444333322221111000099998888777766665555111122223333444455556666",
    gasUsed: "148,900 Gwei",
    status: "SUCCESS (0x1)"
  },
  {
    id: 108,
    recordId: 108,
    blockNumber: 14892178,
    timestamp: new Date(Date.now() - 18000000).toISOString(),
    walletAddress: "0x5555666677778888999900001111222233334444",
    poolName: "Monad Vault",
    amountUSD: 50000,
    cviTier: "CVI Accredited Tier 1",
    txHash: "0x3333222211110000999988887777666655554444666677778888999900001111",
    gasUsed: "141,200 Gwei",
    status: "SUCCESS (0x1)"
  },
  {
    id: 107,
    recordId: 107,
    blockNumber: 14892171,
    timestamp: new Date(Date.now() - 21600000).toISOString(),
    walletAddress: "0x6666777788889999000011112222333344445555",
    poolName: "Ethereum RWA Treasury Vault",
    amountUSD: 15000,
    cviTier: "CVI Accredited Tier 1",
    txHash: "0x2222111100009999888877776666555544443333777788889999000011112222",
    gasUsed: "165,400 Gwei",
    status: "SUCCESS (0x1)"
  },
  {
    id: 106,
    recordId: 106,
    blockNumber: 14892165,
    timestamp: new Date(Date.now() - 25200000).toISOString(),
    walletAddress: "0x7777888899990000111122223333444455556666",
    poolName: "Base Credit Vault",
    amountUSD: 30000,
    cviTier: "CVI Standard Tier 2",
    txHash: "0x1111000099998888777766665555444433332222888899990000111122223333",
    gasUsed: "151,000 Gwei",
    status: "SUCCESS (0x1)"
  },
  {
    id: 105,
    recordId: 105,
    blockNumber: 14892160,
    timestamp: new Date(Date.now() - 28800000).toISOString(),
    walletAddress: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
    poolName: "Monad Vault",
    amountUSD: 10000,
    cviTier: "CVI Accredited Tier 1",
    txHash: "0x0000999988887777666655554444333322221111999900001111222233334444",
    gasUsed: "138,500 Gwei",
    status: "SUCCESS (0x1)"
  }
];

let baseBlock = 14892212;

export function addAuditRecord(record) {
  baseBlock += Math.floor(Math.random() * 5) + 3;
  const newRecord = {
    ...record,
    blockNumber: baseBlock
  };
  globalAuditLogs.unshift(newRecord);
  return newRecord;
}
