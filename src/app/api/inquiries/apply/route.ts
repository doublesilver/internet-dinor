import { NextResponse } from "next/server";
import { createInquiry } from "@/lib/repositories/inquiries";
import { getRateLimitKey, isRateLimited } from "@/lib/utils/rate-limit";
import { applyInquirySchema } from "@/lib/validators/inquiries";

export async function POST(request: Request) {
  const rateLimitKey = getRateLimitKey(request, "inquiry-apply");
  if (isRateLimited(rateLimitKey, 10, 60 * 1000)) {
    return NextResponse.json({ success: false, message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." }, { status: 429 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const parsed = applyInquirySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." },
      { status: 400 }
    );
  }

  const result = await createInquiry({
    inquiryType: "apply",
    name: parsed.data.name,
    phone: parsed.data.phone,
    sourcePage: parsed.data.sourcePage,
    privacyAgreed: parsed.data.privacyAgreed,
    regionLabel: parsed.data.regionLabel,
    contactTimePreference: parsed.data.contactTimePreference,
    payload: {
      ...(parsed.data.payload ?? {}),
      terms_agreed: "true"
    },
    utm: parsed.data.utm
  });

  if (!result.success) {
    return NextResponse.json({ success: false, message: result.message }, { status: result.statusCode ?? 500 });
  }

  return NextResponse.json({
    success: true,
    data: result
  });
}
