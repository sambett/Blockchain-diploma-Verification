// config/contracts.js
// This file manages contract addresses and network configurations

/**
 * Network configurations for different environments
 */
export const NETWORKS = {
  localhost: {
    name: 'Localhost',
    chainId: 31337,
    rpcUrl: 'http://127.0.0.1:8545',
    blockExplorer: 'http://localhost:8545'
  },
  sepolia: {
    name: 'Sepolia Testnet',
    chainId: 11155111,
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/AAYo6M97q2EH6ob8ohhYg',
    blockExplorer: 'https://sepolia.etherscan.io'
  }
};

/**
 * Contract addresses for different networks
 * These will be automatically updated by deployment scripts
 */
export const CONTRACT_ADDRESSES = {
  localhost: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Hardhat default
  sepolia: null // Will be set after deployment
};

/**
 * Get current network configuration
 */
export function getCurrentNetwork() {
  // Try to detect from MetaMask first
  if (typeof window !== 'undefined' && window.ethereum) {
    return detectNetworkFromMetaMask();
  }
  
  // Fallback to environment or localhost
  const chainId = '31337'; // Default to localhost for testing
  return Object.values(NETWORKS).find(network => 
    network.chainId.toString() === chainId
  ) || NETWORKS.localhost;
}

/**
 * Get contract address for current network
 */
export function getContractAddress(network = null) {
  const currentNetwork = network || getCurrentNetwork();
  const networkName = Object.keys(NETWORKS).find(key => 
    NETWORKS[key].chainId === currentNetwork.chainId
  );
  
  const address = CONTRACT_ADDRESSES[networkName];
  
  if (!address) {
    throw new Error(`Contract not deployed on ${currentNetwork.name} (Chain ID: ${currentNetwork.chainId})`);
  }
  
  return address;
}

/**
 * Detect network from MetaMask
 */
async function detectNetworkFromMetaMask() {
  if (!window.ethereum) return NETWORKS.localhost;
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const numericChainId = parseInt(chainId, 16);
    
    return Object.values(NETWORKS).find(network => 
      network.chainId === numericChainId
    ) || NETWORKS.localhost;
  } catch (error) {
    console.warn('Could not detect network from MetaMask:', error);
    return NETWORKS.localhost;
  }
}

/**
 * Update contract address after deployment
 */
export function updateContractAddress(network, address) {
  CONTRACT_ADDRESSES[network] = address;
  
  // Save to localStorage for persistence
  localStorage.setItem(`contract_address_${network}`, address);
  console.log(`Updated ${network} contract address to: ${address}`);
}

/**
 * Load contract addresses from localStorage
 */
export function loadContractAddresses() {
  Object.keys(NETWORKS).forEach(network => {
    const stored = localStorage.getItem(`contract_address_${network}`);
    if (stored) {
      CONTRACT_ADDRESSES[network] = stored;
    }
  });
}

/**
 * Validate network and prompt user to switch if needed
 */
export async function ensureCorrectNetwork(targetNetwork = 'sepolia') {
  if (!window.ethereum) {
    throw new Error('MetaMask not detected');
  }
  
  const currentNetwork = await detectNetworkFromMetaMask();
  const target = NETWORKS[targetNetwork];
  
  if (currentNetwork.chainId !== target.chainId) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${target.chainId.toString(16)}` }],
      });
    } catch (switchError) {
      // If network doesn't exist in MetaMask, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${target.chainId.toString(16)}`,
              chainName: target.name,
              rpcUrls: [target.rpcUrl],
              blockExplorerUrls: [target.blockExplorer],
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  }
}
