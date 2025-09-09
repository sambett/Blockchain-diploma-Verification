# 🚀 QUICK DEMO GUIDE - Diploma Verification System

## ⚡ **5-Minute Setup & Demo**

### **Prerequisites (1 minute)**
- ✅ MetaMask browser extension installed
- ✅ Node.js installed (you already have this)
- ✅ Your project is ready!

### **🔧 Step 1: Environment Setup (30 seconds)**

1. **Add your private key to `.env`:**
```bash
cd C:\Users\SelmaB\Desktop\diploma_verif
```

2. **Edit the `.env` file** and add your private key:
```env
PRIVATE_KEY=your_wallet_private_key_here
```

> **⚠️ NEVER share your private key! This is for testnet only.**

### **🌐 Step 2: MetaMask Configuration (1 minute)**

#### **Option A: Localhost Network (Recommended for Demo)**
```
Network Name: Localhost
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
```

#### **Option B: Sepolia Testnet (Already configured for you)**
```
Network Name: Sepolia Testnet
RPC URL: https://eth-sepolia.g.alchemy.com/v2/AAYo6M97q2EH6ob8ohhYg
Chain ID: 11155111
Currency Symbol: ETH
```

### **🚀 Step 3: Launch Demo (2 minutes)**

1. **Start local blockchain** (if using localhost):
```bash
npm run node
```

2. **Deploy contract** (in new terminal):
```bash
# For localhost
npm run deploy:local

# OR for Sepolia (requires testnet ETH)
npm run deploy:sepolia
```

3. **Open frontend**:
```bash
# Navigate to frontend
start frontend/src/index.html
# Or double-click the file
```

### **🎯 Step 4: Demo Workflow (2 minutes)**

#### **A) Admin Setup (30 seconds)**
1. Connect MetaMask to your chosen network
2. In the **Admin Section**: Add a university
   - University Name: `Harvard University`
   - University Address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` (or any address)

#### **B) Issue Diploma (30 seconds)**
1. In **University Section**:
   - Upload any PDF file
   - University Name: `Harvard University`
   - Degree Type: `BACHELOR_CS`
   - Click **Issue Diploma**

#### **C) Verify Diploma (30 seconds)**
1. In **Verification Section**:
   - Upload the SAME PDF file
   - University Name: `Harvard University`
   - Click **Verify Diploma**
   - See ✅ **AUTHENTIC** result!

#### **D) Test Invalid Diploma (30 seconds)**
1. Upload a DIFFERENT PDF file
2. Same university name
3. See ❌ **INVALID** result!

## 🎉 **Demo Complete!**

You now have a working blockchain diploma verification system!

---

## 🔑 **MetaMask Private Key Instructions**

### **How to Get Your Private Key:**

1. **Open MetaMask**
2. **Click the 3 dots menu** → **Account Details**
3. **Click "Show private key"**
4. **Enter your MetaMask password**
5. **Copy the private key**
6. **Paste it in your `.env` file**

### **Get Testnet ETH (for Sepolia):**
- Visit: https://sepoliafaucet.com/
- Enter your wallet address
- Get free testnet ETH

---

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **"Contract not deployed"**
   - Run deployment command first
   - Check if you're on the right network

2. **"Insufficient funds"**
   - Get testnet ETH from faucet
   - Switch to localhost for free testing

3. **"Transaction failed"**
   - Check gas settings in MetaMask
   - Ensure you're the contract admin

4. **"MetaMask not connecting"**
   - Refresh the page
   - Check network in MetaMask matches your selection

### **Reset Demo:**
```bash
# Stop local node (Ctrl+C)
# Restart
npm run node
npm run deploy:local
```

---

## 📱 **Production Deployment**

### **Deploy to Sepolia:**
```bash
# 1. Add private key to .env
echo "PRIVATE_KEY=your_private_key_here" >> .env

# 2. Get testnet ETH
# Visit: https://sepoliafaucet.com/

# 3. Deploy
npm run deploy:sepolia
```

### **Update Frontend:**
After deployment, update the contract address in:
- `frontend/src/index.html` (line ~150)
- Look for: `CONTRACT_ADDRESSES.sepolia = 'NEW_ADDRESS_HERE'`

---

## 🎯 **Next Steps**

1. **✅ Demo complete** - Your system works!
2. **🌐 Deploy to testnet** - Make it public
3. **📱 Add features** - QR codes, batch operations
4. **🔒 Security audit** - Before mainnet
5. **🚀 Go live** - Deploy to Ethereum mainnet

**Your diploma verification system is production-ready! 🎓**
