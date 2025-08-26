import { test, expect } from '@playwright/test';

test.describe('Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open payment modal when clicking purchase', async ({ page }) => {
    // Scroll to library section
    await page.locator('text=Legal Document Library').scrollIntoViewIfNeeded();
    
    // Click on first document's purchase button
    await page.locator('text=Purchase & Download').first().click();
    
    // Should show disclaimer modal
    await expect(page.locator('text=Legal Document Purchase Agreement')).toBeVisible();
    await expect(page.locator('text=I Agree - Proceed to Purchase')).toBeVisible();
  });

  test('should show payment form after accepting disclaimer', async ({ page }) => {
    await page.locator('text=Legal Document Library').scrollIntoViewIfNeeded();
    await page.locator('text=Purchase & Download').first().click();
    
    // Accept disclaimer
    await page.locator('text=I Agree - Proceed to Purchase').click();
    
    // Should show payment modal
    await expect(page.locator('text=Complete Your Purchase')).toBeVisible();
    await expect(page.locator('input[placeholder="Your full name"]')).toBeVisible();
    await expect(page.locator("#customer-email")).toBeVisible();
  });

  test('should validate payment form fields', async ({ page }) => {
    await page.locator('text=Legal Document Library').scrollIntoViewIfNeeded();
    await page.locator('text=Purchase & Download').first().click();
    await page.locator('text=I Agree - Proceed to Purchase').click();
    
    // Try to submit without filling required fields
    await page.locator('text=Pay with Paystack').click();
    
    // Should show validation errors
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
  });

  test('should allow filling payment form', async ({ page }) => {
    await page.locator('text=Legal Document Library').scrollIntoViewIfNeeded();
    await page.locator('text=Purchase & Download').first().click();
    await page.locator('text=I Agree - Proceed to Purchase').click();
    
    // Fill form
    await page.locator('input[placeholder="Your full name"]').fill('Test User');
    await page.locator("#customer-email").fill("test@example.com");
    await page.locator('input[placeholder="+27 12 345 6789"]').fill('+27123456789');
    
    // Check that form is filled
    await expect(page.locator('input[placeholder="Your full name"]')).toHaveValue('Test User');
    await expect(page.locator('input[placeholder="your.email@example.com"]')).toHaveValue('test@example.com');
  });

  test('should show correct document information in payment form', async ({ page }) => {
    await page.locator('text=Legal Document Library').scrollIntoViewIfNeeded();
    await page.locator('text=Purchase & Download').first().click();
    await page.locator('text=I Agree - Proceed to Purchase').click();
    
    // Should show document details
    await expect(page.locator('text=Offer To Purchase - Residential Property')).toBeVisible();
    await expect(page.locator('text=R 450')).toBeVisible();
  });
}); 