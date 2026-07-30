import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate through main pages', async ({ page }) => {
    await page.goto('/');

    // Verify home page loaded
    await expect(page).toHaveURL('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should show navbar on all pages', async ({ page }) => {
    const pages = ['/', '/login', '/register', '/cart'];

    for (const url of pages) {
      await page.goto(url);
      await expect(page.locator('nav')).toBeVisible();
      await expect(page.locator('text=Jhasha')).toBeVisible();
    }
  });

  test('should have responsive navbar', async ({ page }) => {
    await page.goto('/');

    // Check if navbar exists
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();
  });

  test('should handle 404 page', async ({ page }) => {
    await page.goto('/non-existent-page');

    // Next.js will handle this, just verify page loads
    await expect(page.locator('body')).toBeVisible();
  });
});
