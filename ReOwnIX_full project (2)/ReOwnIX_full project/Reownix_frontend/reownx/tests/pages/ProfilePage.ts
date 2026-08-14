import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {

    async open() {
        await this.goto('http://localhost:5173/profile');
        await this.waitForPage();
    }

    async verifyProfilePage() {
        await expect(this.page).toHaveURL(/profile/);

        await expect(
            this.page.getByRole('heading', {
                name: 'Profile Settings'
            })
        ).toBeVisible();
    }

    async logout() {
        await this.page
            .getByRole('button', { name: 'Logout' })
            .click();
    }

    async debug() {
        console.log("Current URL:", await this.page.url());
        console.log(
            "Token:",
            await this.page.evaluate(() => localStorage.getItem('authToken'))
        );
    }
}