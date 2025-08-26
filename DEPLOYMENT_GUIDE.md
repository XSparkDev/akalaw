# 🚀 Production Deployment Guide

## Pre-Deployment Checklist

### Step 1: Create Production Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: `aka-law-payments-prod`
3. Enable Firestore Database
4. Copy all configuration keys
5. Update security rules for production

### Step 2: Get Paystack LIVE Keys
1. Login to [Paystack Dashboard](https://dashboard.paystack.com/)
2. Switch to "LIVE" mode (toggle in top-right)
3. Go to Settings → API Keys & Webhooks
4. Copy LIVE public and secret keys
5. Update callback URL to production domain

### Step 3: Prepare Environment Variables
Create production `.env.local`:
```env
# Production Base URL
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Paystack LIVE Keys
PAYSTACK_SECRET_KEY=sk_live_your_actual_live_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_actual_live_key

# Production Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=prod_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=aka-law-payments-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=aka-law-payments-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=aka-law-payments-prod.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=prod_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=prod_app_id
```

## Deployment Options

### Option A: Vercel (Recommended)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Deploy
```bash
# In your project directory
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: aka-law-website
# - Directory: ./
# - Override settings? No
```

#### 3. Set Environment Variables
```bash
# Method 1: Via CLI
vercel env add NEXT_PUBLIC_BASE_URL
# Enter: https://your-domain.vercel.app

vercel env add PAYSTACK_SECRET_KEY
# Enter your LIVE secret key

# Method 2: Via Dashboard
# Go to vercel.com → Your Project → Settings → Environment Variables
# Add all production environment variables
```

#### 4. Custom Domain (Optional)
```bash
# Add custom domain
vercel domains add yourdomain.com
# Follow DNS setup instructions
```

### Option B: Netlify

#### 1. Build for Production
```bash
npm run build
npm run export  # If using static export
```

#### 2. Deploy via CLI
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod --dir=out
```

#### 3. Environment Variables
Go to Netlify dashboard → Site Settings → Environment Variables

### Option C: DigitalOcean App Platform

#### 1. Connect Repository
- Go to DigitalOcean App Platform
- Connect your GitHub repository
- Select branch: `main`

#### 2. Configure Build
- Build Command: `npm run build`
- Output Directory: `.next`
- Node Version: `18.x`

#### 3. Environment Variables
Add all production environment variables in the dashboard

## Post-Deployment Testing

### 1. Smoke Test
```bash
# Test basic functionality
curl https://yourdomain.com
# Should return 200

# Test API endpoints
curl https://yourdomain.com/api/payment/initialize
# Should return method not allowed (expected)
```

### 2. Payment Flow Test
1. Go to your live website
2. Try purchasing a document with a small amount (R5)
3. Use real card details (your own card)
4. Verify in Firebase Console that data is saved
5. Check Paystack dashboard for transaction

### 3. Error Monitoring
Set up error tracking:
```bash
# Install Sentry (example)
npm install @sentry/nextjs

# Configure in next.config.js
const { withSentryConfig } = require('@sentry/nextjs');
module.exports = withSentryConfig(config, sentryWebpackPluginOptions);
```

## Domain & SSL Setup

### Custom Domain Setup
1. **Purchase domain** from registrar (Namecheap, GoDaddy, etc.)
2. **Point DNS** to hosting provider:
   - For Vercel: Add CNAME record pointing to `cname.vercel-dns.com`
   - For Netlify: Add CNAME record pointing to your Netlify subdomain
3. **SSL automatically configured** by hosting provider

### DNS Records Example
```
Type    Name    Value
CNAME   www     aka-law-website.vercel.app
A       @       76.76.19.61 (Vercel IP)
```

## Monitoring & Maintenance

### 1. Set up Monitoring
- **Uptime monitoring**: UptimeRobot, Pingdom
- **Error tracking**: Sentry, Bugsnag
- **Analytics**: Google Analytics, Plausible

### 2. Backup Strategy
- Firebase automatically backs up data
- Export critical data monthly
- Keep local backups of code

### 3. Updates & Maintenance
```bash
# Update dependencies monthly
npm update

# Security updates immediately  
npm audit fix

# Deploy updates
vercel --prod  # or your chosen platform
```

## Troubleshooting Common Issues

### Payment Callback Issues
- Check HTTPS is enabled
- Verify callback URL in Paystack dashboard
- Test with ngrok for local testing

### Firebase Permission Errors
- Update security rules
- Check Firebase project ID
- Verify all environment variables

### Build Failures
```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

## Cost Estimation

### Monthly Costs (Estimated)
- **Hosting**: $0-$20 (Vercel Pro if needed)
- **Domain**: $10-$15/year
- **Firebase**: $0-$25 (depends on usage)
- **Paystack**: 1.5% + ₦100 per transaction
- **Monitoring**: $0-$50 (optional)

**Total**: ~$50-100/month for small business

## Security Best Practices

### 1. Environment Variables
- Never commit `.env.local` to git
- Use different keys for development/production
- Rotate keys every 6 months

### 2. Regular Updates
- Update dependencies monthly
- Monitor security advisories
- Test in staging before production

### 3. Backup & Recovery
- Database backups daily
- Code repository backups
- Document recovery procedures

---

**🎉 Your legal document e-commerce system is now production-ready!** 