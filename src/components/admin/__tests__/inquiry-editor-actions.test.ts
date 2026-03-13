import { describe, expect, it, vi } from "vitest";
import { saveInquiryUpdate } from "../inquiry-editor-actions";

describe("saveInquiryUpdate", () => {
  it("sends a PATCH request and returns success feedback on a successful save", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true })
    });

    const result = await saveInquiryUpdate(
      {
        id: "inq-demo-001",
        status: "consulted",
        adminMemo: "2차 상담 완료"
      },
      { fetchImpl: fetchMock as unknown as typeof fetch }
    );

    expect(result).toEqual({ type: "success", text: "저장되었습니다." });
    expect(fetchMock).toHaveBeenCalledWith("/api/admin/inquiries/inq-demo-001", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "consulted",
        adminMemo: "2차 상담 완료"
      })
    });
  });

  it("returns the repository error message when the API responds with a failure payload", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ success: false, message: "문의 정보를 찾을 수 없습니다." })
    });

    const result = await saveInquiryUpdate(
      {
        id: "inq-demo-001",
        status: "closed",
        adminMemo: ""
      },
      { fetchImpl: fetchMock as unknown as typeof fetch }
    );

    expect(result).toEqual({ type: "error", text: "문의 정보를 찾을 수 없습니다." });
  });

  it("falls back to a default error message when the response body is missing or invalid", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockRejectedValue(new Error("bad json"))
    });

    const result = await saveInquiryUpdate(
      {
        id: "inq-demo-001",
        status: "pending",
        adminMemo: "연락 예정"
      },
      { fetchImpl: fetchMock as unknown as typeof fetch }
    );

    expect(result).toEqual({ type: "error", text: "저장에 실패했습니다." });
  });

  it("returns a network error message when fetch throws", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network down"));

    const result = await saveInquiryUpdate(
      {
        id: "inq-demo-001",
        status: "retry",
        adminMemo: "재통화 필요"
      },
      { fetchImpl: fetchMock as unknown as typeof fetch }
    );

    expect(result).toEqual({ type: "error", text: "저장 중 오류가 발생했습니다." });
  });
});
