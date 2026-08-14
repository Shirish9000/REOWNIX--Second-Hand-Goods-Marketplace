import { test, expect } from '@playwright/test';

test('My Products', async ({ page }) => {

  // Login
  await page.goto('http://localhost:5173/login');

  await page.locator('#email').fill('anshulnilkanth27@gmail.com');
  await page.locator('#password').fill('Anshul@7532');

  await page.getByRole('button', { name: 'Login' }).click();

  // Verify Login
  await expect(page).toHaveURL('http://localhost:5173/');

  // Open My Products page
  await page.goto('http://localhost:5173/profile/my-products');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Verify URL
  await expect(page).toHaveURL('http://localhost:5173/profile/my-products');

  // Verify created product exists
  await expect(page.getByText('iPhone 13')).toBeVisible();

  // Pause for viewing
  await page.waitForTimeout(5000);

});