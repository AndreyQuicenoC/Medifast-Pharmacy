import { test, expect } from "@playwright/test";

test("pagina de login visible", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /welcome to login/i })).toBeVisible();
});
