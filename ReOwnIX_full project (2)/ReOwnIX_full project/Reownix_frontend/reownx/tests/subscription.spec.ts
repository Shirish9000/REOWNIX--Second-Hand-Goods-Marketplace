import { test } from '@playwright/test';

test('Subscription', async ({ page }) => {
  await page.goto('http://localhost:5173/profile/subscription');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'subscription.png' });
});