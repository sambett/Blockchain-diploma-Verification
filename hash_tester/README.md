# 🧪 PDF Hash Generator - keccak256 with ethers.js

## 🎯 What This Is

This directory provides tools to generate **keccak256** hashes from PDF files using **ethers.js**. This is the **exact same hashing algorithm** used in Ethereum and our smart contracts.

## 🚀 How to Generate keccak256 Hash with Node.js

### Step 1: Setup Node.js Environment
```bash
# Navigate to hash_tester directory
cd hash_tester

# Initialize npm (if package.json doesn't exist)
npm init -y

# Install ethers.js
npm install ethers
```

### Step 2: Create Hash Generator Script

Create a file called `generate_hash.js`:

```javascript
import { ethers } from 'ethers';
import fs from 'fs';

/**
 * Generate keccak256 hash of a PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {string} - keccak256 hash (with 0x prefix)
 */
function generatePDFHash(filePath) {
    try {
        // Read the PDF file as bytes
        const fileBuffer = fs.readFileSync(filePath);
        
        // Generate keccak256 hash (same as Ethereum uses)
        const hash = ethers.keccak256(fileBuffer);
        
        return hash;
    } catch (error) {
        console.error('Error reading file:', error.message);
        return null;
    }
}

// Example usage
const pdfPath = './sample_diploma.pdf'; // Replace with your PDF path
const hash = generatePDFHash(pdfPath);

if (hash) {
    console.log('📄 File:', pdfPath);
    console.log('🔐 keccak256 Hash:', hash);
    console.log('📏 Hash Length:', hash.length);
    console.log('✅ Ready for blockchain storage!');
} else {
    console.log('❌ Failed to generate hash');
}
```

### Step 3: Run the Hash Generator

```bash
# Run the script
node generate_hash.js
```

**Expected Output:**
```
📄 File: ./sample_diploma.pdf
🔐 keccak256 Hash: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
📏 Hash Length: 66
✅ Ready for blockchain storage!
```

## 🧪 Testing Experiments

### Experiment 1: Same File Test
```bash
# Generate hash twice for the same file
node generate_hash.js
node generate_hash.js
# Result: Identical hashes every time
```

### Experiment 2: Different Files Test
```bash
# Hash different PDF files
# Modify the pdfPath in generate_hash.js for each file
# Result: Completely different hashes
```

### Experiment 3: Modified File Test
```bash
# 1. Hash original PDF
# 2. Make tiny change to PDF (add one character)
# 3. Hash modified PDF
# Result: Completely different hash
```

## 🔗 Integration with Smart Contract

The hash you generate here is **exactly** what gets stored in the DiplomaRegistry contract:

```solidity
// This is how your hash gets stored on blockchain
function issueDiploma(
    bytes32 diplomaHash,  // <- Your keccak256 hash goes here
    string memory universityName,
    bytes32 degreeType
) external {
    // Contract stores your hash permanently
    diplomas[diplomaHash] = DiplomaRecord({...});
}
```

## 📋 Browser Alternative (for testing)

If you prefer browser testing, create `test_hash.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>keccak256 PDF Hash Tester</title>
    <script src="https://cdn.ethers.io/lib/ethers-5.6.9.umd.min.js"></script>
</head>
<body>
    <h2>🔐 PDF keccak256 Hash Generator</h2>
    <input type="file" id="pdfInput" accept=".pdf">
    <button onclick="generateHash()">Generate keccak256 Hash</button>
    <div id="result"></div>

    <script>
        async function generateHash() {
            const fileInput = document.getElementById('pdfInput');
            const file = fileInput.files[0];
            
            if (!file) {
                alert('Please select a PDF file');
                return;
            }
            
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            
            // Generate keccak256 hash using ethers.js
            const hash = ethers.utils.keccak256(uint8Array);
            
            document.getElementById('result').innerHTML = `
                <h3>Results:</h3>
                <p><strong>File:</strong> ${file.name}</p>
                <p><strong>Size:</strong> ${file.size} bytes</p>
                <p><strong>keccak256 Hash:</strong> <code>${hash}</code></p>
                <p><strong>Ready for blockchain! ✅</strong></p>
            `;
        }
    </script>
</body>
</html>
```

## 🔧 Technical Details

- **Hash Algorithm**: keccak256 (Ethereum-compatible)
- **Library**: ethers.js (industry standard)
- **Output Format**: 32-byte hash with "0x" prefix (66 characters total)
- **Compatibility**: Direct input to smart contracts

## ⚠️ Important Notes

1. **Use keccak256, NOT SHA-256**: Our smart contracts expect keccak256
2. **Consistent Results**: Same file = Same hash, always
3. **Case Sensitive**: Hash includes "0x" prefix
4. **Production Ready**: This exact code works with the blockchain

## 🚀 Next Steps

1. Test with sample PDF files
2. Integrate this logic into the React frontend
3. Use these hashes in smart contract deployment tests
4. Store hashes on Sepolia testnet

---
**Status**: ✅ keccak256 Compatible  
**Algorithm**: keccak256 (Ethereum Standard)  
**Library**: ethers.js  
**Dependencies**: Node.js + ethers
