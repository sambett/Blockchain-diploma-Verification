import pkg from "hardhat";
const { ethers } = pkg;

/**
 * Utility script for common diploma registry operations
 * Run with: npx hardhat run scripts/utils.js --network localhost
 */

class DiplomaUtils {
  constructor(registryAddress) {
    this.registryAddress = registryAddress;
    this.registry = null;
  }

  async init() {
    const DiplomaRegistry = await ethers.getContractFactory("DiplomaRegistry");
    this.registry = DiplomaRegistry.attach(this.registryAddress);
    console.log(`📋 Connected to DiplomaRegistry at: ${this.registryAddress}\n`);
  }

  async getContractInfo() {
    console.log("📊 Contract Information:");
    console.log(`   Address: ${this.registryAddress}`);
    console.log(`   Network: ${pkg.network.name}`);
    
    const ADMIN_ROLE = await this.registry.ADMIN_ROLE();
    const UNIVERSITY_ROLE = await this.registry.UNIVERSITY_ROLE();
    
    console.log(`   Admin Role: ${ADMIN_ROLE}`);
    console.log(`   University Role: ${UNIVERSITY_ROLE}\n`);
  }

  async authorizeUniversity(universityName, universityAddress) {
    console.log(`🏛️ Authorizing university: ${universityName}`);
    console.log(`   Address: ${universityAddress}`);
    
    try {
      const tx = await this.registry.authorizeUniversity(universityName, universityAddress);
      await tx.wait();
      console.log(`   ✅ Success! Transaction: ${tx.hash}\n`);
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }

  async issueDiploma(universityName, diplomaContent, degreeType = "GENERAL") {
    console.log(`📜 Issuing diploma for: ${universityName}`);
    
    const diplomaHash = ethers.keccak256(ethers.toUtf8Bytes(diplomaContent));
    const degreeTypeHash = ethers.keccak256(ethers.toUtf8Bytes(degreeType));
    
    console.log(`   Content: ${diplomaContent}`);
    console.log(`   Hash: ${diplomaHash}`);
    console.log(`   Degree Type: ${degreeType}`);
    
    try {
      const tx = await this.registry.issueDiploma(diplomaHash, universityName, degreeTypeHash);
      await tx.wait();
      console.log(`   ✅ Success! Transaction: ${tx.hash}\n`);
      return diplomaHash;
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
      return null;
    }
  }

  async verifyDiploma(diplomaContent, universityName) {
    console.log(`🔍 Verifying diploma from: ${universityName}`);
    
    const diplomaHash = ethers.keccak256(ethers.toUtf8Bytes(diplomaContent));
    console.log(`   Hash: ${diplomaHash}`);
    
    try {
      const result = await this.registry.verifyDiploma(diplomaHash, universityName);
      
      console.log(`   📊 Verification Results:`);
      console.log(`      Valid: ${result.isValid ? "✅ YES" : "❌ NO"}`);
      console.log(`      Exists: ${result.exists ? "✅ YES" : "❌ NO"}`);
      console.log(`      Issuer: ${result.issuer}`);
      console.log(`      Issued At: ${new Date(Number(result.issuedAt) * 1000).toLocaleString()}`);
      console.log(`      Revoked: ${result.revoked ? "❌ YES" : "✅ NO"}`);
      console.log(`      Degree Type Hash: ${result.degreeType}\n`);
      
      return result;
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
      return null;
    }
  }

  async listUniversityStatus(universityNames) {
    console.log("🏛️ University Status Report:");
    
    for (const name of universityNames) {
      const isAuthorized = await this.registry.isUniversityAuthorized(name);
      const address = await this.registry.getUniversityAddress(name);
      
      console.log(`   ${name}:`);
      console.log(`      Authorized: ${isAuthorized ? "✅ YES" : "❌ NO"}`);
      console.log(`      Address: ${address === ethers.ZeroAddress ? "Not set" : address}`);
    }
    console.log();
  }

  async generateSampleData() {
    console.log("🎲 Generating sample test data...\n");
    
    const [admin, univ1, univ2, univ3] = await ethers.getSigners();
    
    // Sample universities
    const universities = [
      { name: "Harvard University", address: univ1.address },
      { name: "MIT", address: univ2.address },
      { name: "Stanford University", address: univ3.address }
    ];
    
    // Authorize universities (as admin)
    for (const univ of universities) {
      await this.authorizeUniversity(univ.name, univ.address);
    }
    
    // Sample diplomas
    const diplomas = [
      { 
        university: "Harvard University",
        content: "John Doe - Bachelor of Computer Science - Harvard University - 2024",
        degree: "BACHELOR_CS",
        signer: univ1
      },
      {
        university: "MIT", 
        content: "Jane Smith - Master of Business Administration - MIT - 2024",
        degree: "MASTER_MBA",
        signer: univ2
      },
      {
        university: "Stanford University",
        content: "Bob Johnson - Doctor of Philosophy - Stanford University - 2024", 
        degree: "DOCTORATE_PHD",
        signer: univ3
      }
    ];
    
    // Issue diplomas (as respective universities)
    for (const diploma of diplomas) {
      const signer = await ethers.getImpersonatedSigner(diploma.signer.address);
      const registryWithSigner = this.registry.connect(signer);
      
      const diplomaHash = ethers.keccak256(ethers.toUtf8Bytes(diploma.content));
      const degreeTypeHash = ethers.keccak256(ethers.toUtf8Bytes(diploma.degree));
      
      try {
        const tx = await registryWithSigner.issueDiploma(diplomaHash, diploma.university, degreeTypeHash);
        await tx.wait();
        console.log(`📜 Issued: ${diploma.content}`);
        console.log(`   Hash: ${diplomaHash}`);
        console.log(`   Transaction: ${tx.hash}\n`);
      } catch (error) {
        console.log(`❌ Failed to issue: ${error.message}\n`);
      }
    }
    
    console.log("✅ Sample data generation completed!\n");
    return { universities, diplomas };
  }
}

// Main execution function
async function main() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update with actual address
  
  const utils = new DiplomaUtils(contractAddress);
  await utils.init();
  
  // Display usage instructions
  console.log("🚀 Diploma Registry Utilities");
  console.log("============================\n");
  
  await utils.getContractInfo();
  
  // Example usage (uncomment to run):
  
  // 1. Generate sample data
  // await utils.generateSampleData();
  
  // 2. Check university statuses
  // await utils.listUniversityStatus(["Harvard University", "MIT", "Stanford University"]);
  
  // 3. Verify a diploma
  // await utils.verifyDiploma("John Doe - Bachelor of Computer Science - Harvard University - 2024", "Harvard University");
  
  console.log("💡 Usage Examples:");
  console.log("   - Uncomment the function calls in main() to run specific operations");
  console.log("   - Modify the contractAddress variable to point to your deployed contract");
  console.log("   - Use this script as a template for your own utility functions\n");
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default DiplomaUtils;
