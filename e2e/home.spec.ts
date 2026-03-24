import { expect, test } from "@playwright/test";
import {
  fillBasicContactFields,
  mockJsonResponse,
  waitForHydration,
} from "./helpers";

test("home quick inquiry redirects to complete page", async ({ page }) => {
  await mockJsonResponse(page, "/api/inquiries/quick");

  await page.goto("/");
  await waitForHydration(page);

  await expect(
    page.getByRole("heading", { name: "빠른 견적 문의" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "꿀TIP 모아보기" }),
  ).toBeVisible();

  const form = page.locator("#quick-form-home");
  await fillBasicContactFields(form);
  await form.locator('input[type="checkbox"]').check();
  await form.getByRole("button").click();

  await expect(page).toHaveURL(/\/inquiry\/complete$/);
  await expect(
    page.getByRole("heading", { name: "문의가 접수되었습니다" }),
  ).toBeVisible();
});
