# 🎓 Blockchain Diploma Verification System

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.24-blue.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Built%20with-Hardhat-yellow.svg)](https://hardhat.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D18.0.0-green.svg)](https://nodejs.org/)

A decentralized diploma verification system built on Ethereum blockchain that ensures the authenticity and integrity of academic credentials while maintaining privacy and security.

## 🌟 Features

### 🏛️ **For Universities**
- **Authorize Universities**: Admins can authorize universities to issue diplomas
- **Issue Diplomas**: Upload PDF diplomas and record their cryptographic hash on-chain
- **Manage Credentials**: View all issued diplomas and their verification status
- **Privacy-First**: Only document hashes are stored on-chain, not personal data

### 🔍 **For Verifiers**
- **Instant Verification**: Upload a diploma PDF and university name to verify authenticity
- **Real-time Results**: Get verification results within 2 seconds
- **Tamper Detection**: Detect any modifications to the original diploma
- **Public Access**: Anyone can verify diplomas without special permissions

### ⚡ **Technical Features**
- **Gas Optimized**: Efficient smart contract design minimizing transaction costs
- **Scalable Architecture**: Modular design supporting multiple universities
- **Revocation Support**: Universities can revoke compromised diplomas
- **Event Logging**: Complete audit trail of all diploma operations

## 🏗️ Architecture

```
📁 diploma_verif/
├── 📂 contracts/          # Smart contracts (Solidity)
│   └── DiplomaRegistry.sol
├── 📂 frontend/           # Web interface
│   ├── 📂 src/
│   └── 📂 public/
├── 📂 scripts/            # Deployment & utility scripts
├── 📂 test/              # Smart contract tests
├── 📂 ignition/          # Hardhat Ignition deployment modules
└── 📂 docs/              # Documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn**
- **MetaMask** browser extension
- **Git**

### 1. Clone & Setup

```bash
# Clone the repository
git clone https://github.com/sambett/Blockchain-diploma-Verification.git
cd Blockchain-diploma-Verification

# Install dependencies
npm run setup
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Add your private key for Sepolia deployment (optional)
```

### 3. Development Setup

```bash
# Start local blockchain
npm run node

# Deploy contracts (in a new terminal)
npm run deploy:local

# Start frontend
npm run frontend:serve
```

### 4. Access Application

Open your browser and navigate to:
- **Frontend**: http://localhost:8080
- **Local Network**: http://127.0.0.1:8545

## 📋 Available Scripts

### 🔧 **Development**
```bash
npm run setup              # Install all dependencies
npm run compile           # Compile smart contracts
npm run test             # Run contract tests
npm run test:verbose     # Run tests with detailed output
```

### 🚀 **Deployment**
```bash
npm run node             # Start local Hardhat network
npm run deploy:local     # Deploy to local network
npm run verify:deployment # Verify deployment
```

### 🌐 **Frontend**
```bash
npm run frontend:serve     # Serve frontend (Python)
npm run frontend:serve:alt # Serve frontend (http-server)
```

### 🔄 **Utilities**
```bash
npm run utils            # Run utility scripts
npm run clean           # Clean artifacts
npm run clean:all       # Clean all build files
npm run status          # Check project status
```

### ⚡ **Full Development**
```bash
npm run dev:full        # Start network + deploy + frontend
```

## 🔧 Configuration

### Network Configuration

The project supports multiple networks:

- **Local Development**: Hardhat Network (Chain ID: 31337)

### MetaMask Setup

1. **Add Local Network**:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

2. **Import Test Account**: Use one of the private keys from `npx hardhat node`

## 📖 Usage Guide

### 👨‍💼 **Admin Workflow**

1. **Deploy Contract**: Admin deploys the DiplomaRegistry contract
2. **Authorize Universities**: Admin grants UNIVERSITY_ROLE to educational institutions
3. **Monitor System**: Track diploma issuance and verification activities

### 🏫 **University Workflow**

1. **Connect Wallet**: University connects with authorized account
2. **Upload Diploma**: Select PDF diploma file
3. **Issue on Blockchain**: System calculates hash and records on-chain
4. **Share with Student**: Provide diploma file to graduate

### 🔍 **Verification Workflow**

1. **Access Verification Portal**: Open the public verification interface
2. **Upload Diploma**: Select the PDF diploma to verify
3. **Enter University**: Input the issuing university name
4. **Get Results**: Receive instant verification status

### Example Verification Result:
```
✅ DIPLOMA VERIFIED
📄 Document: Master_Degree_Computer_Science.pdf
🏛️ Issuer: University of Sfax
📅 Issue Date: 2024-09-21
🔒 Status: Valid & Authentic
```

## 🧪 Testing

### Run Complete Test Suite
```bash
npm test
```

### Test Categories
- **Unit Tests**: Individual function testing
- **Integration Tests**: Contract interaction testing
- **Gas Optimization Tests**: Cost efficiency validation
- **Security Tests**: Access control and vulnerability testing

### Example Test Output
```
✅ DiplomaRegistry Tests
  ✅ Should deploy correctly
  ✅ Should authorize universities
  ✅ Should issue diplomas
  ✅ Should verify diplomas
  ✅ Should revoke diplomas
  ✅ Should handle edge cases
```

## 🔐 Security Features

### Smart Contract Security
- **Access Control**: Role-based permissions using OpenZeppelin
- **Reentrancy Protection**: Prevents reentrancy attacks
- **Input Validation**: Comprehensive parameter checking
- **Gas Optimization**: Efficient storage patterns

### Privacy Protection
- **Hash-Only Storage**: Only SHA-256 hashes stored on-chain
- **No Personal Data**: Student information never touches blockchain
- **GDPR Compliant**: Right to be forgotten supported

### Audit Trail
- **Event Logging**: All operations emit events
- **Immutable Records**: Blockchain-based tamper evidence
- **Transparent Verification**: Public verification process

## 📊 Gas Costs (Optimized)

| Operation | Gas Cost | USD (@ 20 gwei) |
|-----------|----------|------------------|
| Deploy Contract | ~800,000 | ~$2.40 |
| Authorize University | ~45,000 | ~$0.14 |
| Issue Diploma | ~55,000 | ~$0.17 |
| Verify Diploma | Free | $0.00 |
| Revoke Diploma | ~25,000 | ~$0.08 |

## 🛠️ Technology Stack

### Blockchain
- **Solidity** ^0.8.24 - Smart contract language
- **Hardhat** - Development framework
- **OpenZeppelin** - Security libraries
- **Ethers.js** - Ethereum library

### Frontend
- **HTML5/CSS3/JavaScript** - Core web technologies
- **Web3.js** - Blockchain interaction
- **MetaMask** - Wallet integration

### Development Tools
- **Node.js** - Runtime environment
- **npm** - Package manager
- **Git** - Version control

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow Solidity style guide
- Add tests for new features
- Update documentation
- Ensure gas optimization

## 📚 Documentation

### Smart Contract Documentation
- [DiplomaRegistry.sol](./contracts/README.md) - Main contract documentation
- [API Reference](./docs/API.md) - Complete function reference
- [Security Audit](./docs/SECURITY.md) - Security considerations

### Architecture Guides
- [System Architecture](./docs/ARCHITECTURE.md) - High-level design
- [Database Schema](./docs/SCHEMA.md) - Data structure design
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment

## 🐛 Troubleshooting

### Common Issues

**MetaMask Connection Issues**
```bash
# Reset MetaMask account
Settings > Advanced > Reset Account
```

**Contract Deployment Fails**
```bash
# Clean and redeploy
npm run clean:all
npm run compile
npm run deploy:local
```

**Frontend Not Loading**
```bash
# Check if contracts are deployed
npm run verify:deployment
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenZeppelin** - Security-focused smart contract libraries
- **Hardhat Team** - Excellent development framework
- **Ethereum Foundation** - Blockchain platform
- **University of Sfax** - Academic collaboration and guidance



---

**Built with ❤️ for the future of education verification**

*Making diploma verification transparent, secure, and accessible to everyone.*
