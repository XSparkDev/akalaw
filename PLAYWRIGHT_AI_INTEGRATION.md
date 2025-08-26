# 🤖 Playwright + Cursor AI Integration Guide

## 🎯 **Overview**

This guide shows you how to use Playwright test results to automatically generate AI prompts for Cursor AI to fix issues. The system includes:

1. **Automated Test Analysis** - Identifies common issues
2. **AI Prompt Generation** - Creates specific fix requests
3. **Automatic Fixes** - Some issues can be fixed automatically
4. **Manual Fix Guidance** - Detailed instructions for complex issues

---

## 🚀 **Quick Start**

### **1. Run Tests and Generate AI Report**
```bash
# Run all tests
npm run test

# Generate AI analysis report
npm run test:generate-report

# Run automatic fixes
npm run test:fix
```

### **2. Use Generated Files with Cursor AI**

The system generates these files for AI analysis:

- `TEST_REPORT_FOR_AI.md` - Detailed test analysis
- `AI_FIX_REQUEST.md` - Specific fix instructions
- `test-results/` - Screenshots and videos of failures

**Copy the content of these files and paste them into Cursor AI with:**
```
"Please analyze this test report and implement the suggested fixes:"
[Paste the content of AI_FIX_REQUEST.md]
```

---

## 🔧 **Available Commands**

```bash
# Testing
npm run test                    # Run all tests
npm run test:homepage          # Run homepage tests only
npm run test:payment           # Run payment flow tests only
npm run test:api               # Run API tests only
npm run test:ui                # Run tests with UI mode (interactive)
npm run test:headed            # Run tests with browser visible

# AI Integration
npm run test:generate-report   # Generate detailed AI report
npm run test:fix              # Run automatic fixes
npm run test:report           # Open HTML test report
```

---

## 📊 **How It Works**

### **Step 1: Test Execution**
```bash
npm run test
```
- Runs Playwright tests across multiple browsers
- Generates screenshots and videos of failures
- Creates detailed error reports

### **Step 2: AI Analysis**
```bash
npm run test:generate-report
```
- Analyzes test results
- Identifies common patterns
- Generates specific fix recommendations

### **Step 3: Automatic Fixes**
```bash
npm run test:fix
```
- Fixes common issues automatically:
  - Page title updates
  - Element selector improvements
  - Test selector updates
  - Payment modal fixes

### **Step 4: AI Prompt Generation**
Creates `AI_FIX_REQUEST.md` with:
- Specific issues found
- Recommended code changes
- Test commands to verify fixes

---

## 🎯 **AI Integration Workflow**

### **Method 1: Direct AI Prompt**
1. Run tests: `npm run test`
2. Generate report: `npm run test:generate-report`
3. Copy content from `AI_FIX_REQUEST.md`
4. Paste into Cursor AI with context

### **Method 2: Screenshot Analysis**
1. Run tests with UI mode: `npm run test:ui`
2. Take screenshots of failing tests
3. Share screenshots with Cursor AI
4. Ask AI to analyze visual issues

### **Method 3: Video Analysis**
1. Run tests: `npm run test`
2. Check `test-results/` for video files
3. Share video with Cursor AI
4. Ask AI to analyze behavior issues

### **Method 4: Error Log Analysis**
1. Run tests and capture console output
2. Share error logs with Cursor AI
3. Ask AI to analyze stack traces

---

## 📋 **Common AI Prompts**

### **For Page Title Issues:**
```
The Playwright test expects the page title to contain "AKA Law" but it's currently "v0 App". 
Please update the page title in the layout or main page component.
```

### **For Element Selector Issues:**
```
The Playwright tests are failing because multiple elements match the same selector. 
Please add unique IDs or data-testid attributes to:
1. "Our Vision" heading
2. Price elements (R 550)
3. Email input fields
```

### **For Payment Modal Issues:**
```
The PaymentModal component is not being found by Playwright tests. 
Please check the component structure and ensure:
1. Modal opens correctly after disclaimer acceptance
2. Form fields have correct placeholders
3. Submit button text matches test expectations
```

### **For Responsive Design Issues:**
```
The Playwright tests are failing on mobile browsers. 
Please check the responsive design and ensure:
1. Elements are visible on mobile viewports
2. Touch interactions work correctly
3. Text is readable on small screens
```

---

## 🔍 **Debugging with AI**

### **Share Test Results:**
```bash
# Generate comprehensive report
npm run test:generate-report

# Copy the report content
cat TEST_REPORT_FOR_AI.md

# Share with Cursor AI
```

### **Share Screenshots:**
```bash
# Run tests with screenshots
npm run test

# Find screenshots
ls test-results/*/test-failed-*.png

# Share screenshots with AI
```

### **Share Videos:**
```bash
# Run tests with video recording
npm run test

# Find videos
ls test-results/*/video.webm

# Share videos with AI
```

---

## 🛠️ **Advanced AI Integration**

### **Custom Test Analysis:**
```javascript
// Create custom analysis script
const fs = require('fs');

function analyzeTestResults() {
  const results = fs.readdirSync('test-results');
  const issues = [];
  
  results.forEach(file => {
    if (file.includes('test-failed')) {
      issues.push({
        test: file,
        type: 'failure',
        screenshot: `${file}/test-failed-1.png`
      });
    }
  });
  
  return issues;
}
```

### **AI Prompt Templates:**
```markdown
# Test Failure Analysis Request

## Context
- Application: AKA Law Landing Page
- Framework: Next.js with TypeScript
- Testing: Playwright E2E tests

## Issues Found
[Paste test results here]

## Request
Please analyze these test failures and provide:
1. Root cause analysis
2. Specific code fixes
3. Test improvements
4. Prevention strategies
```

---

## 📈 **Continuous Integration**

### **GitHub Actions Example:**
```yaml
name: Test and Generate AI Report
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npx playwright install
      - run: npm run test
      - run: npm run test:generate-report
      - uses: actions/upload-artifact@v2
        with:
          name: test-results
          path: test-results/
      - uses: actions/upload-artifact@v2
        with:
          name: ai-report
          path: AI_FIX_REQUEST.md
```

### **Pre-commit Hook:**
```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running Playwright tests..."
npm run test:homepage

if [ $? -ne 0 ]; then
  echo "Tests failed. Generating AI report..."
  npm run test:generate-report
  echo "Check AI_FIX_REQUEST.md for fixes"
  exit 1
fi
```

---

## 🎯 **Best Practices**

### **1. Test Organization**
- Keep tests focused and specific
- Use descriptive test names
- Group related tests together
- Maintain test data separately

### **2. AI Prompt Quality**
- Provide specific error messages
- Include relevant code context
- Specify expected vs actual behavior
- Mention framework and dependencies

### **3. Fix Verification**
- Run tests after each fix
- Check multiple browsers
- Verify mobile responsiveness
- Test error scenarios

### **4. Documentation**
- Document test purposes
- Explain complex test logic
- Keep AI prompts reusable
- Update guides regularly

---

## 🔧 **Troubleshooting**

### **Common Issues:**

#### **Tests Not Running:**
```bash
# Check Playwright installation
npx playwright install

# Verify test files exist
ls tests/*.spec.ts

# Check configuration
cat playwright.config.ts
```

#### **AI Fixes Not Working:**
```bash
# Regenerate AI report
npm run test:generate-report

# Check for new issues
npm run test

# Review manual fixes needed
cat AI_FIX_REQUEST.md
```

#### **Browser Issues:**
```bash
# Install specific browser
npx playwright install chromium

# Run with specific browser
npm run test -- --project=chromium

# Debug with headed mode
npm run test:headed
```

---

## 📚 **Resources**

- [Playwright Documentation](https://playwright.dev/)
- [Cursor AI Documentation](https://cursor.sh/docs)
- [Test Report Examples](https://playwright.dev/docs/test-reporters)
- [AI Integration Patterns](https://github.com/playwright-ai-integration)

---

**🎯 Remember: The goal is to use Playwright's detailed test results to give Cursor AI the context it needs to make precise, effective fixes!** 