import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';

test('Profile Page', async ({ page }) => {

    const login = new LoginPage(page);
    const profile = new ProfilePage(page);

    
    await login.open();

    
    await login.login(
        process.env.TEST_EMAIL!,
        process.env.TEST_PASSWORD!
    );

    console.log("URL =", await page.url());

    console.log(
        "TOKEN =",
        await page.evaluate(() => localStorage.getItem('authToken'))
    );

    
    await profile.open();

   
    await profile.debug();

    
    await profile.verifyProfilePage();
});