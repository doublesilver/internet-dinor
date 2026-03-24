"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerReviewSchema } from "@/lib/validators/content";
import type { CustomerReviewValues } from "@/lib/validators/content";

const reviewTypeOptions = [
  { value: "internet_only", label: "인터넷 단독" },
  { value: "internet_tv", label: "인터넷+TV" },
  { value: "moving", label: "이사" },
  { value: "bundle", label: "결합" },
  { value: "renewal", label: "재약정" },
];

export default function WriteReviewPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerReviewValues>({
    resolver: zodResolver(customerReviewSchema),
    defaultValues: {
      authorName: "",
      reviewType: "internet_tv",
      title: "",
      body: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    setMessage(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const result = (await response.json()) as {
          success: boolean;
          message?: string;
        };
        if (!response.ok || !result.success) {
          setMessage(result.message ?? "후기 등록에 실패했습니다.");
          return;
        }

        router.push("/reviews/write/complete");
      } catch {
        setMessage("후기 등록 중 오류가 발생했습니다.");
      }
    });
  });

  return (
    <section className="section-space">
      <div className="container-page max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-brand-orange">
            Write Review
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-brand-graphite">
            후기 작성하기
          </h1>
          <p className="mt-3 text-base text-brand-slate">
            인터넷공룡을 통해 가입하신 경험을 공유해주세요. 관리자 확인 후
            게시됩니다.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="surface-card space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="review-author" className="field-label">
                  이름 *
                </label>
                <input
                  id="review-author"
                  className="field-base"
                  placeholder="홍길동"
                  {...register("authorName")}
                />
                {errors.authorName ? (
                  <p className="field-error">{errors.authorName.message}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="review-type" className="field-label">
                  가입 유형 *
                </label>
                <select
                  id="review-type"
                  className="field-base"
                  {...register("reviewType")}
                >
                  {reviewTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.reviewType ? (
                  <p className="field-error">{errors.reviewType.message}</p>
                ) : null}
              </div>
            </div>

            <div>
              <label htmlFor="review-title" className="field-label">
                제목 *
              </label>
              <input
                id="review-title"
                className="field-base"
                placeholder="후기 제목을 입력해주세요"
                {...register("title")}
              />
              {errors.title ? (
                <p className="field-error">{errors.title.message}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="review-body" className="field-label">
                후기 내용 *
              </label>
              <textarea
                id="review-body"
                className="field-base min-h-40"
                placeholder="가입 경험을 자유롭게 작성해주세요 (10자 이상)"
                {...register("body")}
              />
              {errors.body ? (
                <p className="field-error">{errors.body.message}</p>
              ) : null}
            </div>
          </div>

          {message ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {message}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-2xl bg-brand-orange px-6 py-4 text-base font-bold text-white hover:bg-brand-orange-dark disabled:opacity-50"
            >
              {isPending ? "등록 중..." : "후기 등록하기"}
            </button>
            <Link
              href="/reviews"
              className="flex-1 rounded-2xl border border-brand-orange px-6 py-4 text-center text-base font-bold text-brand-orange hover:bg-blue-50"
            >
              목록으로
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
