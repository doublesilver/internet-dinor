import { expect, test } from "@playwright/test";
import { fillBasicContactFields, mockJsonResponse } from "./helpers";

type ApplyRequestBody = {
  sourcePage?: string;
  regionLabel?: string;
  payload?: Record<string, unknown>;
};

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

test("apply form clears dependent fields before submit", async ({ page }) => {
  await page.route("**/api/inquiries/apply", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json; charset=utf-8",
      body: JSON.stringify({ success: true })
    });
  });

  await page.goto("/apply");

  const form = page.locator("#apply-form");

  await form.locator('input[name="payload.desired_carrier"][value="sk"]').check();
  await expect(form.locator('input[name="payload.tv_plan"][value="economy"]')).toBeVisible();
  await form.locator('input[name="payload.tv_plan"][value="economy"]').check();

  await form.locator('input[name="payload.desired_carrier"][value="kt"]').check();
  await expect(form.locator('input[name="payload.tv_plan"][value="basic"]')).toBeVisible();
  await expect(form.locator('input[name="payload.tv_plan"][value="economy"]')).toHaveCount(0);

  await form.locator('input[name="payload.install_date_type"][value="custom"]').check();
  const installDateInput = form.locator('input[name="payload.install_date"]');
  await expect(installDateInput).toBeVisible();
  await installDateInput.fill("2030-01-15");
  await form.locator('input[name="payload.install_date_type"][value="asap"]').check();
  await expect(form.locator('input[name="payload.install_date"]')).toHaveCount(0);

  await fillBasicContactFields(form, "서울 강동구");
  await form.locator('input[name="termsAgreed"]').check();
  await form.locator('input[name="privacyAgreed"]').check();

  const submissionRequestPromise = page.waitForRequest("**/api/inquiries/apply");
  await form.getByRole("button", { name: "가입 신청하기" }).click();
  const submittedBody = (await submissionRequestPromise).postDataJSON() as ApplyRequestBody;

  await expect(page).toHaveURL(/\/inquiry\/complete$/);
  expect(submittedBody).toMatchObject({
    sourcePage: "/apply",
    regionLabel: "서울 강동구",
    payload: {
      desired_carrier: "kt",
      install_date_type: "asap"
    }
  });

  const submittedPayload = submittedBody.payload;
  expect(submittedPayload).toBeTruthy();
  expect(submittedPayload).not.toHaveProperty("tv_plan");
  expect(submittedPayload).not.toHaveProperty("install_date");
});
