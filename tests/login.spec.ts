import test, { expect } from "@playwright/test";

test.skip("Template", async ({ page }) => {
});


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



test("Login with invalid credentials", async ({ page }) => {
    // Navigate to SauceDemo
    await page.goto("https://www.saucedemo.com/")
    await expect(page).toHaveTitle("Swag Labs")

    // Fill in username
    await page.getByTestId('username').fill("invalid_username")

    // Fill in password
    await page.getByTestId('password').fill("invalid_password")
    
    // Validate that error message is not attached
    await expect(page.getByTestId('error')).toHaveCount(0);

    // Validate that error icons are not attached
    await expect(page.locator('.error_icon')).toHaveCount(0);

    // Click Login button
    await page.locator('.submit-button').click()

    // Validate error message
    // await expect(page.locator('.error-message-container')).toBeAttached() // no need to check as it is attached by default, we can check the text instead
    await expect(page.getByTestId('error')).toHaveText("Epic sadface: Username and password do not match any user in this service")

    const error_message = page.getByTestId('error')
    await expect(error_message).toHaveText('Epic sadface: Username and password do not match any user in this service')

    // Click close error button
    await page.getByTestId('error-button').click()

    // Validate that error icons are attached
     /*
    await expect(page.locator('.error_icon').first()).toBeAttached()
    await expect(page.locator('.error_icon').last()).toBeAttached()
    
    The better approach is shown below, as it checks all error icons, 
    not just the first and last one. This is important because there could be more than two error icons, 
    and we want to ensure that none of them are attached.
    */

    const error_icons = await page.locator('.error_icon')
    const count = await error_icons.count()
    for (let i = 0; i < count; i++) {
         const item = error_icons.nth(i);
        await expect(item).not.toBeAttached();
    }

    await expect(page.locator('.error_icon')).not.toBeVisible();
    await expect(page.getByTestId('error')).toHaveCount(0);
});


test("Login in with locked_out_user", async ({ page }) => {
    // Navigate to SauceDemo
    await page.goto("https://www.saucedemo.com/")
    await expect(page).toHaveTitle("Swag Labs")

    // Login
    await page.fill("#user-name", "locked_out_user")
    await page.fill("#password", "secret_sauce")
    await page.getByTestId('login-button').click()

    // Validate error message
    await expect(page.getByTestId('error')).toHaveText("Epic sadface: Sorry, this user has been locked out.")
});