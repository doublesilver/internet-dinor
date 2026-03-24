import { NextResponse } from "next/server";
import { createCustomerReview } from "@/lib/repositories/content";
import { getRateLimitKey, isRateLimited } from "@/lib/utils/rate-limit";
import { customerReviewSchema } from "@/lib/validators/content";

export async function POST(request: Request) {
  const rateLimitKey = getRateLimitKey(request, "review-customer");
  if (await isRateLimited(rateLimitKey, 3, 60 * 1000)) {
    return NextResponse.json(
      {
        success: false,
        message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
      },
      { status: 429 },
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "잘못된 요청 형식입니다." },
      { status: 400 },
    );
  }

  const parsed = customerReviewSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.",
      },
      { status: 400 },
    );
  }

  const result = await createCustomerReview(parsed.data);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: result.message },
      { status: result.statusCode ?? 500 },
    );
  }

  return NextResponse.json({ success: true });
}
