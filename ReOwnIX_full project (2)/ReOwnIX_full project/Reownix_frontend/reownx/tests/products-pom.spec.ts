import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { ProductsPage } from './pages/ProductsPage';

test('Products Page - POM', async ({ page }) => {

  const login = new LoginPage(page);
  const products = new ProductsPage(page);

  // Login page open करा
  await login.open();

  // Login करा
  await login.login(
    process.env.TEST_EMAIL!,
    process.env.TEST_PASSWORD!
  );

  // Products page
  await products.open();

  await products.verifyProductsPage();
});