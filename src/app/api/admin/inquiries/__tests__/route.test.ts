import { beforeEach, describe, expect, it, vi } from "vitest";

const updateInquiryMock = vi.fn();

vi.mock("@/lib/repositories/inquiries", () => ({
  updateInquiry: updateInquiryMock
}));

function createJsonRequest(body: unknown) {
  return new Request("http://localhost/api/admin/inquiries/test-id", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

function createInvalidJsonRequest() {
  return new Request("http://localhost/api/admin/inquiries/test-id", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: "{"
  });
}

describe("admin inquiry route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("rejects invalid inquiry ids before parsing the request body", async () => {
    const { PATCH } = await import("../[id]/route");

    const response = await PATCH(createJsonRequest({ status: "consulted" }), {
      params: Promise.resolve({ id: "invalid-id" })
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: "잘못된 ID 형식입니다."
    });
    expect(updateInquiryMock).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON payloads", async () => {
    const { PATCH } = await import("../[id]/route");

    const response = await PATCH(createInvalidJsonRequest(), {
      params: Promise.resolve({ id: "11111111-1111-1111-1111-111111111111" })
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: "잘못된 요청 형식입니다."
    });
    expect(updateInquiryMock).not.toHaveBeenCalled();
  });

  it("requires either status or adminMemo", async () => {
    const { PATCH } = await import("../[id]/route");

    const response = await PATCH(createJsonRequest({}), {
      params: Promise.resolve({ id: "11111111-1111-1111-1111-111111111111" })
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: "상태 또는 메모 중 하나는 필요합니다."
    });
    expect(updateInquiryMock).not.toHaveBeenCalled();
  });

  it("propagates repository failures", async () => {
    updateInquiryMock.mockResolvedValue({
      success: false,
      statusCode: 404,
      message: "문의 정보를 찾을 수 없습니다."
    });
    const { PATCH } = await import("../[id]/route");

    const response = await PATCH(createJsonRequest({ status: "closed" }), {
      params: Promise.resolve({ id: "11111111-1111-1111-1111-111111111111" })
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: "문의 정보를 찾을 수 없습니다."
    });
    expect(updateInquiryMock).toHaveBeenCalledWith("11111111-1111-1111-1111-111111111111", {
      status: "closed"
    });
  });

  it("updates inquiry status and memo", async () => {
    updateInquiryMock.mockResolvedValue({
      success: true,
      data: {
        id: "inq-id",
        status: "consulted",
        adminMemo: "2차 상담 완료"
      }
    });
    const { PATCH } = await import("../[id]/route");

    const response = await PATCH(createJsonRequest({ status: "consulted", adminMemo: "2차 상담 완료" }), {
      params: Promise.resolve({ id: "11111111-1111-1111-1111-111111111111" })
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: {
        id: "inq-id",
        status: "consulted",
        adminMemo: "2차 상담 완료"
      }
    });
    expect(updateInquiryMock).toHaveBeenCalledWith("11111111-1111-1111-1111-111111111111", {
      status: "consulted",
      adminMemo: "2차 상담 완료"
    });
  });
});
