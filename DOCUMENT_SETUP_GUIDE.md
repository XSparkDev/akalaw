# 📄 Document Setup Guide
## How to Add Your Legal Documents to the Download System

---

## 🎯 **What You Need**

Your system expects **3 ZIP files** in the `public/documents/` directory:

```
public/documents/
├── offer-to-purchase-residential.zip
├── last-will-testament.zip
└── living-will.zip
```

## 📋 **File Name Requirements**

**⚠️ IMPORTANT:** File names must be **EXACTLY** as shown above (case-sensitive!)

| Document ID | Title | ZIP File Name |
|-------------|-------|---------------|
| **1** | Offer To Purchase - Residential Property | `offer-to-purchase-residential.zip` |
| **2** | Last Will & Testament | `last-will-testament.zip` |
| **3** | Living Will | `living-will.zip` |

**📦 Each ZIP file should contain:**
- The document in PDF format
- The document in editable Word format (.docx)

---

## 🚀 **Quick Setup (For Testing)**

### **Option 1: Create Test ZIP Files**
If you don't have the real documents yet, you can create temporary ZIP files:

1. **Find any PDF and Word files** on your computer (or use the sample files below)
2. **Create ZIP files** containing both formats:
   - Create `offer-to-purchase-residential.zip` containing a PDF and DOCX
   - Create `last-will-testament.zip` containing a PDF and DOCX  
   - Create `living-will.zip` containing a PDF and DOCX
3. **Place them** in `public/documents/`
4. **Test the download system** to make sure it works
5. **Replace with real documents** later

### **Option 2: Create Simple Test Documents**
1. **Open any text editor** (TextEdit, Word, etc.)
2. **Type some sample content** like:
   ```
   OFFER TO PURCHASE - RESIDENTIAL PROPERTY
   
   This is a test document for the AKA Law system.
   This file will be replaced with the actual legal document.
   
   Document ID: 1
   Format: PDF & Word
   
   [Rest of legal content would go here]
   ```
3. **Save as both PDF and Word** formats
4. **Create ZIP file** containing both the PDF and Word versions
5. **Repeat for all 3 documents**
6. **Name ZIP files** exactly as specified in the table above

---

## 🏭 **Production Setup (Real Documents)**

### **Step 1: Prepare Your Legal Documents**
1. **Ensure documents are legally compliant** and reviewed
2. **Create both PDF and Word versions** of each document
3. **Test documents** thoroughly  
4. **Verify formatting** is correct
5. **Create ZIP files** containing both PDF and Word versions

### **Step 2: Add ZIP Files**
1. **Create ZIP files** with both PDF and Word versions inside
2. **Copy ZIP files** to `public/documents/` directory
3. **Use exact filenames** from the table above
4. **Check file permissions** (should be readable)
5. **Test download** with a real payment

### **Step 3: Verify System**
1. **Complete test payment**
2. **Check download works** from verify page
3. **Check email delivery** includes download link
4. **Verify file tracking** in Firebase Console

---

## 🔧 **How the Download System Works**

### **Security Flow:**
1. **Customer pays** → Payment reference saved in Firebase
2. **Customer clicks download** → System calls `/api/download/[reference]`
3. **System validates payment** → Checks Firebase for successful payment
4. **System maps document** → Uses document ID to find correct file
5. **System serves file** → Downloads PDF with proper headers
6. **System logs download** → Records in Firebase for tracking

### **File Mapping Logic:**
```typescript
// In app/api/download/[reference]/route.ts
function getDocumentFiles(documentId: string) {
  const documentMap = {
    '1': {
      zip: 'offer-to-purchase-residential.zip'
    },
    '2': {
      zip: 'last-will-testament.zip'
    },
    '3': {
      zip: 'living-will.zip'
    }
  }
  return documentMap[documentId] || null
}
```

---

## 📊 **Testing Checklist**

### **✅ Before Testing:**
- [ ] All 3 ZIP files added to `public/documents/`
- [ ] ZIP file names match exactly
- [ ] ZIP files contain both PDF and Word documents
- [ ] Payment system is working
- [ ] Firebase is configured

### **✅ Test Process:**
- [ ] Complete test payment
- [ ] Verify payment success page loads
- [ ] Click "Download Document Now" button
- [ ] Verify ZIP file downloads correctly
- [ ] Extract ZIP and verify it contains both PDF and Word files
- [ ] Check terminal logs for success messages
- [ ] Verify download logged in Firebase Console

### **✅ Expected Terminal Logs:**
```
📥 Document download served: {
  reference: 'AKA_LAW_1754389955713_V7QTR5',
  customer: 'customer@example.com',
  document: 'Last Will & Testament',
  fileName: 'Last_Will_Testament.zip'
}
```

---

## 🚨 **Troubleshooting**

### **Download Button Not Working:**
- Check browser console for JavaScript errors
- Verify payment status is "success" in Firebase
- Check file exists with exact filename

### **"Document file not available" Error:**
- **Cause:** File doesn't exist or wrong filename
- **Solution:** Check `public/documents/` directory and filename spelling
- **Check:** File permissions (should be readable)

### **Download Starts But File is Corrupted:**
- **Cause:** Invalid ZIP file or corrupted contents
- **Solution:** Test ZIP file by extracting it manually
- **Check:** ZIP contains both PDF and Word files
- **Check:** Files inside ZIP aren't corrupted

### **Email Contains Download Link But Link Doesn't Work:**
- **Cause:** Base URL mismatch or payment reference issue
- **Solution:** Check `NEXT_PUBLIC_BASE_URL` in `.env.local`
- **Verify:** Payment reference exists in Firebase

---

## 🔄 **Adding New Documents**

### **To Add Document ID 4:**

1. **Update document mapping** in `/app/api/download/[reference]/route.ts`:
```typescript
'4': {
  zip: 'new-document-name.zip'
}
```

2. **Add document** to main page in `/app/page.tsx`:
```typescript
{
  id: 4,
  title: "New Legal Document",
  category: "property", // or "estate"
  description: "Description of new document...",
  price: "R 650",
  format: "ZIP (PDF & Word)",
  // ... other properties
}
```

3. **Add ZIP file** to `public/documents/`:
- `new-document-name.zip` (containing both PDF and Word versions)

---

## 💡 **Pro Tips**

1. **Keep file sizes reasonable** (under 10MB for good download performance)
2. **Use descriptive filenames** but stick to the mapping
3. **Test downloads regularly** to ensure files aren't corrupted
4. **Monitor Firebase logs** for download statistics
5. **Backup your documents** before making changes
6. **Version control** - keep document versions organized

---

**🎯 Once you add the files, your download system will be fully functional!** 