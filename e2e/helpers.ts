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
  // hydration 실패 시 콘솔 에러 캡처
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.waitForLoadState("networkidle");

  // data-hydrated 속성이 설정되는지 확인 (3초 대기)
  try {
    await page.waitForSelector("form[data-hydrated]", { timeout: 5000 });
  } catch {
    // hydration 실패 시 에러 로그 출력 후 계속 진행
    if (errors.length > 0) {
      console.log("Browser errors during hydration:", errors.slice(0, 5));
    }
    // networkidle 후 추가 대기
    await page.waitForTimeout(2000);
  }
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
