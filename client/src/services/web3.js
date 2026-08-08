import { ethers } from 'ethers';

/**
 * Web3 Provider Service
 * Handles MetaMask, Phantom, Coinbase Wallet, and Injected EIP-1193 Provider connections
 */

// Supported Networks
export const SUPPORTED_NETWORKS = {
  "cleanverse": {
    chainId: "0x13881",
    chainName: "Cleanverse EVM Protocol Testnet",
    nativeCurrency: { name: "Cleanverse Token", symbol: "CLNV", decimals: 18 },
    rpcUrls: ["https://rpc.cleanverse.network"],
    blockExplorerUrls: ["https://explorer.cleanverse.network"]
  },
  "ethereum": {
    chainId: "0x1",
    chainName: "Ethereum Mainnet",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://eth.llamarpc.com"],
    blockExplorerUrls: ["https://etherscan.io"]
  },
  "base": {
    chainId: "0x2105",
    chainName: "Base Mainnet",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://mainnet.base.org"],
    blockExplorerUrls: ["https://basescan.org"]
  }
};

/**
 * Connect EVM Wallet (MetaMask, Phantom EVM, Coinbase Wallet)
 */
export async function connectEVMWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(accounts[0]);

      return {
        success: true,
        walletType: "MetaMask / Injected EVM",
        address: accounts[0],
        chainId: network.chainId.toString(),
        balanceEth: ethers.formatEther(balance),
        signer,
        provider
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  } else {
    return { success: false, error: "MetaMask or Web3 wallet extension not detected in browser." };
  }
}

/**
 * Connect Phantom Wallet (Solana / EVM)
 */
export async function connectPhantomWallet() {
  if (window.solana && window.solana.isPhantom) {
    try {
      const resp = await window.solana.connect();
      return {
        success: true,
        walletType: "Phantom Wallet",
        address: resp.publicKey.toString(),
        chain: "Solana / EVM Dual",
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  } else if (typeof window.ethereum !== 'undefined' && window.ethereum.isPhantom) {
    return connectEVMWallet();
  } else {
    return { success: false, error: "Phantom Wallet extension not found." };
  }
}
