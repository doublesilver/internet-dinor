import { expect, test } from "@playwright/test";
import {
  fillBasicContactFields,
  mockJsonResponse,
  waitForHydration,
} from "./helpers";

test("product inquiry submits with mocked API success", async ({ page }) => {
  await mockJsonResponse(page, "/api/inquiries/product");

  await page.goto("/products/sk-500-btv-all");
  await waitForHydration(page);

  await expect(
    page.getByRole("heading", { name: "기가라이트인터넷 500M + B tv ALL" }),
  ).toBeVisible();

  const form = page.locator("#product-form-sk-500-btv-all");
  await fillBasicContactFields(form, "서울 강동구");
  await form.locator('input[type="checkbox"]').check();
  await form.getByRole("button", { name: "이 상품 문의 접수" }).click();

  await expect(page).toHaveURL(/\/inquiry\/complete$/);
  await expect(
    page.getByRole("heading", { name: "문의가 접수되었습니다" }),
  ).toBeVisible();
});
