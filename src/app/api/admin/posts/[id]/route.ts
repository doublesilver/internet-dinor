import { NextResponse } from "next/server";
import { deletePostOrReview, updatePostOrReview } from "@/lib/repositories/content";
import { postEditorSchema } from "@/lib/validators/content";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

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

  const result = await updatePostOrReview(id, parsed.data);

  if (!result.success) {
    return NextResponse.json({ success: false, message: result.message }, { status: result.statusCode ?? 500 });
  }

  return NextResponse.json({
    success: true,
    data: result.data
  });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const entityType = searchParams.get("entityType");

  if (entityType !== "post" && entityType !== "review") {
    return NextResponse.json({ success: false, message: "entityType이 필요합니다." }, { status: 400 });
  }

  const result = await deletePostOrReview(id, entityType);

  if (!result.success) {
    return NextResponse.json({ success: false, message: result.message }, { status: result.statusCode ?? 500 });
  }

  return NextResponse.json({ success: true });
}
