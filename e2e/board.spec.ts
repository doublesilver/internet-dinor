import { expect, test } from "@playwright/test";

test("guide board opens a detail page from the post list", async ({ page }) => {
  await page.goto("/board/guide");

  await expect(page.getByRole("heading", { name: "꿀TIP 모아보기" })).toBeVisible();

  const detailLink = page.locator("article a[href^='/board/guide/']").first();
  await expect(detailLink).toBeVisible();
  await detailLink.click();

  await expect(page).toHaveURL(/\/board\/guide\/[^/]+$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "목록으로" })).toBeVisible();
  await expect(page.locator('a[href="/apply"]').first()).toBeVisible();
});
