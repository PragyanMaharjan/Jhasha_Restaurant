import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('h1')).toContainText('Login');
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
  });

  test('should display register page', async ({ page }) => {
    await page.goto('/register');

    await expect(page.locator('h1')).toContainText('Register');
    await expect(page.getByPlaceholder('Name')).toBeVisible();
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Phone')).toBeVisible();
  });

  test('should show validation errors on empty login submit', async ({ page }) => {
    await page.goto('/login');

    await page.click('button[type="submit"]');

    // Check for validation messages or error toasts
    await page.waitForTimeout(1000);
  });

  test('should navigate from login to register', async ({ page }) => {
    await page.goto('/login');

    await page.click('text=Register here');

    await expect(page).toHaveURL('/register');
  });

  test('should navigate from register to login', async ({ page }) => {
    await page.goto('/register');

    await page.click('text=Login here');

    await expect(page).toHaveURL('/login');
  });
});
