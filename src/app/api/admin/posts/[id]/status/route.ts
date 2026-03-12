import { NextResponse } from "next/server";
import { updatePostOrReviewStatus } from "@/lib/repositories/content";
import { postReviewStatusSchema } from "@/lib/validators/content";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const parsed = postReviewStatusSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." },
      { status: 400 }
    );
  }

  const result = await updatePostOrReviewStatus(id, parsed.data.entityType, parsed.data.status);

  if (!result.success) {
    return NextResponse.json({ success: false, message: result.message }, { status: result.statusCode ?? 500 });
  }

  return NextResponse.json({
    success: true,
    data: result.data
  });
}
