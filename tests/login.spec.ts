import test, { expect } from "@playwright/test";

test("Login test", async ({ page }) => {
    // Navigate to SauceDemo
    await page.goto("https://www.saucedemo.com/")
    await expect(page).toHaveTitle("Swag Labs")

    // Login
    await page.fill("#user-name", "standard_user")
    await page.fill("#password", "secret_sauce")
    await page.getByTestId('login-button').click() // await page.click("[data-test='login-button']")
    await expect(page.getByTestId('title')).toHaveText('Products')
});