# 🔧 METAMASK SETUP GUIDE

## 🦊 **Complete MetaMask Configuration for Diploma Verification**

### **📱 Step 1: Install MetaMask**
1. Visit: https://metamask.io/
2. Download for your browser (Chrome, Firefox, Brave, Edge)
3. Create a new wallet or import existing one
4. **⚠️ SAVE YOUR SEED PHRASE SECURELY!**

### **🌐 Step 2: Add Networks**

#### **🏠 Localhost Network (for Development/Demo)**
**Use this for local testing with Hardhat**

1. Open MetaMask → Click Network dropdown → "Add Network"
2. **Manual Network Setup:**
```
Network Name: Localhost
New RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
Block Explorer URL: (leave empty)
```
3. Click **Save**

#### **🌍 Sepolia Testnet (for Public Testing)**
**Use this for public demo with real blockchain**

1. Open MetaMask → Click Network dropdown → "Add Network"
2. **Manual Network Setup:**
```
Network Name: Sepolia Testnet
New RPC URL: https://eth-sepolia.g.alchemy.com/v2/AAYo6M97q2EH6ob8ohhYg
Chain ID: 11155111
Currency Symbol: ETH
Block Explorer URL: https://sepolia.etherscan.io
```
3. Click **Save**

### **💰 Step 3: Get Test ETH**

#### **For Localhost:**
- ✅ **Automatic** - Hardhat provides accounts with 10,000 ETH each
- No action needed!

#### **For Sepolia Testnet:**
1. **Copy your wallet address** from MetaMask
2. **Visit faucet:** https://sepoliafaucet.com/
3. **Paste your address** → Request ETH
4. **Wait 1-2 minutes** for ETH to arrive
5. **Alternative faucets:**
   - https://sepolia-faucet.pk910.de/
   - https://faucet.quicknode.com/ethereum/sepolia

### **🔑 Step 4: Export Private Key (for Deployment)**

> **⚠️ ONLY for TESTNET! Never share mainnet private keys!**

1. **Open MetaMask**
2. **Click account avatar** → **Account Details**
3. **Click "Show private key"**
4. **Enter your MetaMask password**
5. **Copy the private key**
6. **Add to `.env` file:**
```env
PRIVATE_KEY=your_private_key_here_without_0x_prefix
```

### **🔄 Step 5: Switch Between Networks**

#### **Method 1: Manual Switch in MetaMask**
1. Click **Network dropdown** in MetaMask
2. Select **"Localhost"** or **"Sepolia Testnet"**

#### **Method 2: Use App Network Selector**
1. Open your diploma verification app
2. Use the **Network Selector** dropdown
3. Click **"Switch Network"** button
4. MetaMask will prompt to switch

### **⚙️ Advanced Configuration**

#### **Import Hardhat Test Accounts**
For testing with pre-funded accounts:

1. **Get private keys** from Hardhat console:
```bash
npm run node
# Copy private keys from console output
```

2. **Import in MetaMask:**
   - MetaMask → Account menu → "Import Account"
   - Paste private key
   - Name it "Hardhat Test 1", etc.

#### **Common Test Accounts (Hardhat localhost):**
```
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```

### **🔒 Security Best Practices**

#### **✅ DO:**
- Use separate wallets for testing vs mainnet
- Keep seed phrases offline and secure
- Use hardware wallets for large amounts
- Double-check network before transactions

#### **❌ DON'T:**
- Share private keys publicly
- Use mainnet private keys in code
- Store large amounts on testnet wallets
- Ignore transaction confirmations

### **🎯 Quick Network Check**

**Current Network Indicators:**
- **Localhost**: Fast, free transactions, ETH balance = 10000
- **Sepolia**: Slower (~15s), real blockchain, need faucet ETH
- **Mainnet**: REAL MONEY - don't use for testing!

### **🐛 Troubleshooting**

#### **Problem: "Wrong Network" Error**
**Solution:**
1. Check MetaMask network matches app selection
2. Use app's "Switch Network" button
3. Manually switch in MetaMask

#### **Problem: "Insufficient Funds"**
**Solution:**
- **Localhost**: Restart `npm run node`
- **Sepolia**: Get ETH from faucet
- **Check**: Ensure you're on right network

#### **Problem: "Nonce Too High"**
**Solution:**
1. MetaMask → Settings → Advanced
2. "Reset Account" (clears transaction history)
3. Try transaction again

#### **Problem: "Contract Not Found"**
**Solution:**
1. Ensure contract is deployed: `npm run deploy:local`
2. Check contract address in frontend code
3. Verify you're on correct network

#### **Problem: MetaMask Not Connecting**
**Solution:**
1. Refresh the webpage
2. MetaMask → Connected Sites → Remove site
3. Connect again from the app

### **📱 Mobile Setup (Optional)**

#### **MetaMask Mobile:**
1. Install MetaMask mobile app
2. Import your wallet using seed phrase
3. Add same networks as above
4. Use WalletConnect for dApp connection

### **🌟 Pro Tips**

1. **Name Your Networks:** Use descriptive names like "Diploma App - Localhost"
2. **Test First:** Always test on localhost before Sepolia
3. **Check Addresses:** Verify contract addresses match deployment
4. **Monitor Gas:** Set reasonable gas limits for Sepolia
5. **Keep Separate:** Use different accounts for admin vs university roles

### **📞 Help & Support**

#### **MetaMask Issues:**
- Official docs: https://docs.metamask.io/
- Support: https://metamask.zendesk.com/

#### **Network Issues:**
- Sepolia status: https://sepolia.etherscan.io/
- Ethereum status: https://ethstats.net/

#### **Faucet Issues:**
- Try multiple faucets if one fails
- Some require social media verification
- Wait 24h between requests on same faucet

---

## ✅ **Configuration Complete!**

Your MetaMask is now configured for the Diploma Verification System!

**Next:** Follow the [QUICK_DEMO.md](./QUICK_DEMO.md) guide to start using the app.
