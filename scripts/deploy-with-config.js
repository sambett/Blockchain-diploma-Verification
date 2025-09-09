import pkg from "hardhat";
import fs from 'fs';
import path from 'path';
const { ethers } = pkg;

async function main() {
  console.log("🚀 Starting DiplomaRegistry deployment...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📋 Deploying with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Get network info
  const network = await ethers.provider.getNetwork();
  const networkName = network.name === 'unknown' ? 'localhost' : network.name;
  
  console.log("🌐 Network:", networkName);
  console.log("🆔 Chain ID:", network.chainId.toString());

  // Deploy the contract
  console.log("📄 Deploying DiplomaRegistry contract...");
  const DiplomaRegistry = await ethers.getContractFactory("DiplomaRegistry");
  const diplomaRegistry = await DiplomaRegistry.deploy();
  await diplomaRegistry.waitForDeployment();

  const contractAddress = await diplomaRegistry.getAddress();
  console.log("✅ DiplomaRegistry deployed to:", contractAddress);
  
  // Verify the admin role
  const ADMIN_ROLE = await diplomaRegistry.ADMIN_ROLE();
  const hasAdminRole = await diplomaRegistry.hasRole(ADMIN_ROLE, deployer.address);
  console.log("🔑 Deployer has admin role:", hasAdminRole);

  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    adminAddress: deployer.address,
    deploymentTime: new Date().toISOString(),
    network: networkName,
    chainId: network.chainId.toString(),
    txHash: diplomaRegistry.deploymentTransaction()?.hash
  };

  // Update frontend configuration
  await updateFrontendConfig(networkName, contractAddress);

  // Save deployment artifact
  await saveDeploymentArtifact(deploymentInfo);

  console.log("\n🎯 Next steps:");
  console.log("1. Frontend configuration updated automatically");
  console.log("2. Authorize universities using authorizeUniversity()");
  console.log("3. Universities can issue diplomas using issueDiploma()");
  console.log("4. Anyone can verify diplomas using verifyDiploma()");
  
  console.log("\n📋 Contract Summary:");
  console.log("- Contract Address:", contractAddress);
  console.log("- Admin Address:", deployer.address);
  console.log("- Network:", networkName);
  console.log("- Chain ID:", network.chainId.toString());
  
  console.log("\n💾 Deployment completed successfully!");
  console.log("📄 Contract ABI available in artifacts/contracts/DiplomaRegistry.sol/DiplomaRegistry.json");
  
  return deploymentInfo;
}

/**
 * Update frontend contract configuration
 */
async function updateFrontendConfig(networkName, contractAddress) {
  const configPath = path.join(process.cwd(), 'frontend', 'src', 'config', 'contracts.js');
  
  try {
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Update the contract address for the specific network
    const networkKey = networkName === 'unknown' ? 'localhost' : networkName;
    const regex = new RegExp(`(${networkKey}:\\s*)['"\\w]*`, 'g');
    configContent = configContent.replace(regex, `$1'${contractAddress}'`);
    
    fs.writeFileSync(configPath, configContent);
    console.log(`✅ Updated frontend config: ${networkKey} -> ${contractAddress}`);
    
  } catch (error) {
    console.warn("⚠️ Could not update frontend config:", error.message);
    console.log("📝 Manual update needed in frontend/src/config/contracts.js");
    console.log(`   Set ${networkName}: '${contractAddress}'`);
  }
}

/**
 * Save deployment artifact
 */
async function saveDeploymentArtifact(deploymentInfo) {
  const artifactPath = path.join(process.cwd(), 'deployments', `${deploymentInfo.network}.json`);
  
  try {
    // Ensure deployments directory exists
    const deploymentsDir = path.dirname(artifactPath);
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }
    
    fs.writeFileSync(artifactPath, JSON.stringify(deploymentInfo, null, 2));
    console.log(`✅ Deployment artifact saved: ${artifactPath}`);
    
  } catch (error) {
    console.warn("⚠️ Could not save deployment artifact:", error.message);
  }
}

// Execute deployment
main()
  .then((info) => {
    console.log("\n🎉 Deployment completed successfully!");
    console.log("📄 Deployment Info:");
    console.log(JSON.stringify(info, null, 2));
    
    console.log("\n🔗 Quick Test Commands:");
    console.log("npm run node          # Start local blockchain");
    console.log("npm run test          # Run contract tests");
    console.log("npm run frontend:start # Start frontend");
    
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
