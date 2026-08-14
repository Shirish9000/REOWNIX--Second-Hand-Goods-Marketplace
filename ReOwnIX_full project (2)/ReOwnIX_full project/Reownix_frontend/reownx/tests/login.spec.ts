import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';

test('User Login', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

   
    await loginPage.open();

    
    await loginPage.login(
        process.env.TEST_EMAIL!,
        process.env.TEST_PASSWORD!
    );

    
    await homePage.verifyHomePage();

});