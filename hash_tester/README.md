# 🧪 PDF Hash Generator - Independent Testing

## 🎯 What This Is

This is a **simple web page** that generates unique "fingerprints" (hashes) from PDF files. This is the **core functionality** that will later be used in the blockchain diploma verification system.

## 🚀 How to Use

### Step 1: Open the File
1. Navigate to: `C:\Users\SelmaB\Desktop\diploma_verif\hash_tester\`
2. Double-click `index.html`
3. It will open in your web browser

### Step 2: Test with PDF Files
1. Click "Choose File" or drag a PDF into the upload area
2. Click "Generate Hash"
3. See the unique hash generated for your file

### Step 3: Understand What You're Seeing
- **Hash**: A unique 64-character "fingerprint" of the file
- **Same file = Same hash**: Upload the same PDF twice, get identical hash
- **Different file = Different hash**: Every file has a unique hash

## 🧪 Testing Experiments

### Experiment 1: Same File Test
1. Upload a PDF file
2. Note the hash result
3. Upload the same file again
4. **Result**: You should get the **exact same hash**

### Experiment 2: Different Files Test
1. Upload one PDF file, note the hash
2. Upload a different PDF file
3. **Result**: You should get a **completely different hash**

### Experiment 3: Modified File Test
1. Upload a PDF file, note the hash
2. Open the PDF in any editor, change just one letter, save
3. Upload the modified PDF
4. **Result**: The hash should be **completely different**

## 🔍 What You're Learning

- **Hash Functions**: How to create unique fingerprints for files
- **File Processing**: How to read and process files in web browsers
- **Data Integrity**: How small changes create big differences in hashes
- **Core Concept**: This is exactly what the blockchain will store!

## 🏗️ How This Fits in the Big Picture

```
[PDF File] → [Generate Hash] → [Store Hash on Blockchain] → [Verify Later]
     ↑              ↑                     ↑                      ↑
   What you      What this            What Person 1          What the final
   upload        tool does            will build             system does
```

## 🎓 Why This Matters

1. **Understanding**: You now understand the core concept without blockchain complexity
2. **Testing**: You can verify the hash generation works correctly
3. **Foundation**: This exact functionality will be used in the final system
4. **Independence**: You built something that works completely on its own!

## 🔧 Technical Notes (For Learning)

- **Hash Algorithm**: Uses SHA-256 (same family as blockchain hashes)
- **Browser API**: Uses modern Web Crypto API
- **No Dependencies**: Pure HTML/JavaScript, no frameworks needed
- **Secure**: Hash generation happens locally, no file upload to servers

## 🚀 Next Steps

Once you understand how this works:
1. Test it thoroughly with different PDF files
2. Share your findings with your team
3. This same logic will be integrated into the React frontend later
4. The hashes you generate here could theoretically be stored on blockchain!

---
**Status**: ✅ Independent Component Complete  
**Complexity**: 🟢 Beginner Friendly  
**Dependencies**: None - Works immediately!