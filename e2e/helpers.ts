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
  // React hydration 완료를 기다립니다.
  // React 18은 DOM 노드에 __reactFiber$ 키를 통해 fiber를 붙입니다 (non-enumerable 포함).
  // form 요소에 React fiber가 연결되면 hydration이 완료된 것입니다.
  await page.waitForFunction(() => {
    const form = document.querySelector("form");
    if (!form) return false;
    return Object.getOwnPropertyNames(form).some((key) =>
      key.startsWith("__reactFiber$"),
    );
  });
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
