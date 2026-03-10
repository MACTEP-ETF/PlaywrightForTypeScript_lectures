import test, { expect } from "@playwright/test";
import users from "../fixtures/users.json"

test.beforeEach(async ({ page }) => {
    // Navigate to SauceDemo
    await page.goto("")
    await expect(page).toHaveTitle("Swag Labs")

    // Login
    await page.fill("#user-name", users.validUser.username)
    await page.fill("#password", users.validUser.password)
    await page.getByTestId('login-button').click() // await page.click("[data-test='login-button']")
    await expect(page.getByTestId('title')).toHaveText('Products', { timeout: 10000 })
});

test.describe("Inventory page verification", async () => {
    test("Verify all products are visible", async ({ page }) => {
        for (let i = 0; i < 6; i++) {
            await expect(page.getByTestId('inventory-item').nth(i)).toBeVisible()
            await expect(page.getByTestId('inventory-item-name').nth(i)).toBeVisible()
            await expect(page.locator('.inventory_item_desc').nth(i)).toBeVisible()
            await expect(page.locator('.btn_primary').nth(i)).toBeVisible()
            await expect(page.getByTestId('inventory-item-price').nth(i)).toBeVisible()
        }
    });
});

test.describe("Inventory page validation", () => {
    test("Product name should match in inventory and cart page", async ({ page }) => {
        // Store item title on inventory page
        const sauceLabsBackpak = page.locator('.inventory_item').first()
        const sauceLabsBackpakName = await sauceLabsBackpak.getByTestId('inventory-item-name').textContent()
        const sauceLabsBackpakDesc = await sauceLabsBackpak.getByTestId('inventory-item-desc').textContent()

        // Click Add to cart
        await page.getByRole('button', { name: 'Add to cart'}).first().click()
        await expect(page.getByRole('button', { name: 'Remove'})).toBeVisible()

        // Click shopping cart badge
        await page.getByTestId('shopping-cart-link').click()
        await expect(page.getByTestId('title')).toHaveText('Your Cart')

        // Store item title on cart page
        const cartSauceLabsBackpakName = await page.getByTestId('inventory-item-name').textContent()
        const cartSauceLabsBackpakDesc = await page.getByTestId('inventory-item-desc').textContent()

        // Validate names match
        expect(cartSauceLabsBackpakName).toBe(sauceLabsBackpakName)
        expect(cartSauceLabsBackpakDesc).toBe(sauceLabsBackpakDesc)
    });
});