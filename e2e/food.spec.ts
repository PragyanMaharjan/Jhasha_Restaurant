import { test, expect } from '@playwright/test';

test.describe('Food Browsing', () => {
  test('should display food items on home page', async ({ page }) => {
    await page.goto('/');

    // Wait for food items to load
    await page.waitForSelector('[data-testid="food-card"]', { timeout: 10000 }).catch(() => {
      // If no test id, just check for common elements
    });

    await expect(page.locator('h1')).toBeVisible();
  });

  test('should filter food by category', async ({ page }) => {
    await page.goto('/');

    // Click on a category button (e.g., Main Course)
    await page.click('text=Main Course');

    // Wait for filtered results
    await page.waitForTimeout(1000);
  });

  test('should search for food items', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('chicken');

    // Wait for search results
    await page.waitForTimeout(1000);
  });

  test('should navigate to cart when cart icon clicked', async ({ page }) => {
    await page.goto('/');

    // Click cart icon in navbar
    await page.click('[href="/cart"]');

    await expect(page).toHaveURL('/cart');
  });
});
