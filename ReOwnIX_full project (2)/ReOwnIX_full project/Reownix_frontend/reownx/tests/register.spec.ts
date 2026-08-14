import { test, expect } from '@playwright/test';

test('User Register', async ({ page }) => {

  await page.goto('http://localhost:5173/register');

  await page.locator('#firstName').fill('Test');

  await page.locator('#lastName').fill('User');

  await page.locator('#email').fill(`test${Date.now()}@gmail.com`);

  await page.locator('#password').fill('Test@123');

  await page.locator('#confirmPassword').fill('Test@123');

  await page.getByRole('button', { name: 'Create Account' }).click();

  
  await expect(page).toHaveURL('http://localhost:5173/login');

});