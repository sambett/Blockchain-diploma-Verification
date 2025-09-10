# 🚀 Local Development Guide - Diploma Verification System

> **Complete step-by-step guide for teammates to run the diploma verification app locally**

## 📋 **Prerequisites**

Before starting, ensure you have:

- ✅ **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- ✅ **Git** - [Download here](https://git-scm.com/)
- ✅ **Chrome Browser** (for MetaMask)
- ✅ **MetaMask Extension** - [Install here](https://metamask.io/download/)

## 🛠️ **Step 1: Clone and Setup**

### 1.1 Clone Repository
```bash
git clone https://github.com/sambett/Blockchain-diploma-Verification.git
cd Blockchain-diploma-Verification
```

### 1.2 Install Dependencies
```bash
npm install
```

### 1.3 Verify Installation
```bash
# Check versions
node --version    # Should be v18+
npm --version     # Should be 8+
npx hardhat help  # Should show Hardhat commands
```

---

## ⛓️ **Step 2: Start Local Blockchain**

### 2.1 Start Hardhat Node
Open **Terminal 1** and run:
```bash
npx hardhat node
```

**✅ Success indicators:**
- See: `Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/`
- See: 20 test accounts with 10,000 ETH each
- **Keep this terminal running!** 🚨

### 2.2 Save Test Account Info
Copy these for MetaMask setup:
```
Admin Account (Account #0):
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

University Account (Account #1):
Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```

---

## 📝 **Step 3: Deploy Smart Contract**

### 3.1 Deploy Contract
Open **Terminal 2** (keep Terminal 1 running) and run:
```bash
npx hardhat ignition deploy ./ignition/modules/Deploy.js --network localhost
```

**✅ Success indicators:**
- See: `[ DiplomaRegistryModule ] successfully deployed 🚀`
- Note the contract address: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- ✅ Contract is now deployed and ready!

---

## 🦊 **Step 4: Configure MetaMask**

### 4.1 Install MetaMask
1. Go to https://metamask.io/download/
2. Click "Install MetaMask for Chrome"
3. Add to Chrome and set up wallet

### 4.2 Add Hardhat Local Network
1. **Open MetaMask** → Click network dropdown (top center)
2. **Click "Add network"** → **"Add a network manually"**
3. **Fill EXACTLY:**
   ```
   Network name: Hardhat Local
   New RPC URL: http://127.0.0.1:8545
   Chain ID: 31337
   Currency symbol: ETH
   Block explorer URL: (leave blank)
   ```
4. **Click "Save"**
5. **Switch to "Hardhat Local" network**

### 4.3 Import Test Accounts
1. **Click account icon** → **"Add account or hardware wallet"** → **"Import account"**
2. **Import Admin Account:**
   ```
   Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
3. **Import University Account:**
   ```
   Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
   ```

**✅ You should now see 10,000 ETH in each account!**

---

## 🌐 **Step 5: Start Frontend Application**

### 5.1 Start Web Server
Open **Terminal 3** and run:
```bash
cd frontend
python -m http.server 8080
```

**Alternative if Python not available:**
```bash
npx http-server frontend -p 8080 -c-1
```

### 5.2 Access Application
Open your browser and go to:
```
http://127.0.0.1:8080/src/index.html
```

**✅ Success indicators:**
- Beautiful diploma verification interface loads
- See "🎓 Diploma Verification System - Production Ready"
- See "Network Information" section

---

## 🔗 **Step 6: Connect MetaMask to App**

### 6.1 Connect Wallet
1. **Click "Connect MetaMask"** button in the app
2. **MetaMask popup:** Click "Connect"
3. **Select admin account** and click "Next" → "Connect"

### 6.2 Verify Connection
You should see:
```
✅ Network Information:
Current Network: Localhost
Chain ID: 31337
Status: ✅ Connected

✅ Smart Contract Info:
Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Status: ✅ Available
Admin: 0xf39Fd6... (You are admin!)
```

---

## 🧪 **Step 7: Test Complete Workflow**

### 7.1 Test Admin Functions
**Ensure you're connected as Admin account** (`0xf39Fd...`)

1. **Scroll to "Admin Panel"**
2. **Add University:**
   ```
   University Name: Harvard University
   University Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
   ```
3. **Click "Authorize University"**
4. **MetaMask:** Confirm transaction
5. **Wait for success message** ✅

### 7.2 Test Diploma Issuance
1. **In MetaMask:** Switch to **University Account** (`0x70997970C51812dc3A010C7d01b50e0d17dc79C8`)
2. **Refresh browser page**
3. **Click "Connect MetaMask"** again
4. **Verify you see:** "University: Harvard University" in contract info

5. **Issue a diploma:**
   - **Create/download any PDF file**
   - **Upload the PDF**
   - **University Name:** `Harvard University`
   - **Degree Type:** `Computer Science`
   - **Click "Issue Diploma"**
   - **MetaMask:** Confirm transaction
   - **Wait for success** ✅

### 7.3 Test Diploma Verification
1. **Scroll to "Verify Diploma"**
2. **Upload the SAME PDF** from step 7.2
3. **University Name:** `Harvard University`
4. **Click "Verify Diploma"**
5. **Result:** Should show **"✅ Authentic - Diploma verified!"**

### 7.4 Test Invalid Diploma
1. **Upload a DIFFERENT PDF**
2. **University:** `Harvard University`
3. **Click "Verify Diploma"**
4. **Result:** Should show **"❌ Invalid - Diploma not found"**

---

## 🎯 **Quick Start Commands Summary**

For experienced developers, here's the rapid setup:

```bash
# Terminal 1: Start blockchain
npx hardhat node

# Terminal 2: Deploy contract
npx hardhat ignition deploy ./ignition/modules/Deploy.js --network localhost

# Terminal 3: Start frontend
cd frontend && python -m http.server 8080

# Browser: Open app
# http://127.0.0.1:8080/src/index.html
```

---

## 🚨 **Troubleshooting**

### **Problem: "MetaMask not detected"**
**Solution:** 
- Ensure you're accessing via `http://127.0.0.1:8080/src/index.html` (not `file://`)
- Install MetaMask extension
- Refresh page after connecting

### **Problem: "Unknown network"**
**Solution:**
- Check MetaMask is on "Hardhat Local" network
- Verify Chain ID is 31337
- Restart Hardhat node if needed

### **Problem: "Contract not found"**
**Solution:**
- Ensure Hardhat node is running on port 8545
- Redeploy contract: `npx hardhat ignition deploy ./ignition/modules/Deploy.js --network localhost`
- Check contract address in frontend matches deployment

### **Problem: "Not authorized university address"**
**Solution:**
- First: Connect as Admin and authorize the university
- Then: Switch to university account to issue diplomas
- Follow the correct workflow order

### **Problem: "Transaction failed"**
**Solution:**
- Check you have ETH in your account
- Ensure you're on correct network (Hardhat Local)
- Try refreshing page and reconnecting MetaMask

### **Problem: Port 8545 already in use**
**Solution:**
```bash
# Windows: Kill process
netstat -ano | findstr :8545
taskkill /PID [PID_NUMBER] /F

# Then restart Hardhat node
npx hardhat node
```

### **Problem: Port 8080 already in use**
**Solution:**
```bash
# Use different port
python -m http.server 8081
# Then access: http://127.0.0.1:8081/src/index.html
```

---

## 🔧 **Development Tips**

### **Reset Blockchain State**
If you need to start fresh:
1. **Stop Hardhat node** (Ctrl+C in Terminal 1)
2. **Delete deployment cache:**
   ```bash
   rm -rf ignition/deployments/
   ```
3. **Restart blockchain:** `npx hardhat node`
4. **Redeploy contract**

### **View Transaction Logs**
Monitor Terminal 1 (Hardhat node) to see:
- All transactions in real-time
- Gas usage
- Contract interactions
- Account balances

### **Contract Interaction via Console**
```bash
# Open Hardhat console
npx hardhat console --network localhost

# Interact with contract
const contract = await ethers.getContractAt("DiplomaRegistry", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
await contract.isUniversityAuthorized("Harvard University");
```

---

## 🎓 **User Roles Explained**

### **👑 Admin (Account #0)**
- **Can:** Authorize/revoke universities
- **Cannot:** Issue diplomas directly
- **Account:** `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

### **🏛️ University (Account #1)**
- **Can:** Issue diplomas for their university
- **Cannot:** Authorize other universities
- **Must:** Be authorized by admin first
- **Account:** `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`

### **👥 Anyone**
- **Can:** Verify any diploma
- **No authentication required**

---

## 📂 **Project Structure**

```
diploma_verif/
├── contracts/              # Smart contracts
│   └── DiplomaRegistry.sol
├── test/                   # Contract tests
├── ignition/modules/       # Deployment scripts
├── frontend/src/           # Web application
│   └── index.html
├── hardhat.config.js       # Hardhat configuration
└── package.json           # Dependencies
```

---

## ✅ **Success Checklist**

- [ ] Node.js and npm installed
- [ ] Repository cloned and dependencies installed
- [ ] Hardhat node running (Terminal 1)
- [ ] Contract deployed successfully (Terminal 2)
- [ ] MetaMask installed and configured
- [ ] Frontend running on http://127.0.0.1:8080 (Terminal 3)
- [ ] MetaMask connected to app
- [ ] Admin can authorize universities
- [ ] University can issue diplomas
- [ ] Anyone can verify diplomas

---

## 🆘 **Need Help?**

1. **Check all terminals are running**
2. **Verify MetaMask network is "Hardhat Local"**
3. **Ensure you're accessing via localhost URL**
4. **Follow the exact workflow order**
5. **Check the troubleshooting section**

---

## 🎉 **Congratulations!**

You now have a **fully functional blockchain diploma verification system** running locally! 

**Key URLs:**
- **Frontend:** http://127.0.0.1:8080/src/index.html
- **Blockchain:** http://127.0.0.1:8545
- **Contract:** 0x5FbDB2315678afecb367f032d93F642f64180aa3

**Ready for production deployment or further development!** 🚀🎓
