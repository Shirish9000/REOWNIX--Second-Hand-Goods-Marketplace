import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {

    async open() {
        await this.goto('http://localhost:5173/products');
    }

    async searchProduct(product: string) {
        await this.page
            .getByPlaceholder('Search products...')
            .fill(product);
    }

    async verifyProductVisible(product: string) {
        await expect(
            this.page.getByText(product)
        ).toBeVisible();
    }

    async sortNewest() {
        await this.page.locator('[role="combobox"]').click();
        await this.page.getByRole('option', {
            name: 'Newest First'
        }).click();
    }

    async changeToListView() {
        await this.page
            .getByRole('button', {
                name: /list view/i
            })
            .click();
    }

    async verifyProductsPage() {
        await expect(this.page).toHaveURL(/products/);
    }
}