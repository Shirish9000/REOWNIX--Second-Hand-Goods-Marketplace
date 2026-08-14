import { BasePage } from './BasePage';

export class LoginPage extends BasePage {

    async open() {
        await this.goto('http://localhost:5173/login');
    }

    async login(email: string, password: string) {

        await this.page.locator('#email').fill(email);

        await this.page.locator('#password').fill(password);

        await this.page.getByRole('button', {
            name: 'Login'
        }).click();

        await this.page.waitForTimeout(3000);

console.log(
  await this.page.locator('body').innerText()
);

    }

}