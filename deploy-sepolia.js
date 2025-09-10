#!/usr/bin/env node

/**
 * Deploy Diploma Verification System to Sepolia Testnet
 * 
 * Prerequisites:
 * 1. Set PRIVATE_KEY in .env file
 * 2. Ensure you have Sepolia ETH for gas fees
 * 3. Run: npm run deploy:sepolia
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Deploying Diploma Verification System to Sepolia Testnet...\n');

// Check if .env file exists and has required variables
const envPath = '.env';
if (!fs.existsSync(envPath)) {
    console.error('❌ Error: .env file not found!');
    console.log('Please create a .env file with your PRIVATE_KEY');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
if (!envContent.includes('PRIVATE_KEY=') || envContent.includes('PRIVATE_KEY=\n') || envContent.includes('PRIVATE_KEY=\r\n')) {
    console.error('❌ Error: PRIVATE_KEY not set in .env file!');
    console.log('Please add your private key to the .env file:');
    console.log('PRIVATE_KEY=your_private_key_here');
    process.exit(1);
}

try {
    // Deploy to Sepolia
    console.log('📡 Deploying smart contract to Sepolia...');
    const deployOutput = execSync('npm run deploy:sepolia', { encoding: 'utf8' });
    console.log(deployOutput);
    
    // Extract contract address from deployment output
    const addressMatch = deployOutput.match(/DiplomaRegistryModule#DiplomaRegistry - (0x[a-fA-F0-9]{40})/);
    
    if (addressMatch) {
        const contractAddress = addressMatch[1];
        console.log(`✅ Contract deployed successfully!`);
        console.log(`📍 Contract Address: ${contractAddress}`);
        console.log(`🌐 Network: Sepolia Testnet`);
        console.log(`🔗 Etherscan: https://sepolia.etherscan.io/address/${contractAddress}`);
        
        // Update .env file with contract address
        let envContent = fs.readFileSync('.env', 'utf8');
        envContent = envContent.replace(/CONTRACT_ADDRESS=.*/, `CONTRACT_ADDRESS=${contractAddress}`);
        envContent = envContent.replace(/VITE_CONTRACT_ADDRESS=.*/, `VITE_CONTRACT_ADDRESS=${contractAddress}`);
        fs.writeFileSync('.env', envContent);
        
        console.log('\n📝 Updated .env file with contract address');
        
        // Update frontend configuration
        const frontendConfigPath = 'frontend/src/index.html';
        if (fs.existsSync(frontendConfigPath)) {
            let frontendContent = fs.readFileSync(frontendConfigPath, 'utf8');
            frontendContent = frontendContent.replace(
                /sepolia: null/g, 
                `sepolia: '${contractAddress}'`
            );
            fs.writeFileSync(frontendConfigPath, frontendContent);
            console.log('📝 Updated frontend with Sepolia contract address');
        }
        
        console.log('\n🎉 Deployment completed successfully!');
        console.log('\n📋 Next Steps:');
        console.log('1. Visit the frontend application');
        console.log('2. Switch MetaMask to Sepolia network');
        console.log('3. Connect your wallet');
        console.log('4. Test the application with the deployed contract');
        console.log('\n💡 Pro tip: You can get Sepolia ETH from: https://sepoliafaucet.com/');
        
    } else {
        console.error('❌ Error: Could not extract contract address from deployment output');
        console.log('Check the deployment logs above for details');
    }
    
} catch (error) {
    console.error('❌ Deployment failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check that your .env file has a valid PRIVATE_KEY');
    console.log('2. Ensure you have Sepolia ETH for gas fees');
    console.log('3. Verify your internet connection');
    console.log('4. Check that Sepolia RPC URL is accessible');
    process.exit(1);
}
