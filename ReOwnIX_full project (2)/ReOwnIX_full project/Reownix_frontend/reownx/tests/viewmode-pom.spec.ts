import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { ProductsPage } from './pages/ProductsPage';

test('Change View Mode', async ({ page }) => {

  const login = new LoginPage(page);
  const products = new ProductsPage(page);

await login.open();
await login.login(
    process.env.TEST_EMAIL!,
    process.env.TEST_PASSWORD!
);

  await products.open();

  await products.changeToListView();
});