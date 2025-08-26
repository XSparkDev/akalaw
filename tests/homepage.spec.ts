import { test, expect } from '@playwright/test';

test.describe('AKA Law Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Check if the page loads
    await expect(page).toHaveTitle(/AKA Law/);
    
    // Check if main sections are visible
    await expect(page.locator("#vision-heading")).toBeVisible();
    await expect(page.locator('text=About us.')).toBeVisible();
    await expect(page.locator('text=Our Expertise')).toBeVisible();
    await expect(page.locator('text=Legal Document Library')).toBeVisible();
  });

  test('should display all legal documents', async ({ page }) => {
    // Scroll to library section
    await page.locator('text=Legal Document Library').scrollIntoViewIfNeeded();
    
    // Check if all documents are displayed
    await expect(page.locator('text=Offer To Purchase - Residential Property')).toBeVisible();
    await expect(page.locator('text=Last Will & Testament')).toBeVisible();
    await expect(page.locator('text=Living Will')).toBeVisible();
  });

  test('should show document prices correctly', async ({ page }) => {
    await page.locator('text=Legal Document Library').scrollIntoViewIfNeeded();
    
    // Check prices
    await expect(page.locator('text=R 450')).toBeVisible();
    await expect(page.locator("[data-testid=price]")).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Test navigation links
    await page.locator('text=Home').click();
    await expect(page.locator("#vision-heading")).toBeVisible();
    
    await page.locator('text=Vision').click();
    await expect(page.locator("#vision-heading")).toBeVisible();
    
    await page.locator('text=About').click();
    await expect(page.locator('text=About us.')).toBeVisible();
  });

  test('should display contact information', async ({ page }) => {
    await page.locator('text=Contact Us').scrollIntoViewIfNeeded();
    
    // Check contact details
    await expect(page.locator('text=+27 82 562 3826')).toBeVisible();
    await expect(page.locator('text=anchane@akalaw.co.za')).toBeVisible();
  });
}); 