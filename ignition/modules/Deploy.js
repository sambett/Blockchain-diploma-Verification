import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Deployment module for DiplomaRegistry contract
 * This module deploys the main diploma verification contract
 */
export default buildModule("DiplomaRegistryModule", (m) => {
  // Deploy DiplomaRegistry contract
  // The constructor will automatically set the deployer as admin
  const diplomaRegistry = m.contract("DiplomaRegistry", [], {
    // Optional: specify deployment options here
    // gasLimit: 3000000,
    // gasPrice: ethers.utils.parseUnits("20", "gwei")
  });

  // Return deployed contract instance
  return { diplomaRegistry };
});
