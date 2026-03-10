import test, { expect, Page } from "@playwright/test";
import users from "../fixtures/users.json"
import { LoginPage } from "../pages/LoginPage";

test.describe("[WEB] Login functionallity", () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to SauceDemo
        await page.goto("");
        await expect(page).toHaveTitle("Swag Labs");
    });

    Object.values(users).forEach(user => {
        test.only(`Login with ${user.username}`, async ({ page }) => {
            const loginPage = new LoginPage(page)
            // Login
            await loginPage.fillLoginForm(user.username, user.password)
            await loginPage.clickLoginButton();
            if (user.expectedResult === "success") {
                await expect(page.getByTestId('title')).toHaveText('Products')
            }
        });
    });

    test("Login with invalid credentials", async ({ page }) => {
        // Fill in username
        await page.getByTestId('username').fill(users.invalidUser.username)

        // Fill in password
        await page.getByTestId('password').fill(users.invalidUser.password)

        // Validate that error icons are not attached
        // await expect(page.locator('.error-message-container')).not.toBeAttached()
        await expect(page.locator('.error_icon')).not.toBeAttached()

        // Click Login button
        await page.locator('.submit-button').click()

        // Validate error message
        await expect(page.locator('.error-message-container')).toBeAttached()
        await expect(page.getByTestId('error')).toHaveText("Epic sadface: Username and password do not match any user in this service")

        // Validate that error icons are attached
        await expect(page.locator('.error_icon').first()).toBeAttached()
        await expect(page.locator('.error_icon').last()).toBeAttached()

        // Click close error button
        await page.getByTestId('error-button').click()

        // Validate that error icons are not attached
        await expect(page.locator('.error_icon')).not.toBeVisible()

        // Validate that error message card is not attached TODO: Uncomment when handled properly on th UI
        // await expect(page.locator('.error-message-container')).not.toBeVisible()
    });

    test("Login in with locked_out_user", async ({ page }) => {
        // Login
        await page.fill("#user-name", users.lockedOutUser.username)
        await page.fill("#password", users.lockedOutUser.password)
        await page.getByTestId('login-button').click()

        // Validate error message
        await expect(page.getByTestId('error')).toHaveText("Epic sadface: Sorry, this user has been locked out.")
    });
});

test.describe("[MOBILE] Login functionallty", () => {

    let mobilePage: Page;
    test.beforeEach(async ({ browser }) => {
        const context = await browser.newContext({
            viewport: { width: 375, height: 660 },
            isMobile: true
        });

        mobilePage = await context.newPage()

        // Navigate to SauceDemo
        await mobilePage.goto("")
        await expect(mobilePage).toHaveTitle("Swag Labs")
    });

    test("Login in with locked_out_user on mobile", async ({ page, browser }) => {
        // Login
        await mobilePage.fill("#user-name", users.lockedOutUser.username)
        await mobilePage.fill("#password", users.lockedOutUser.password)
        await mobilePage.getByTestId('login-button').click()

        // Validate error message
        await expect(mobilePage.getByTestId('error')).toHaveText("Epic sadface: Sorry, this user has been locked out.")
    });

    test("Login in with invalid credentials on mobile", async ({ page, browser }) => {
        // Login
        await mobilePage.fill("#user-name", users.invalidUser.username)
        await mobilePage.fill("#password", users.invalidUser.password)
        await mobilePage.getByTestId('login-button').click()

        // Validate error message
        await expect(mobilePage.getByTestId('error')).toHaveText("Epic sadface: Username and password do not match any user in this service")
    });
});