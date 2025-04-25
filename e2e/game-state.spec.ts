import { test, expect } from "@playwright/test";

const serverUrl = "http://localhost:5173/";

test.describe("Start menu should", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(serverUrl);
  });

  test("appear at first", async ({ page }) => {
    await expect(page.getByTestId("start-menu")).toBeVisible();
  });

  test("disappear after clicking play", async ({ page }) => {
    await page.getByTestId("start-menu-button").click();

    await expect(page.getByTestId("start-menu")).toBeHidden();
  });
});

test.describe("Pause menu should", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(serverUrl);
  });

  test("appear when clicking the logo", async ({ page }) => {
    await page.getByTestId("start-menu-button").click();
    await page.getByTestId("logo-button").click(); // The button does pause the game when being clicked

    await expect(page.getByTestId("pause-menu")).toBeVisible();
  });
});
