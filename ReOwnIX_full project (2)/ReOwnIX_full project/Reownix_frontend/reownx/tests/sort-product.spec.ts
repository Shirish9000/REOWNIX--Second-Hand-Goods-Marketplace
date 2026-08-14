import { test, expect } from '@playwright/test';

test('Sort Products', async ({ page }) => {

  await page.goto('http://localhost:5173/products');

  await page.waitForLoadState('networkidle');

  await page.getByRole('combobox').click();

  await page.getByRole('option', {
    name: 'Price: Low to High'
  }).click();

  await page.waitForTimeout(2000);

});