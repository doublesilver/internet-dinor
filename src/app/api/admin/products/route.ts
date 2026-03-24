import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/auth/admin";
import { createProduct, getProductBySlug } from "@/lib/repositories/content";
import { productEditorSchema } from "@/lib/validators/content";

export async function POST(request: Request) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "잘못된 요청 형식입니다." },
      { status: 400 },
    );
  }

  const parsed = productEditorSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.",
      },
      { status: 400 },
    );
  }

  const existing = await getProductBySlug(parsed.data.slug);
  if (existing) {
    return NextResponse.json(
      { success: false, message: "이미 사용 중인 슬러그입니다." },
      { status: 409 },
    );
  }

  const result = await createProduct(parsed.data);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: result.message },
      { status: result.statusCode ?? 500 },
    );
  }

  revalidatePath("/");
  revalidatePath("/compare");

  return NextResponse.json({
    success: true,
    data: result.data,
  });
}
