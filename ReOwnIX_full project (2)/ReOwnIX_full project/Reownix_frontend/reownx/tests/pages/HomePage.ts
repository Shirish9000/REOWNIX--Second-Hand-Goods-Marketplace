import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {

    async open() {
        await this.goto('http://localhost:5173/');
    }

    async verifyHomePage() {
        await expect(this.page).toHaveURL('http://localhost:5173/');
    }

}