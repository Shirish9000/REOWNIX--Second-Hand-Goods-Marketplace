import { test, expect } from '@playwright/test';

test('Search Product', async ({ page }) => {

  await page.goto('http://localhost:5173/products');

  await page.getByPlaceholder('Search products...').fill('iPhone');

  await expect(page.getByText('iPhone 13')).toBeVisible({
    timeout:10000
  });

});