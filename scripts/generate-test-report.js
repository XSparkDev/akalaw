#!/usr/bin/env node

/**
 * Generate Test Report for AI Analysis
 * This script analyzes Playwright test results and creates a detailed report
 * that can be shared with Cursor AI for automated fixes.
 */

const fs = require('fs');
const path = require('path');

function generateTestReport() {
  const reportDir = path.join(__dirname, '../test-results');
  const outputFile = path.join(__dirname, '../TEST_REPORT_FOR_AI.md');
  
  let report = `# 🧪 Test Report for AI Analysis
Generated: ${new Date().toISOString()}

## 📊 Test Summary

`;

  // Check if test results exist
  if (!fs.existsSync(reportDir)) {
    report += `❌ No test results found. Run tests first with: npm run test\n`;
    fs.writeFileSync(outputFile, report);
    console.log('📄 Test report generated: TEST_REPORT_FOR_AI.md');
    return;
  }

  // Analyze test results
  const testResults = analyzeTestResults(reportDir);
  
  report += `## ✅ Passed Tests (${testResults.passed.length})
${testResults.passed.map(test => `- ✅ ${test}`).join('\n')}

## ❌ Failed Tests (${testResults.failed.length})
${testResults.failed.map(test => `- ❌ ${test.name}: ${test.error}`).join('\n')}

## 🔧 Common Issues Found

### 1. Page Title Issues
- **Problem**: Page title is "v0 App" instead of "AKA Law"
- **Location**: tests/homepage.spec.ts:10
- **Fix Needed**: Update page title in layout.tsx or page.tsx

### 2. Element Locator Issues
- **Problem**: Multiple elements match the same selector
- **Examples**: 
  - "Our Vision" text appears in multiple places
  - "R 550" price appears multiple times
  - Email input has duplicate IDs
- **Fix Needed**: Use more specific selectors or add unique IDs

### 3. Payment Modal Issues
- **Problem**: Payment modal elements not found
- **Location**: tests/payment-flow.spec.ts
- **Fix Needed**: Check PaymentModal component structure

## 🎯 Recommended AI Prompts

### For Page Title Fix:
\`\`\`
The Playwright test expects the page title to contain "AKA Law" but it's currently "v0 App". 
Please update the page title in the layout or main page component.
\`\`\`

### For Element Locator Fixes:
\`\`\`
The Playwright tests are failing because multiple elements match the same selector. 
Please add unique IDs or use more specific selectors for:
1. "Our Vision" text (appears in heading and paragraph)
2. "R 550" price (appears multiple times)
3. Email input fields (duplicate IDs)
\`\`\`

### For Payment Modal Fixes:
\`\`\`
The PaymentModal component is not being found by Playwright tests. 
Please check the component structure and ensure:
1. Modal opens correctly after disclaimer acceptance
2. Form fields have correct placeholders
3. Submit button text matches test expectations
\`\`\`

## 📋 Test Commands

\`\`\`bash
# Run all tests
npm run test

# Run specific test file
npm run test:homepage

# Run with UI mode (interactive)
npm run test:ui

# Generate this report
node scripts/generate-test-report.js
\`\`\`

## 🔍 Debugging Tips

1. **Use UI Mode**: \`npm run test:ui\` to see tests running in browser
2. **Check Screenshots**: Failed tests generate screenshots in test-results/
3. **Review Videos**: Test videos show exactly what happened
4. **Use Headed Mode**: \`npm run test:headed\` to see browser during tests

---

*This report was generated automatically for AI analysis and fixes.*
`;

  fs.writeFileSync(outputFile, report);
  console.log('📄 Test report generated: TEST_REPORT_FOR_AI.md');
}

function analyzeTestResults(reportDir) {
  const passed = [];
  const failed = [];
  
  // This is a simplified analysis - in a real implementation,
  // you would parse the actual test result files
  try {
    const files = fs.readdirSync(reportDir);
    files.forEach(file => {
      if (file.includes('test-failed')) {
        failed.push({
          name: file.replace('test-failed-', '').replace('.png', ''),
          error: 'Test failed - check screenshot and video'
        });
      }
    });
  } catch (error) {
    console.log('No detailed test results found');
  }
  
  return { passed, failed };
}

// Run the report generation
generateTestReport(); 