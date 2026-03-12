"use client";

import { useState, useTransition } from "react";
import type { InquiryRecord, InquiryStatus } from "@/types/domain";
import { Button } from "@/components/ui/Button";

const statusOptions: Array<{ value: InquiryStatus; label: string }> = [
  { value: "new", label: "신규" },
  { value: "pending", label: "연락대기" },
  { value: "contacted", label: "연락완료" },
  { value: "retry", label: "부재/재시도" },
  { value: "consulted", label: "상담완료" },
  { value: "in_progress", label: "신청진행" },
  { value: "closed", label: "종료/보류" }
];

export function InquiryEditor({ inquiry }: { inquiry: InquiryRecord }) {
  const [status, setStatus] = useState<InquiryStatus>(inquiry.status);
  const [adminMemo, setAdminMemo] = useState(inquiry.adminMemo ?? "");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    setFeedback(null);

    startTransition(async () => {
      const response = await fetch(`/api/admin/inquiries/${inquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          adminMemo
        })
      });

      const result = (await response.json()) as { success: boolean; message?: string };

      if (!response.ok || !result.success) {
        setFeedback(result.message ?? "저장에 실패했습니다.");
        return;
      }

      setFeedback("저장되었습니다.");
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="field-label">상태</label>
        <select className="field-base" value={status} onChange={(event) => setStatus(event.target.value as InquiryStatus)}>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="field-label">관리자 메모</label>
        <textarea className="field-base min-h-40" value={adminMemo} onChange={(event) => setAdminMemo(event.target.value)} />
      </div>
      {feedback ? <p className={`text-sm ${feedback === "저장되었습니다." ? "text-emerald-600" : "text-red-600"}`}>{feedback}</p> : null}
      <Button type="button" onClick={handleSave} disabled={isPending}>
        {isPending ? "저장 중..." : "저장"}
      </Button>
    </div>
  );
}
