import { test, expect } from '@playwright/test';

test('Product Details Page', async ({ page }) => {

  await page.goto('http://localhost:5173/products/1');

  await page.waitForLoadState('networkidle');

  await expect(page).not.toHaveURL(/404/);

  await page.screenshot({
    path: 'product-details.png',
    fullPage: true
  });

});