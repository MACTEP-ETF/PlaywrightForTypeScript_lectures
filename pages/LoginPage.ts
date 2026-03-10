import { Locator, Page } from "@playwright/test";

export class LoginPage {
    page: Page;
    usernameInput: Locator;
    passwordInput: Locator;
    loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = this.page.locator("#user-name");
        this.passwordInput = this.page.locator("#password");
        this.loginButton = this.page.getByTestId('login-button')
    }

    async fillLoginForm(username: string, password: string) {
        await this.usernameInput.fill(username)
        await this.passwordInput.fill(password)
    }

    async clickLoginButton() {
        await this.loginButton.click()
    }
}