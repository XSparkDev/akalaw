# 📧 Email Setup Guide
## Automatic Document Delivery & Admin Notifications

Your payment system now includes automatic email functionality!

---

## 🔧 **What You Need to Add**

### **1. Get Resend API Key**
1. **Go to [Resend.com](https://resend.com/)**
2. **Sign up** for a free account
3. **Verify your domain** (or use their test domain temporarily)
4. **Generate API key** from dashboard
5. **Copy the API key** (starts with `re_`)

### **2. Update .env.local**
Add this line to your `.env.local` file:

```env
# Email Service (Resend)
RESEND_API_KEY=re_your_actual_api_key_here
```

**Your complete `.env.local` should now look like:**
```env
# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3001

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=aka-law-payments.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=aka-law-payments
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=aka-law-payments.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Email Service (Resend)
RESEND_API_KEY=re_your_actual_api_key_here
```

---

## 📄 **Add Your Legal Documents**

### **1. Create Document Files**
Add these files to the `public/documents/` directory:

```
public/documents/
├── offer-to-purchase-residential.pdf
├── offer-to-purchase-residential.docx
├── last-will-testament.pdf
├── last-will-testament.docx
├── living-will.pdf
└── living-will.docx
```

### **2. Temporary Solution (For Testing)**
If you don't have the actual documents yet, you can create simple placeholder PDFs for testing:

1. **Create any PDF file** and rename it to the required filenames
2. **Test the system** to make sure email delivery works
3. **Replace with actual legal documents** later

---

## ✨ **What Happens Now**

### **When a Customer Pays Successfully:**

1. **💾 Payment saved** to Firebase database
2. **📧 Customer receives email** with:
   - Document attachment (coming soon)
   - Download link to secure portal
   - Receipt with payment details
   - Instructions for free consultation
3. **📧 Admin receives notification** at `websales@akalaw.co.za` with:
   - Customer details
   - Payment information
   - Document purchased
   - Action items
4. **📥 Customer can download** directly from verify page

### **Email Features:**
- **Professional HTML templates** with AKA Law branding
- **Secure download links** that expire
- **Download tracking** in Firebase
- **Mobile-responsive** design
- **Automatic receipts** and confirmations

---

## 🧪 **Testing the Email System**

### **1. Test Payment Flow**
1. **Complete a test payment** on your website
2. **Check terminal logs** for email confirmation:
   ```
   📧 Customer document email sent successfully
   📧 Admin notification email sent successfully
   ```
3. **Check your email** (both customer and admin emails)

### **2. Test Download Functionality**
1. **Go to payment verification page** after successful payment
2. **Click "Download Document Now"**
3. **Check if PDF downloads** correctly
4. **Verify download is logged** in Firebase Console

---

## 🔒 **Security Features**

### **Document Security:**
- **Secure download URLs** tied to payment references
- **Only successful payments** can download documents
- **Download tracking** with IP addresses and timestamps
- **No direct file access** - all downloads go through secure API

### **Email Security:**
- **Domain verification** prevents spoofing
- **Secure email delivery** via Resend infrastructure
- **No sensitive data** in email subjects
- **Professional sender reputation**

---

## 🌐 **Production Setup**

### **For Production Deployment:**
1. **Verify your domain** in Resend dashboard
2. **Use production Resend API key**
3. **Update email addresses** in `lib/email/config.ts` if needed
4. **Test with real small payment** before going live

### **Cost:**
- **Resend Free Tier:** 3,000 emails/month
- **Perfect for small businesses**
- **Upgrade as needed** when you scale

---

## 🚨 **Troubleshooting**

### **Emails Not Sending:**
- Check `RESEND_API_KEY` is correctly set
- Verify domain is verified in Resend dashboard
- Check terminal logs for error messages

### **Downloads Not Working:**
- Ensure document files exist in `public/documents/`
- Check file permissions
- Verify payment status is "success" in Firebase

### **Admin Email Not Received:**
- Check `websales@akalaw.co.za` email address is correct
- Update in `lib/email/config.ts` if needed
- Check spam folder

---

**🎉 Your legal document e-commerce system now has professional email delivery and download functionality!** 