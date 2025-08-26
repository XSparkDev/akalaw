# Paystack Live Keys Setup Guide

## Overview
This guide walks you through transitioning from Paystack test keys to live keys for production use. This is a critical step before going live with your payment system.

## ⚠️ IMPORTANT: Before You Begin
- **NEVER commit live API keys to version control**
- Ensure your `.env.local` file is in `.gitignore`
- Test thoroughly with live keys on a staging environment first
- Have your Paystack account fully verified and approved

## Step 1: Update Environment Variables

### 1.1 Backup Current Test Keys
First, backup your current test keys in case you need them for development:

```bash
# In your .env.local file, comment out or backup test keys
# PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
# NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
```

### 1.2 Add Live Keys
Replace the test keys with your live keys:

```bash
# Live Paystack Keys (Production)
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx
```

## Step 2: Update Paystack Configuration

### 2.1 Verify Configuration Files
Ensure your `lib/paystack/config.ts` is properly set up for production:

```typescript
// This should already be correct, but verify:
export const paystackConfig = {
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  secretKey: process.env.PAYSTACK_SECRET_KEY || '',
  baseUrl: 'https://api.paystack.co' // This should be the live URL
}
```

### 2.2 Test Configuration Loading
Restart your development server and verify the keys are loaded:

```bash
npm run dev
```

Check your browser console and server logs to ensure no configuration errors.

## Step 3: Test Live Payment Flow

### 3.1 Use Real Payment Methods
With live keys, you can now test with:
- Real credit/debit cards
- Real bank accounts
- Real mobile money accounts

### 3.2 Test Complete Payment Flow
1. **Open your application**
2. **Select a document to purchase**
3. **Fill out the payment form**
4. **Use a real payment method** (small amount recommended)
5. **Complete the payment**
6. **Verify redirect to success page**
7. **Check document download functionality**

### 3.3 Monitor Paystack Dashboard
- Log into your Paystack dashboard
- Check the "Transactions" section
- Verify payment appears as successful
- Check webhook delivery status

## Step 4: Update Other Environment Variables

### 4.1 Base URL
Update your base URL for production:

```bash
# Development (current)
# NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Production (update this when you deploy)
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 4.2 Firebase Configuration
Ensure you have production Firebase keys:

```bash
# Production Firebase Keys
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
```

### 4.3 Resend Email Configuration
Update email configuration for production:

```bash
# Production Resend Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
# Update from email to your verified domain
RESEND_FROM_EMAIL=documents@akalaw.co.za
RESEND_FROM_NAME=AKA Law
```

## Step 5: Security Considerations

### 5.1 Environment File Security
```bash
# Ensure .env.local is in .gitignore
echo ".env.local" >> .gitignore

# Verify it's not tracked
git status
```

### 5.2 Firebase Security Rules
Update your Firebase security rules for production:

```javascript
// In Firebase Console > Firestore > Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // More restrictive rules for production
    match /payments/{document} {
      allow read, write: if request.auth != null;
    }
    match /customers/{document} {
      allow read, write: if request.auth != null;
    }
    match /downloads/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 6: Testing Checklist

### 6.1 Payment Testing
- [ ] Payment initialization works
- [ ] Payment verification succeeds
- [ ] Database records are created
- [ ] Email notifications are sent
- [ ] Document downloads work
- [ ] Error handling works properly

### 6.2 Edge Cases
- [ ] Test with declined cards
- [ ] Test with insufficient funds
- [ ] Test network timeouts
- [ ] Test invalid payment references

## Step 7: Go Live Preparation

### 7.1 Final Verification
- [ ] All live keys are working
- [ ] Payment flow is tested end-to-end
- [ ] Database is properly configured
- [ ] Email system is functional
- [ ] Document downloads are working
- [ ] Error handling is robust

### 7.2 Monitoring Setup
- [ ] Set up Paystack webhook monitoring
- [ ] Configure Firebase monitoring
- [ ] Set up email delivery monitoring
- [ ] Prepare customer support procedures

## Step 8: Deployment

### 8.1 Update Production Environment
When you deploy to production, ensure:
- All environment variables are set correctly
- `.env.local` is not included in the deployment
- Production Firebase project is configured
- Production Resend domain is verified

### 8.2 Post-Deployment Testing
After deployment:
- Test the complete payment flow again
- Verify all integrations are working
- Monitor for any errors or issues
- Test customer support procedures

## Troubleshooting Common Issues

### Issue: "Invalid API Key"
- Verify the key format starts with `sk_live_` or `pk_live_`
- Check for extra spaces or characters
- Ensure the key is active in your Paystack dashboard

### Issue: "Currency not supported"
- Verify your Paystack account supports ZAR
- Check if you need to enable additional currencies
- Contact Paystack support if needed

### Issue: "Webhook delivery failed"
- Check your webhook URL configuration
- Verify your server is accessible
- Check webhook signature verification

## Support Resources

- **Paystack Documentation**: [https://paystack.com/docs](https://paystack.com/docs)
- **Paystack Support**: [https://paystack.com/support](https://paystack.com/support)
- **Firebase Documentation**: [https://firebase.google.com/docs](https://firebase.google.com/docs)
- **Resend Documentation**: [https://resend.com/docs](https://resend.com/docs)

## Next Steps

After completing this setup:
1. **Test thoroughly** with small amounts
2. **Monitor closely** for the first few days
3. **Prepare customer support** for payment issues
4. **Set up monitoring** and alerting
5. **Document procedures** for your team

---

**Remember**: Live payments involve real money. Always test thoroughly and have proper monitoring in place before going live with customers.
