import { test, expect } from '@playwright/test';

test('My Offers Page', async ({ page }) => {

  await page.goto('http://localhost:5173/login');

  await page.locator('#email').fill('anshulnilkanth27@gmail.com');
  await page.locator('#password').fill('Anshul@7532');

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL('http://localhost:5173/');

  await page.goto('http://localhost:5173/profile/my-offers');

  await page.waitForLoadState('networkidle');

  await expect(page).toHaveURL('http://localhost:5173/profile/my-offers');

});