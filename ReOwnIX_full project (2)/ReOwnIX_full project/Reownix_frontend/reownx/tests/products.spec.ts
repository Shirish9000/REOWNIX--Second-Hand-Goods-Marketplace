import { test, expect } from '@playwright/test';

test('Products Page', async ({ page }) => {

  await page.goto('http://localhost:5173/products');

  await expect(page.getByText('Browse Products')).toBeVisible();

});