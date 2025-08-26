# 🧪 Paystack Payment Testing Guide

## Quick Test Card Numbers

### ✅ **Successful Payment**
- **Card:** `4084084084084081`
- **Expiry:** `12/30`
- **CVV:** `123`
- **Expected:** Payment succeeds, user redirected to success page

### ❌ **Failed Payment**
- **Card:** `4084084084084008`
- **Expiry:** `12/30`
- **CVV:** `123`
- **Expected:** Payment fails, user sees error message

### ⚠️ **Insufficient Funds**
- **Card:** `4084084084084016`
- **Expiry:** `12/30`
- **CVV:** `123`
- **Expected:** Payment declined due to insufficient funds

## 🔄 Complete Flow Testing

### **Test Scenario 1: Successful Purchase**
1. **Start:** Click "Purchase & Download" on any document
2. **Disclaimer:** Read and click "I Agree - Proceed to Purchase"
3. **Payment Form:** Fill in customer details:
   - Name: `John Doe`
   - Email: `john@test.com`
   - Phone: `+27123456789`
4. **Payment:** Click "Pay R450" (or document price)
5. **Paystack:** Use successful test card `4084084084084081`
6. **Verification:** Should redirect to success page
7. **Check:** Look for success message with document details

### **Test Scenario 2: Failed Payment**
1. **Repeat above steps** but use failed card `4084084084084008`
2. **Expected:** Should show failure message
3. **Check:** User should see error and option to try again

### **Test Scenario 3: Abandoned Payment**
1. **Start payment flow** but close Paystack popup
2. **Expected:** User stays on payment modal
3. **Check:** Can restart payment process

## 🔍 What to Monitor

### **1. Browser Console (F12)**
Look for these logs:
```
✅ Payment Initialized Successfully: {reference, amount, customer...}
🔍 Payment Verification Result: {status, amount, gateway_response...}
```

### **2. Terminal/Server Logs**
Monitor your development server for:
- Payment initialization logs
- Verification results
- Any error messages

### **3. Paystack Dashboard**
1. Go to [dashboard.paystack.com](https://dashboard.paystack.com)
2. Navigate to **Transactions**
3. Check **Test** transactions
4. Verify amounts, customer details, and status

## 📊 Testing Checklist

### **Frontend Testing:**
- [ ] Document purchase button works
- [ ] Disclaimer modal appears and functions
- [ ] Payment modal opens with correct document details
- [ ] Form validation works (required fields)
- [ ] Price displays correctly in ZAR (R)
- [ ] Payment button shows correct amount
- [ ] Modal can be closed/cancelled

### **Payment Flow Testing:**
- [ ] Paystack popup opens with correct details
- [ ] Test successful payment (card: 4084084084084081)
- [ ] Test failed payment (card: 4084084084084008)
- [ ] Test insufficient funds (card: 4084084084084016)
- [ ] Payment abandonment handled gracefully

### **Verification Testing:**
- [ ] Successful payment redirects to verification page
- [ ] Success page shows correct document details
- [ ] Failed payment shows appropriate error message
- [ ] Payment reference is displayed
- [ ] Amount shows correctly in ZAR

### **Backend Testing:**
- [ ] API `/api/payment/initialize` returns proper response
- [ ] API `/api/payment/verify` works with test reference
- [ ] Environment variables are loaded correctly
- [ ] Paystack API calls are successful
- [ ] Error handling works for invalid requests

## 🐛 Common Issues & Solutions

### **Issue 1: "Environment variables not defined"**
- **Solution:** Ensure `.env.local` has both TEST keys
- **Check:** Both keys should start with `sk_test_` and `pk_test_`

### **Issue 2: "Forbidden" error**
- **Solution:** Verify you're using matching TEST keys (not mixing test/live)

### **Issue 3: "Currency not supported"**
- **Solution:** Already fixed - we're using ZAR currency
- **Alternative:** Can use USD if ZAR still has issues

### **Issue 4: Verification fails**
- **Check:** Reference parameter is being passed correctly
- **Check:** Paystack webhook/verification API is accessible

## 📱 Mobile Testing

### **Test on Mobile Devices:**
- [ ] Payment modal is responsive
- [ ] Paystack popup works on mobile
- [ ] Success/failure pages display properly
- [ ] Touch interactions work smoothly

## 🎯 Advanced Testing

### **Test Different Document Types:**
- [ ] Test "Last Will & Testament" (R550)
- [ ] Test "Offer To Purchase" (R450)
- [ ] Test "Living Will" (R550)
- [ ] Verify correct pricing for each

### **Test Edge Cases:**
- [ ] Very long customer names
- [ ] International phone numbers
- [ ] Special characters in email/name
- [ ] Network timeout scenarios
- [ ] Multiple rapid payment attempts

## 📈 Success Metrics

### **Your integration is working correctly if:**
1. ✅ **Initialization:** Payment forms submit without errors
2. ✅ **Paystack:** Redirects to Paystack correctly with proper amount
3. ✅ **Processing:** Test payments complete successfully
4. ✅ **Verification:** Success page shows with correct details
5. ✅ **Dashboard:** Transactions appear in Paystack dashboard
6. ✅ **Logs:** Server logs show payment flow details

## 🚀 Go Live Checklist

### **Before switching to production:**
- [ ] Replace TEST keys with LIVE keys in `.env.local`
- [ ] Test with real (small amount) transaction
- [ ] Set up proper webhook endpoints
- [ ] Configure proper success/failure URLs
- [ ] Test document delivery system
- [ ] Set up proper customer support flow

---

**Happy Testing! 🎉** 