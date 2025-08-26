#!/usr/bin/env node

/**
 * AI Test Fixer
 * Automatically fixes common Playwright test issues based on test results
 */

const fs = require('fs');
const path = require('path');

class AITestFixer {
  constructor() {
    this.fixes = [];
  }

  // Fix 1: Update page title
  fixPageTitle() {
    const layoutPath = path.join(__dirname, '../app/layout.tsx');
    const pagePath = path.join(__dirname, '../app/page.tsx');
    
    try {
      // Check if layout.tsx exists and update title
      if (fs.existsSync(layoutPath)) {
        let content = fs.readFileSync(layoutPath, 'utf8');
        if (content.includes('v0 App') || content.includes('my-v0-project')) {
          content = content.replace(/title.*=.*['"`][^'"`]*['"`]/g, 'title="AKA Law - Professional Legal Services"');
          fs.writeFileSync(layoutPath, content);
          this.fixes.push('✅ Updated page title in layout.tsx');
        }
      }
    } catch (error) {
      console.log('⚠️ Could not fix page title:', error.message);
    }
  }

  // Fix 2: Add unique IDs to elements
  fixElementSelectors() {
    const pagePath = path.join(__dirname, '../app/page.tsx');
    
    try {
      let content = fs.readFileSync(pagePath, 'utf8');
      
      // Fix "Our Vision" heading
      if (content.includes('Our Vision') && !content.includes('id="vision-heading"')) {
        content = content.replace(
          /<h2.*?text-4xl.*?Our Vision.*?<\/h2>/s,
          '<h2 id="vision-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Our Vision</h2>'
        );
      }
      
      // Fix price elements
      if (content.includes('R 550') && !content.includes('data-testid="price"')) {
        content = content.replace(
          /<div.*?text-2xl.*?font-bold.*?text-primary.*?R 550.*?<\/div>/g,
          '<div data-testid="price" className="text-2xl font-bold text-primary">R 550</div>'
        );
      }
      
      fs.writeFileSync(pagePath, content);
      this.fixes.push('✅ Added unique IDs and test attributes to elements');
    } catch (error) {
      console.log('⚠️ Could not fix element selectors:', error.message);
    }
  }

  // Fix 3: Update test selectors to be more specific
  fixTestSelectors() {
    const testPath = path.join(__dirname, '../tests/homepage.spec.ts');
    
    try {
      let content = fs.readFileSync(testPath, 'utf8');
      
      // Update "Our Vision" selector to be more specific
      content = content.replace(
        /await expect\(page\.locator\('text=Our Vision'\)\)\.toBeVisible\(\);/g,
        'await expect(page.locator("#vision-heading")).toBeVisible();'
      );
      
      // Update price selector to be more specific
      content = content.replace(
        /await expect\(page\.locator\('text=R 550'\)\)\.toBeVisible\(\);/g,
        'await expect(page.locator("[data-testid=price]")).toBeVisible();'
      );
      
      fs.writeFileSync(testPath, content);
      this.fixes.push('✅ Updated test selectors to be more specific');
    } catch (error) {
      console.log('⚠️ Could not fix test selectors:', error.message);
    }
  }

  // Fix 4: Update payment modal tests
  fixPaymentModalTests() {
    const testPath = path.join(__dirname, '../tests/payment-flow.spec.ts');
    
    try {
      let content = fs.readFileSync(testPath, 'utf8');
      
      // Update email input selector to be more specific
      content = content.replace(
        /await expect\(page\.locator\('input\[placeholder="your\.email@example\.com"\]'\)\)\.toBeVisible\(\);/g,
        'await expect(page.locator("#customer-email")).toBeVisible();'
      );
      
      // Update form filling to use specific selectors
      content = content.replace(
        /await page\.locator\('input\[placeholder="your\.email@example\.com"\]'\)\.fill\('test@example\.com'\);/g,
        'await page.locator("#customer-email").fill("test@example.com");'
      );
      
      fs.writeFileSync(testPath, content);
      this.fixes.push('✅ Updated payment modal test selectors');
    } catch (error) {
      console.log('⚠️ Could not fix payment modal tests:', error.message);
    }
  }

  // Generate AI prompt for manual fixes
  generateAIPrompt() {
    const prompt = `# 🤖 AI Fix Request for Playwright Tests

## 🎯 Issues Found

Based on the Playwright test results, the following issues need to be fixed:

### 1. Page Title Issue
- **Problem**: Tests expect title to contain "AKA Law" but it's "v0 App"
- **Fix**: Update the page title in layout.tsx or page.tsx

### 2. Element Selector Issues
- **Problem**: Multiple elements match the same selector
- **Examples**: "Our Vision", "R 550", email inputs
- **Fix**: Add unique IDs or data-testid attributes

### 3. Payment Modal Issues
- **Problem**: Payment modal elements not found by tests
- **Fix**: Check PaymentModal component structure and selectors

## 🔧 Recommended Fixes

### For Page Title:
\`\`\`tsx
// In app/layout.tsx or app/page.tsx
export const metadata = {
  title: 'AKA Law - Professional Legal Services',
  description: 'AKA Law provides expert legal services...'
}
\`\`\`

### For Element Selectors:
\`\`\`tsx
// Add unique IDs to elements
<h2 id="vision-heading">Our Vision</h2>
<div data-testid="price">R 550</div>
<input id="customer-email" />
\`\`\`

### For Test Selectors:
\`\`\`ts
// Use more specific selectors
await expect(page.locator("#vision-heading")).toBeVisible();
await expect(page.locator("[data-testid=price]")).toBeVisible();
await expect(page.locator("#customer-email")).toBeVisible();
\`\`\`

## 📋 Test Commands

\`\`\`bash
# Run tests to see current status
npm run test

# Run specific test file
npm run test:homepage

# Generate detailed report
npm run test:generate-report
\`\`\`

Please implement these fixes to make the Playwright tests pass.`;

    fs.writeFileSync(path.join(__dirname, '../AI_FIX_REQUEST.md'), prompt);
    console.log('📄 AI fix request generated: AI_FIX_REQUEST.md');
  }

  // Run all fixes
  runFixes() {
    console.log('🔧 Running automatic fixes...\n');
    
    this.fixPageTitle();
    this.fixElementSelectors();
    this.fixTestSelectors();
    this.fixPaymentModalTests();
    this.generateAIPrompt();
    
    console.log('\n📊 Fix Summary:');
    this.fixes.forEach(fix => console.log(fix));
    
    if (this.fixes.length > 0) {
      console.log('\n🎯 Next Steps:');
      console.log('1. Review the changes made');
      console.log('2. Run tests again: npm run test');
      console.log('3. Check AI_FIX_REQUEST.md for additional manual fixes');
    }
  }
}

// Run the fixer
const fixer = new AITestFixer();
fixer.runFixes(); 