import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deletePostOrReview, updatePostOrReview } from "@/lib/repositories/content";
import { postEditorSchema } from "@/lib/validators/content";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!UUID_RE.test(id)) {
    return NextResponse.json({ success: false, message: "잘못된 ID 형식입니다." }, { status: 400 });
  }

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

  revalidatePath("/");
  revalidatePath("/board");

  return NextResponse.json({
    success: true,
    data: result.data
  });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!UUID_RE.test(id)) {
    return NextResponse.json({ success: false, message: "잘못된 ID 형식입니다." }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const entityType = searchParams.get("entityType");

  if (entityType !== "post" && entityType !== "review") {
    return NextResponse.json({ success: false, message: "entityType이 필요합니다." }, { status: 400 });
  }

  const result = await deletePostOrReview(id, entityType);

  if (!result.success) {
    return NextResponse.json({ success: false, message: result.message }, { status: result.statusCode ?? 500 });
  }

  revalidatePath("/");
  revalidatePath("/board");

  return NextResponse.json({ success: true });
}
