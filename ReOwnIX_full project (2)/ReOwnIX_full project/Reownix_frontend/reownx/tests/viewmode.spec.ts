import { test, expect } from '@playwright/test';

test('Change View Mode', async ({ page }) => {

  await page.goto('http://localhost:5173/products');

  await page.getByLabel('list view').click();

  await page.waitForTimeout(1000);

  await page.getByLabel('grid view').click();

  await page.waitForTimeout(1000);

});