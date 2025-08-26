# 🔥 Firebase Setup Guide
## Complete Database Integration for Paystack Payments

---

## 📋 What You'll Need

1. **Google Account** (for Firebase Console access)
2. **Firebase Project** (we'll create this)
3. **Environment Variables** (we'll configure these)

---

## 🚀 Step-by-Step Setup

### **Step 1: Create Firebase Project**

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Click "Create a project"**
3. **Enter project name:** `aka-law-payments` (or your preferred name)
4. **Disable Google Analytics** (not needed for this project)
5. **Click "Create project"**
6. **Wait for project creation** (takes ~30 seconds)

### **Step 2: Enable Firestore Database**

1. **In Firebase Console, go to "Firestore Database"**
2. **Click "Create database"**
3. **Choose "Start in test mode"** (we'll secure it later)
4. **Select location:** Choose closest to South Africa (e.g., `europe-west1`)
5. **Click "Done"**

### **Step 3: Get Firebase Configuration**

1. **In Firebase Console, click the gear icon ⚙️ → "Project settings"**
2. **Scroll down to "Your apps" section**
3. **Click the web app icon `</>`**
4. **Register app name:** `AKA Law Website`
5. **DON'T check "Also set up Firebase Hosting"**
6. **Click "Register app"**
7. **Copy the config object** - you'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "aka-law-payments.firebaseapp.com",
  projectId: "aka-law-payments",
  storageBucket: "aka-law-payments.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789"
};
```

### **Step 4: Update Environment Variables**

**Open your `.env.local` file and update the Firebase section:**

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=aka-law-payments.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=aka-law-payments
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=aka-law-payments.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789
```

**Replace with your actual values from Step 3!**

### **Step 5: Set Up Firestore Security Rules**

1. **In Firebase Console, go to "Firestore Database"**
2. **Click "Rules" tab**
3. **Replace the default rules with:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Payment records - write only from server, read only by admin
    match /payments/{document} {
      allow read, write: if false; // Server-side only
    }
    
    // Customer records - write only from server, read only by admin  
    match /customers/{document} {
      allow read, write: if false; // Server-side only
    }
    
    // Download records - write only from server
    match /downloads/{document} {
      allow read, write: if false; // Server-side only
    }
    
    // Analytics - write only from server
    match /analytics/{document} {
      allow read, write: if false; // Server-side only
    }
    
    // Error logs - write only from server
    match /payment_errors/{document} {
      allow read, write: if false; // Server-side only
    }
  }
}
```

4. **Click "Publish"**

---

## 🔧 Your Complete .env.local File Should Look Like:

```env
# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=aka-law-payments.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=aka-law-payments
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=aka-law-payments.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789
```

---

## 📊 Database Structure Created

Your Firebase will automatically create these collections:

### **`payments` Collection**
```
payments/
├── documentId: "payment_abc123"
│   ├── paymentReference: "AKA_LAW_1625097600_xyz789"
│   ├── customerName: "John Doe"
│   ├── customerEmail: "john@example.com"
│   ├── documentTitle: "Last Will & Testament"
│   ├── paymentStatus: "success"
│   ├── amount: 55000 (in cents)
│   ├── currency: "ZAR"
│   ├── createdAt: timestamp
│   ├── paidAt: timestamp
│   └── metadata: {...}
```

### **`customers` Collection**
```
customers/
├── documentId: "customer_def456"
│   ├── email: "john@example.com"
│   ├── name: "John Doe"
│   ├── totalPurchases: 3
│   ├── totalSpent: 1350 (in Rand)
│   ├── purchasedDocuments: ["1", "2", "3"]
│   └── preferences: {...}
```

### **`downloads` Collection**
```
downloads/
├── documentId: "download_ghi789"
│   ├── paymentReference: "AKA_LAW_1625097600_xyz789"
│   ├── customerEmail: "john@example.com"
│   ├── documentId: "2"
│   └── downloadedAt: timestamp
```

---

## 🧪 Testing the Integration

### **After Setup, Test This Flow:**

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Complete a test payment** using Paystack test cards

3. **Check Firebase Console:**
   - Go to "Firestore Database"
   - You should see new documents in the `payments` collection
   - Check `customers` collection for customer records

4. **Check your terminal logs:**
   ```
   💾 Payment data saved to Firebase successfully
   💾 Payment record created: {id: "abc123", reference: "AKA_LAW_...", ...}
   ✅ Payment record updated: {status: "success", amount: 450}
   👤 New customer created: john@example.com
   ```

---

## 📈 What Data Gets Saved

### **During Payment Initialization:**
- Customer information (name, email, phone)
- Document details (title, price, category)
- Payment reference and Paystack URLs
- Timestamp and metadata
- Initial status: "pending"

### **After Payment Verification:**
- Final payment status (success/failed)
- Paystack transaction ID
- Payment method used (card/bank)
- Gateway response message
- Customer details from Paystack
- Timestamp when paid

### **Customer Records:**
- Purchase history and total spent
- Documents purchased
- First and last purchase dates
- Marketing preferences

---

## 🔍 Viewing Your Data

### **Firebase Console:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click "Firestore Database"
4. Browse collections: `payments`, `customers`, `downloads`

### **Sample Queries You Can Run:**
- **All successful payments:** Filter `payments` where `paymentStatus == "success"`
- **Customer history:** Filter `payments` where `customerEmail == "john@example.com"`
- **Daily revenue:** Filter `payments` where `createdAt` is today and `paymentStatus == "success"`

---

## ⚠️ Important Security Notes

### **Environment Variables:**
- **NEVER commit `.env.local`** to version control
- **Use different Firebase projects** for development and production
- **Regenerate keys** if accidentally exposed

### **Firebase Rules:**
- **Current rules block all client access** (server-side only)
- **This is intentional** for security
- **All database operations** happen through your API routes

### **Production Setup:**
1. **Create separate Firebase project** for production
2. **Update environment variables** with production keys
3. **Enable Firebase Authentication** if adding user accounts later
4. **Set up proper backup rules**

---

## 🚀 Production Checklist

When ready to go live:

- [ ] Create production Firebase project
- [ ] Update `.env.local` with production Firebase keys
- [ ] Update Paystack keys to LIVE keys
- [ ] Test with real (small) payment
- [ ] Set up Firebase billing alerts
- [ ] Configure proper backup strategy
- [ ] Set up monitoring and alerts

---

## 🛠️ Troubleshooting

### **"Firebase not defined" Error:**
- Check that all Firebase environment variables are set
- Restart your development server after adding variables

### **"Permission denied" Error:**
- This is normal - all operations should go through API routes
- Check that you're not trying to access Firestore directly from frontend

### **"Project not found" Error:**
- Verify `NEXT_PUBLIC_FIREBASE_PROJECT_ID` is correct
- Make sure the Firebase project exists

### **No data appearing:**
- Check browser console for errors
- Check server terminal for Firebase connection logs
- Verify Firestore is enabled in Firebase Console

---

**🎉 You're all set! Your payment system now saves all transaction data to Firebase for proper record keeping and analytics.** 