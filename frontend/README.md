# 🎨 Frontend Developer Guide

**Branch**: `frontend-dev`  
**Your Role**: Create the user interface and integrate with blockchain

## 🎯 Your Responsibilities

### Core Tasks
- [ ] Design and implement React application
- [ ] Integrate with MetaMask wallet
- [ ] Handle PDF file uploads and hashing
- [ ] Create diploma verification interface
- [ ] Implement responsive UI/UX

### Secondary Tasks
- [ ] Error handling and user feedback
- [ ] Loading states and transactions
- [ ] Mobile responsiveness
- [ ] Integration testing with contracts

## 📋 Frontend Requirements

### Main Components Needed

1. **App.js** - Main application component
2. **WalletConnection.js** - MetaMask integration
3. **UniversityPanel.js** - For universities to issue diplomas
4. **VerificationPanel.js** - For anyone to verify diplomas
5. **AdminPanel.js** - For admin functions

### Key Features to Implement

#### 🏫 University Functions
- Connect MetaMask wallet
- Upload PDF diploma
- Generate hash from PDF
- Submit diploma to blockchain
- View issued diplomas

#### ✅ Verification Functions
- Upload PDF for verification
- Generate hash and check blockchain
- Display verification result
- Show diploma details if valid

#### ⚙️ Admin Functions (if applicable)
- Authorize new universities
- View system statistics

## 🛠️ Tech Stack

### Core Libraries
```json
{
  "react": "^18.2.0",
  "ethers": "^6.7.0",
  "web3": "^4.0.0",
  "react-router-dom": "^6.0.0"
}
```

### UI Libraries
```json
{
  "bootstrap": "^5.3.0",
  "react-bootstrap": "^2.8.0",
  "@mui/material": "^5.14.0" // Alternative to Bootstrap
}
```

### File Handling
```json
{
  "crypto-js": "^4.1.1",  // For PDF hashing
  "file-saver": "^2.0.5"  // For file downloads
}
```

## 📁 Frontend Structure

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── WalletConnection.js
│   │   ├── UniversityPanel.js
│   │   ├── VerificationPanel.js
│   │   └── AdminPanel.js
│   ├── utils/
│   │   ├── blockchain.js      # Contract interactions
│   │   ├── fileHandler.js     # PDF processing
│   │   └── constants.js       # Contract addresses/ABIs
│   ├── styles/
│   │   └── App.css
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## 🔗 Blockchain Integration

### MetaMask Connection
```javascript
// Example connection pattern
const connectWallet = async () => {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    // Handle connection
  }
};
```

### Contract Interaction
```javascript
// Example contract call
const issueD iploma = async (diplomaHash, studentInfo) => {
  const contract = new ethers.Contract(address, abi, signer);
  const tx = await contract.issueDiploma(diplomaHash, studentInfo);
  await tx.wait();
};
```

### PDF Hashing
```javascript
// Example PDF to hash conversion
const generateHash = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const hash = crypto.createHash('sha256')
    .update(new Uint8Array(arrayBuffer))
    .digest('hex');
  return '0x' + hash;
};
```

## 🎨 UI/UX Guidelines

### Design Principles
1. **Clean & Simple**: Easy to understand interface
2. **Responsive**: Works on mobile and desktop
3. **Clear Feedback**: Loading states and error messages
4. **Accessible**: Proper contrast and navigation

### User Flow
1. **Connect Wallet** → User connects MetaMask
2. **Choose Role** → University or Verifier
3. **Perform Action** → Upload/Verify diploma
4. **View Result** → Success/failure with details

## 🧪 Testing Strategy

### Testing Categories
- **Component Tests**: Individual component functionality
- **Integration Tests**: Wallet and contract integration
- **User Flow Tests**: End-to-end user scenarios
- **Responsive Tests**: Different screen sizes

### Testing Tools
```json
{
  "@testing-library/react": "^13.4.0",
  "@testing-library/jest-dom": "^5.16.5",
  "jest": "^27.5.1"
}
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Key Responsive Elements
- Navigation menu
- File upload areas
- Result displays
- Form layouts

## 🔒 Security Considerations

- **Input Validation**: Validate all user inputs
- **File Validation**: Check file types and sizes
- **Error Handling**: Don't expose sensitive information
- **Wallet Security**: Proper MetaMask integration

## 🤝 Coordination with Other Teams

### With Contract Team:
- Get contract ABIs and addresses
- Understand function parameters
- Test integration on local network

### With Documentation Team:
- Provide screenshots of UI
- Document user workflows
- Share component documentation

## 📚 Resources for Frontend Development

- [React Documentation](https://react.dev/)
- [Ethers.js Documentation](https://docs.ethers.io/)
- [MetaMask Developer Docs](https://docs.metamask.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---
**Status**: Setup Phase  
**Next**: UI Design and MetaMask Integration