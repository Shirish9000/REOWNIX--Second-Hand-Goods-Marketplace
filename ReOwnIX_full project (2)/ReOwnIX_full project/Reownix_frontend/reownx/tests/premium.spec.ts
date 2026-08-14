import { test, expect } from '@playwright/test';

test('Premium Plans Page', async ({ page }) => {

  await page.goto('http://localhost:5173/premium');

  await page.waitForLoadState('networkidle');

  await expect(page).toHaveURL('http://localhost:5173/premium');

  await page.screenshot({
    path: 'premium-page.png',
    fullPage: true
  });

});