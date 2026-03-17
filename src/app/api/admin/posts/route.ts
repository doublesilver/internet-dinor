import { NextResponse } from "next/server";
import { createPostOrReview, getPostByTypeAndSlug, getReviewBySlug } from "@/lib/repositories/content";
import { postEditorSchema } from "@/lib/validators/content";

export async function POST(request: Request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const parsed = postEditorSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." },
      { status: 400 }
    );
  }

  if (parsed.data.entityType === "review") {
    const existing = await getReviewBySlug(parsed.data.slug);
    if (existing) {
      return NextResponse.json({ success: false, message: "이미 사용 중인 슬러그입니다." }, { status: 409 });
    }
  } else {
    const type = parsed.data.type ?? "guide";
    const existing = await getPostByTypeAndSlug(type, parsed.data.slug);
    if (existing) {
      return NextResponse.json({ success: false, message: "이미 사용 중인 슬러그입니다." }, { status: 409 });
    }
  }

  const result = await createPostOrReview(parsed.data);

  if (!result.success) {
    return NextResponse.json({ success: false, message: result.message }, { status: result.statusCode ?? 500 });
  }

  return NextResponse.json({
    success: true,
    data: result.data
  });
}
