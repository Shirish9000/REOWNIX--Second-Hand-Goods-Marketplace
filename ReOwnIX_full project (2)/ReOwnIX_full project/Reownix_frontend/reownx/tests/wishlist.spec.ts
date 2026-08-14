import { test, expect } from '@playwright/test';

test('Wishlist Page', async ({ page }) => {

  // Login
  await page.goto('http://localhost:5173/login');

  await page.locator('#email').fill('anshulnilkanth27@gmail.com');
  await page.locator('#password').fill('Anshul@7532');

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL('http://localhost:5173/');

  // Open Wishlist
  await page.goto('http://localhost:5173/profile/wishlist');

  // Wait for page
  await page.waitForLoadState('networkidle');

  // Verify URL
  await expect(page).toHaveURL('http://localhost:5173/profile/wishlist');

  // Screenshot
  await page.screenshot({
    path: 'wishlist-page.png',
    fullPage: true
  });

  // Keep browser open
  await page.waitForTimeout(5000);

});