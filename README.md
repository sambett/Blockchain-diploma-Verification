# 🎓 Blockchain Diploma Verification System

A decentralized application for certifying and verifying academic diplomas using blockchain technology.

## 🎯 Project Overview

This system allows:
- **Universities**: Register and issue diploma certificates
- **Students**: Get their diplomas certified on blockchain  
- **Employers/Anyone**: Verify diploma authenticity instantly

## 🏗️ Architecture

```
PDF Upload → Hash (keccak256) → Store on Blockchain → Verification
```

**Key Principle**: We store only diploma HASHES on-chain, not the actual PDF files.

## 👥 Team Structure

| Person | Role | Branch | Responsibilities |
|--------|------|---------|-----------------|
| **Person 1** | Smart Contract Dev | `contract-dev` | Solidity contracts, deployment, testing |
| **Person 2** | Frontend Dev | `frontend-dev` | React app, MetaMask integration, UI/UX |
| **Person 3** | Documentation & Integration | `docs` | Documentation, testing, project coordination |

## 🛠️ Tech Stack

- **Blockchain**: Ethereum (Hardhat for development)
- **Smart Contracts**: Solidity ^0.8.0
- **Frontend**: React.js + Ethers.js
- **Wallet**: MetaMask integration
- **Testing**: Local Hardhat network → Sepolia testnet
- **Tools**: Hardhat, VS Code, Node.js

## 📁 Project Structure

```
diploma_verif/
├── contracts/              # Smart contracts (Person 1)
│   ├── DiplomaRegistry.sol
│   └── README.md
├── scripts/               # Deployment scripts
│   └── deployment/
├── test/                 # Contract tests
├── frontend/             # React application (Person 2)
│   ├── src/
│   ├── public/
│   └── README.md
├── docs/                 # Documentation (Person 3)
│   └── README.md
├── hardhat.config.js     # Hardhat configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js v16+ 
- MetaMask browser extension
- Git

### Setup
```bash
# Clone repository
git clone https://github.com/sambett/Blockchain-diploma-Verification.git
cd diploma_verif

# Install dependencies
npm install

# Start local blockchain
npx hardhat node

# In another terminal - compile contracts
npx hardhat compile

# Run tests
npx hardhat test
```

## 🌿 Git Workflow

1. **Always** pull latest changes from main:
```bash
git checkout main
git pull origin main
```

2. **Switch** to your branch:
```bash
git checkout your-branch-name
git merge main  # Get latest changes
```

3. **Work** on your features, then:
```bash
git add .
git commit -m "descriptive message"
git push origin your-branch-name
```

4. **Create Pull Request** when ready to merge

## ⚠️ Important Rules

- **Never** push directly to `main` branch
- **Always** test on local network first
- **Security**: Private keys should NEVER be committed to git
- **Gas**: Be mindful of gas costs in contract design

## 📚 Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethers.js Documentation](https://docs.ethers.io/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/)

---
**Last Updated**: Setup Phase
**Next Milestone**: Smart Contract Architecture Design