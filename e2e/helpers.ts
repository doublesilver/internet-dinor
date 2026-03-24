import type { Locator, Page } from "@playwright/test";

export async function mockJsonResponse(
  page: Page,
  pathname: string,
  body: Record<string, unknown> = { success: true },
  status = 200,
) {
  await page.route(`**${pathname}`, async (route) => {
    await route.fulfill({
      status,
      contentType: "application/json; charset=utf-8",
      body: JSON.stringify(body),
    });
  });
}

export async function waitForHydration(page: Page) {
  await page.waitForSelector("form[data-hydrated]", { timeout: 15000 });
}

export async function fillBasicContactFields(
  form: Locator,
  regionLabel?: string,
) {
  await form.getByPlaceholder("홍길동").fill("홍길동");
  await form.getByPlaceholder("010-1234-5678").fill("010-1234-5678");

  if (regionLabel) {
    await form.getByPlaceholder("예: 서울 강동구").fill(regionLabel);
  }
}
