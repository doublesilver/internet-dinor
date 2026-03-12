"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const result = (await response.json()) as { success: boolean; message?: string };
      if (!response.ok || !result.success) {
        setMessage(result.message ?? "로그인에 실패했습니다.");
        return;
      }

      window.location.href = "/admin";
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <input className="field-base" placeholder="이메일" value={email} onChange={(event) => setEmail(event.target.value)} />
      <input className="field-base" placeholder="비밀번호" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      {message ? <p className="text-sm text-red-600">{message}</p> : null}
      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}
