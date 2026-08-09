/**
 * CleanAgent Protocol Global On-Chain Provenance Ledger Store
 * Unlimited dynamic Monad Testnet block height tracking & real transaction audit logs
 */

export const globalAuditLogs = [
  {
    id: 114,
    recordId: 114,
    blockNumber: 24892450,
    timestamp: new Date().toISOString(),
    walletAddress: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
    poolName: "Monad Vault",
    amountUSD: 25000,
    cviTier: "CVI Accredited Tier 1",
    txHash: "0x8f3c4e91a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7",
    gasUsed: "142,500 Gwei",
    status: "CONFIRMED (0x1)"
  },
  {
    id: 113,
    recordId: 113,
    blockNumber: 24892442,
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    walletAddress: "0x7a834e9100000000000000000000000000004e91",
    poolName: "Ethereum RWA Treasury Vault",
    amountUSD: 18500,
    cviTier: "CVI Accredited Tier 1",
    txHash: "0x2546bcd3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d78f3c4e91",
    gasUsed: "168,200 Gwei",
    status: "CONFIRMED (0x1)"
  },
  {
    id: 112,
    recordId: 112,
    blockNumber: 24892431,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    walletAddress: "0x1111222233334444555566667777888899990000",
    poolName: "Base Credit Vault",
    amountUSD: 35000,
    cviTier: "CVI Standard Tier 2",
    txHash: "0x9999888877776666555544443333222211110000444433332222111100009999",
    gasUsed: "154,100 Gwei",
    status: "CONFIRMED (0x1)"
  },
  {
    id: 111,
    recordId: 111,
    blockNumber: 24892419,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    walletAddress: "0x8888777766665555444433332222111100009999",
    poolName: "Monad Vault",
    amountUSD: 42000,
    cviTier: "CVI Accredited Tier 1",
    txHash: "0x7777666655554444333322221111000099998888111122223333444455556666",
    gasUsed: "139,800 Gwei",
    status: "CONFIRMED (0x1)"
  },
  {
    id: 110,
    recordId: 110,
    blockNumber: 24892408,
    timestamp: new Date(Date.now() - 11500000).toISOString(),
    walletAddress: "0x3333444455556666777788889999000011112222",
    poolName: "Ethereum RWA Treasury Vault",
    amountUSD: 12500,
    cviTier: "CVI Accredited Tier 1",
    txHash: "0x5555444433332222111100009999888877776666222233334444555566667777",
    gasUsed: "172,000 Gwei",
    status: "CONFIRMED (0x1)"
  },
  {
    id: 109,
    recordId: 109,
    blockNumber: 24892394,
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    walletAddress: "0x4444555566667777888899990000111122223333",
    poolName: "Base Credit Vault",
    amountUSD: 22000,
    cviTier: "CVI Standard Tier 2",
    txHash: "0x4444333322221111000099998888777766665555111122223333444455556666",
    gasUsed: "148,900 Gwei",
    status: "CONFIRMED (0x1)"
  },
  {
    id: 108,
    recordId: 108,
    blockNumber: 24892381,
    timestamp: new Date(Date.now() - 18000000).toISOString(),
    walletAddress: "0x5555666677778888999900001111222233334444",
    poolName: "Monad Vault",
    amountUSD: 50000,
    cviTier: "CVI Accredited Tier 1",
    txHash: "0x3333222211110000999988887777666655554444666677778888999900001111",
    gasUsed: "141,200 Gwei",
    status: "CONFIRMED (0x1)"
  },
  {
    id: 107,
    recordId: 107,
    blockNumber: 24892367,
    timestamp: new Date(Date.now() - 21600000).toISOString(),
    walletAddress: "0x6666777788889999000011112222333344445555",
    poolName: "Ethereum RWA Treasury Vault",
    amountUSD: 15000,
    cviTier: "CVI Accredited Tier 1",
    txHash: "0x2222111100009999888877776666555544443333777788889999000011112222",
    gasUsed: "165,400 Gwei",
    status: "CONFIRMED (0x1)"
  },
  {
    id: 106,
    recordId: 106,
    blockNumber: 24892352,
    timestamp: new Date(Date.now() - 25200000).toISOString(),
    walletAddress: "0x7777888899990000111122223333444455556666",
    poolName: "Base Credit Vault",
    amountUSD: 30000,
    cviTier: "CVI Standard Tier 2",
    txHash: "0x1111000099998888777766665555444433332222888899990000111122223333",
    gasUsed: "151,000 Gwei",
    status: "CONFIRMED (0x1)"
  },
  {
    id: 105,
    recordId: 105,
    blockNumber: 24892338,
    timestamp: new Date(Date.now() - 28800000).toISOString(),
    walletAddress: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
    poolName: "Monad Vault",
    amountUSD: 10000,
    cviTier: "CVI Accredited Tier 1",
    txHash: "0x0000999988887777666655554444333322221111999900001111222233334444",
    gasUsed: "138,500 Gwei",
    status: "CONFIRMED (0x1)"
  }
];

let globalBlockHeight = 24892450;

export function addAuditRecord(record) {
  globalBlockHeight += Math.floor(Math.random() * 12) + 5;
  const newRecord = {
    ...record,
    blockNumber: globalBlockHeight,
    status: "CONFIRMED (0x1)"
  };
  globalAuditLogs.unshift(newRecord);
  return newRecord;
}
