import { test, expect } from '@playwright/test';

test('Auction Room Page', async ({ page }) => {

  await page.goto('http://localhost:5173/auctions/2');

  await page.waitForLoadState('networkidle');

  await expect(page).toHaveURL('http://localhost:5173/auctions/2');

  // Page heading verify (जर heading असेल)
  await expect(
    page.getByRole('heading').first()
  ).toBeVisible();

  await page.screenshot({
    path: 'auction-room.png',
    fullPage: true
  });

});