import type { InquiryStatus } from "@/types/domain";

export type InquiryEditorMessage = { type: "success" | "error"; text: string };

interface SaveInquiryUpdateInput {
  id: string;
  status: InquiryStatus;
  adminMemo: string;
}

interface SaveInquiryUpdateOptions {
  fetchImpl?: typeof fetch;
}

export async function saveInquiryUpdate(
  input: SaveInquiryUpdateInput,
  options: SaveInquiryUpdateOptions = {}
): Promise<InquiryEditorMessage> {
  const fetchImpl = options.fetchImpl ?? fetch;

  try {
    const response = await fetchImpl(`/api/admin/inquiries/${input.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: input.status,
        adminMemo: input.adminMemo
      })
    });

    let result: { success?: boolean; message?: string } | null = null;
    try {
      result = (await response.json()) as { success?: boolean; message?: string };
    } catch {
      result = null;
    }

    if (!response.ok || !result?.success) {
      return { type: "error", text: result?.message ?? "저장에 실패했습니다." };
    }

    return { type: "success", text: "저장되었습니다." };
  } catch {
    return { type: "error", text: "저장 중 오류가 발생했습니다." };
  }
}
