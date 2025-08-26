# 🤖 AI Fix Request for Playwright Tests

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
```tsx
// In app/layout.tsx or app/page.tsx
export const metadata = {
  title: 'AKA Law - Professional Legal Services',
  description: 'AKA Law provides expert legal services...'
}
```

### For Element Selectors:
```tsx
// Add unique IDs to elements
<h2 id="vision-heading">Our Vision</h2>
<div data-testid="price">R 550</div>
<input id="customer-email" />
```

### For Test Selectors:
```ts
// Use more specific selectors
await expect(page.locator("#vision-heading")).toBeVisible();
await expect(page.locator("[data-testid=price]")).toBeVisible();
await expect(page.locator("#customer-email")).toBeVisible();
```

## 📋 Test Commands

```bash
# Run tests to see current status
npm run test

# Run specific test file
npm run test:homepage

# Generate detailed report
npm run test:generate-report
```

Please implement these fixes to make the Playwright tests pass.