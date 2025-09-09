import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  console.log("🚀 Starting DiplomaRegistry deployment...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📋 Deploying with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

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

  console.log("\n🎯 Next steps:");
  console.log("1. Authorize universities using authorizeUniversity()");
  console.log("2. Universities can issue diplomas using issueDiploma()");
  console.log("3. Anyone can verify diplomas using verifyDiploma()");
  
  console.log("\n📋 Contract Summary:");
  console.log("- Contract Address:", contractAddress);
  console.log("- Admin Address:", deployer.address);
  console.log("- Network:", (await ethers.provider.getNetwork()).name);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    adminAddress: deployer.address,
    deploymentTime: new Date().toISOString(),
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString()
  };

  console.log("\n💾 Deployment completed successfully!");
  console.log("📄 Contract ABI available in artifacts/contracts/DiplomaRegistry.sol/DiplomaRegistry.json");
  
  return deploymentInfo;
}

// Execute deployment
main()
  .then((info) => {
    console.log("\n🎉 Deployment Info:", JSON.stringify(info, null, 2));
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
