import { test, expect } from '@playwright/test';

test('Seller Profile Page', async ({ page }) => {

  await page.goto('http://localhost:5173/seller/1');

  await page.waitForLoadState('networkidle');

  await expect(page).toHaveURL(/seller/);

  await page.screenshot({
    path: 'seller-profile.png',
    fullPage: true
  });

});