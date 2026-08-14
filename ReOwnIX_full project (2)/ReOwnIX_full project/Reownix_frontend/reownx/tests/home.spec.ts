import { test, expect } from '@playwright/test';

test('Open ReOwnIX Home Page', async ({ page }) => {
  await page.goto('http://localhost:5173');

  console.log(await page.title());
});