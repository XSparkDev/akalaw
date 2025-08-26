# 🧪 Testing Guide for AKA Law Application

## 📋 **Testing Overview**

This guide covers comprehensive testing strategies for your AKA Law application, including automated tests with Playwright and manual testing procedures.

---

## 🚀 **Quick Start Testing**

### **1. Run Automated Tests**
```bash
# Run all tests
npm run test

# Run specific test file
npm run test:homepage
npm run test:payment
npm run test:api

# Run tests in UI mode (interactive)
npm run test:ui

# Run tests with specific browser
npm run test -- --project=chromium
```

### **2. Manual Testing Checklist**

#### **✅ Homepage Testing**
- [ ] Page loads without errors
- [ ] All sections are visible (Vision, About, Expertise, Library, Contact)
- [ ] Navigation links work correctly
- [ ] Document library displays all 3 documents
- [ ] Prices are displayed correctly
- [ ] Contact information is accurate

#### **✅ Payment Flow Testing**
- [ ] Click "Purchase & Download" opens disclaimer
- [ ] Accepting disclaimer opens payment modal
- [ ] Payment form validates required fields
- [ ] Form accepts valid input
- [ ] Paystack integration works
- [ ] Payment verification page loads
- [ ] Download functionality works

#### **✅ Email Testing**
- [ ] Customer receives email after successful payment
- [ ] Admin receives notification email
- [ ] Email contains correct document information
- [ ] Download link in email works

---

## 🧪 **Automated Testing with Playwright**

### **Test Structure**
```
tests/
├── homepage.spec.ts      # Homepage functionality
├── payment-flow.spec.ts  # Payment process
└── api-endpoints.spec.ts # API testing
```

### **Running Tests**

#### **Basic Test Commands**
```bash
# Install dependencies (if not done)
npm install --save-dev @playwright/test --legacy-peer-deps
npx playwright install

# Run all tests
npx playwright test

# Run specific test file
npx playwright test homepage.spec.ts

# Run tests with UI mode
npx playwright test --ui

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests on specific browser
npx playwright test --project=chromium
```

#### **Test Reports**
```bash
# Generate HTML report
npx playwright show-report

# Run tests and open report
npx playwright test --reporter=html
```

### **Test Categories**

#### **1. Homepage Tests (`homepage.spec.ts`)**
- ✅ Page loading and navigation
- ✅ Document library display
- ✅ Contact information
- ✅ Responsive design

#### **2. Payment Flow Tests (`payment-flow.spec.ts`)**
- ✅ Payment modal opening
- ✅ Form validation
- ✅ User input handling
- ✅ Document information display

#### **3. API Tests (`api-endpoints.spec.ts`)**
- ✅ Payment initialization
- ✅ Firebase data saving
- ✅ Payment verification
- ✅ Download endpoint

---

## 🔧 **Manual Testing Procedures**

### **Payment Testing with Paystack**

#### **Test Cards (Development Mode)**
```bash
# Successful Payment
Card: 4084 0840 8408 4081
Expiry: Any future date
CVV: Any 3 digits

# Declined Payment
Card: 4084 0840 8408 4082

# Insufficient Funds
Card: 4084 0840 8408 4083
```

#### **Step-by-Step Payment Test**
1. **Navigate to homepage** → `http://localhost:3000`
2. **Scroll to document library**
3. **Click "Purchase & Download"** on any document
4. **Accept disclaimer** → "I Agree - Proceed to Purchase"
5. **Fill payment form:**
   - Name: `Test User`
   - Email: `your-email@example.com`
   - Phone: `+27123456789`
6. **Click "Pay with Paystack"**
7. **Use test card** → `4084 0840 8408 4081`
8. **Complete payment** on Paystack
9. **Verify redirect** to `/payment/verify`
10. **Test download** functionality
11. **Check email delivery**

### **Error Scenario Testing**

#### **Payment Declined**
- Use card `4084 0840 8408 4082`
- Verify error handling
- Check user feedback

#### **Network Issues**
- Disconnect internet during payment
- Test error recovery
- Verify user experience

#### **Invalid Data**
- Submit form with missing fields
- Test validation messages
- Verify form behavior

---

## 📊 **Testing Checklist**

### **✅ Pre-Testing Setup**
- [ ] Development server running (`npm run dev`)
- [ ] Firebase configuration correct
- [ ] Paystack test keys configured
- [ ] Email service (Resend) configured
- [ ] Document files in `public/documents/`

### **✅ Functionality Testing**
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Document library displays
- [ ] Payment flow works
- [ ] Email delivery functions
- [ ] Download system works
- [ ] Error handling works

### **✅ Cross-Browser Testing**
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

### **✅ Performance Testing**
- [ ] Page load times
- [ ] Payment processing speed
- [ ] Download speeds
- [ ] Email delivery time

---

## 🐛 **Debugging Common Issues**

### **Payment Issues**
```bash
# Check Paystack configuration
grep -n "PAYSTACK" .env.local

# Verify API keys
echo "Public Key: $NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY"
echo "Secret Key: $PAYSTACK_SECRET_KEY"
```

### **Email Issues**
```bash
# Check Resend configuration
grep -n "RESEND" .env.local

# Test email service
curl -X POST http://localhost:3000/api/test-email
```

### **Download Issues**
```bash
# Check document files
ls -la public/documents/

# Test download endpoint
curl -I http://localhost:3000/api/download/TEST_REF
```

### **Firebase Issues**
```bash
# Check Firebase config
grep -n "FIREBASE" .env.local

# Verify security rules
# Check Firebase Console → Firestore → Rules
```

---

## 📈 **Performance Testing**

### **Load Testing**
```bash
# Install artillery for load testing
npm install -g artillery

# Run load test
artillery quick --count 10 --num 5 http://localhost:3000
```

### **Payment Flow Performance**
- Measure time from payment initiation to completion
- Track email delivery times
- Monitor download speeds

---

## 🔄 **Continuous Testing**

### **Pre-commit Tests**
```bash
# Add to package.json scripts
"test:pre-commit": "playwright test --project=chromium"
```

### **CI/CD Integration**
```yaml
# Example GitHub Actions
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npx playwright install
      - run: npx playwright test
```

---

## 📝 **Test Documentation**

### **Test Results Template**
```markdown
## Test Session: [Date]

### ✅ Passed Tests
- [ ] Homepage loading
- [ ] Payment flow
- [ ] Email delivery
- [ ] Download functionality

### ❌ Failed Tests
- [ ] Issue description
- [ ] Steps to reproduce
- [ ] Expected vs actual behavior

### 🔧 Issues Found
- [ ] Bug description
- [ ] Priority level
- [ ] Fix required
```

---

## 🎯 **Testing Best Practices**

1. **Test Early, Test Often** - Run tests frequently during development
2. **Automate Repetitive Tests** - Use Playwright for UI testing
3. **Test Error Scenarios** - Don't just test happy paths
4. **Cross-Browser Testing** - Ensure compatibility
5. **Performance Monitoring** - Track load times and responsiveness
6. **Document Issues** - Keep detailed bug reports
7. **Regression Testing** - Ensure fixes don't break existing functionality

---

**🎯 Remember: Good testing saves time and prevents issues in production!** 