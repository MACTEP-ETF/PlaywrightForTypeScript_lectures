import test from "@playwright/test"

test("Login test", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/")
  
  // Login

  await page.fill("#user-name", "standard_user")
  await page.fill("#password", "secret_sauce")
  await page.click("[data-test='login-button']")

  await page.getByTestId('login-button').click()

  await page.waitForTimeout(2000)
});