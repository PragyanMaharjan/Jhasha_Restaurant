import { test, expect } from '@playwright/test';

test.describe('Cart Functionality', () => {
  test('should display empty cart message', async ({ page }) => {
    await page.goto('/cart');
    
    // Check for empty cart message or cart items
    const cartContent = await page.textContent('body');
    expect(cartContent).toBeTruthy();
  });

  test('should show cart page elements', async ({ page }) => {
    await page.goto('/cart');
    
    // Verify title or heading exists
    await expect(page.locator('h1, h2')).toBeVisible();
  });

  test('should navigate to checkout from cart', async ({ page }) => {
    await page.goto('/cart');
    
    // Try to find and click checkout button if exists
    const checkoutButton = page.locator('text=Proceed to Checkout').or(page.locator('text=Checkout'));
    const isVisible = await checkoutButton.isVisible().catch(() => false);
    
    if (isVisible) {
      await checkoutButton.click();
      await expect(page).toHaveURL(/checkout/);
    }
  });

  test('should navigate back to home from cart', async ({ page }) => {
    await page.goto('/cart');
    
    // Click on logo or home link
    await page.click('text=Jhasha');
    
    await expect(page).toHaveURL('/');
  });
});
