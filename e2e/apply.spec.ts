import { expect, test } from "@playwright/test";
import { fillBasicContactFields, mockJsonResponse } from "./helpers";

test("apply form submits with required agreements", async ({ page }) => {
  await mockJsonResponse(page, "/api/inquiries/apply");

  await page.goto("/apply");

  await expect(page.getByRole("heading", { name: "가입 신청서" })).toBeVisible();

  const form = page.locator("#apply-form");
  await fillBasicContactFields(form);
  await form.locator('input[name="termsAgreed"]').check();
  await form.locator('input[name="privacyAgreed"]').check();
  await form.getByRole("button", { name: "가입 신청하기" }).click();

  await expect(page).toHaveURL(/\/inquiry\/complete$/);
  await expect(page.getByRole("heading", { name: "문의가 접수되었습니다" })).toBeVisible();
});
