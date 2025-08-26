# 🚀 Production Build Folder for cPanel Deployment

## Overview
This guide creates a production-ready folder structure for deploying your Next.js application to cPanel with 1-grid hosting. Since your app is dynamic (not static), we need to create a proper production build.

## ⚠️ Important Notes for cPanel
- **cPanel doesn't support Node.js natively** - we need to use a different approach
- **Your app has server-side API routes** that need to run on a server
- **Environment variables** need to be configured in cPanel
- **Database connections** need to be accessible from the web

## 🗂️ Required Folder Structure

### Option 1: Static Export (Recommended for cPanel)
Since cPanel doesn't support Node.js, we'll create a static export that works with your hosting:

```bash
# Create this folder structure in your project root
production-build/
├── .next/                    # Next.js build output
├── public/                   # Static assets
├── out/                      # Static export (if using static export)
├── package.json              # Production dependencies
├── next.config.mjs          # Production configuration
├── .env.production          # Production environment variables
└── README_DEPLOYMENT.md     # Deployment instructions
```

### Option 2: Vercel/Netlify Deployment (Recommended for Dynamic Apps)
For a truly dynamic app with API routes, consider:
- **Vercel** (best for Next.js)
- **Netlify** (with serverless functions)
- **DigitalOcean App Platform**

## 🔧 Step-by-Step Setup

### Step 1: Create Production Build
```bash
# In your project root
mkdir production-build
cd production-build

# Copy essential files
cp -r ../.next ./
cp -r ../public ./
cp ../package.json ./
cp ../next.config.mjs ./
cp ../tailwind.config.ts ./
cp ../tsconfig.json ./
```

### Step 2: Create Production Environment File
```bash
# Create .env.production (DO NOT commit this to git)
touch .env.production
```

**Add your production environment variables:**
```bash
# Production Environment Variables
NODE_ENV=production

# Paystack Live Keys
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx

# Production Base URL
NEXT_PUBLIC_BASE_URL=https://akalaw.co.za

# Firebase Production Keys
FIREBASE_PROJECT_ID=your-production-project-id
FIREBASE_PRIVATE_KEY_ID=your-production-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-production-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-production-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...

# Resend Production Keys
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=documents@akalaw.co.za
RESEND_FROM_NAME=AKA Law
```

### Step 3: Update Next.js Configuration
```javascript
// next.config.mjs - Production settings
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for cPanel compatibility
  output: 'export',
  
  // Disable server-side features that won't work on cPanel
  trailingSlash: true,
  
  // Ensure images work in production
  images: {
    unoptimized: true
  },
  
  // Disable API routes for static export
  // Note: This means your payment system won't work in static export
}

export default nextConfig
```

## 🚨 CRITICAL LIMITATION: Static Export

**Important**: If you use static export for cPanel:
- ❌ **API routes won't work** (payment system, database, emails)
- ❌ **Server-side rendering won't work**
- ❌ **Dynamic features won't function**
- ✅ **Static pages will display correctly**
- ✅ **UI and animations will work**

## 🔄 Alternative: Hybrid Approach

### Option A: Static Frontend + External Backend
1. **Deploy static frontend** to cPanel (akalaw.co.za)
2. **Deploy API backend** to Vercel/Netlify
3. **Update frontend** to call external API endpoints

### Option B: Full Vercel Deployment
1. **Deploy entire app** to Vercel
2. **Point domain** akalaw.co.za to Vercel
3. **All features work** including payments and database

## 📁 Final Production Folder

Here's what you should create for testing on cPanel:

```bash
production-build/
├── .next/                    # Next.js build
├── public/                   # Static assets
├── .env.production          # Production environment
├── package.json             # Dependencies
├── next.config.mjs          # Production config
└── README_DEPLOYMENT.md     # This file
```

## 🚀 Deployment Steps

### 1. Build Production Version
```bash
npm run build
npm run export  # If using static export
```

### 2. Upload to cPanel
- Upload the `production-build` folder contents to your `public_html` directory
- Ensure `.env.production` is uploaded and accessible

### 3. Configure cPanel
- Set up domain pointing
- Configure environment variables
- Set up SSL certificate

## ⚡ Recommended Solution

**For a dynamic app like yours, I strongly recommend:**

1. **Deploy to Vercel** (free tier available)
2. **Point your domain** akalaw.co.za to Vercel
3. **All features work** including payments, database, emails
4. **Better performance** and reliability
5. **Easier maintenance** and updates

## 🔍 Testing Checklist

- [ ] Pages load correctly
- [ ] Images display properly
- [ ] CSS animations work
- [ ] Responsive design functions
- [ ] Navigation works
- [ ] Forms display correctly

## 📞 Next Steps

1. **Choose your deployment approach** (static vs. dynamic)
2. **Create the production folder** as shown above
3. **Test the build locally** before uploading
4. **Consider Vercel deployment** for full functionality
5. **Update domain settings** accordingly

---

**Remember**: Your app has dynamic features (payments, database, emails) that won't work with static export on cPanel. Consider Vercel deployment for the best user experience.

