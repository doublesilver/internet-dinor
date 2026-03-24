import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/auth/admin";
import {
  updateDesignSettings,
  updateSiteSettings,
} from "@/lib/repositories/content";
import {
  designSettingsSchema,
  settingsEditorSchema,
} from "@/lib/validators/content";

export async function PATCH(request: Request) {
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

  // Design-only update: payload contains only { designSettings: {...} }
  if (
    payload &&
    typeof payload === "object" &&
    "designSettings" in payload &&
    Object.keys(payload).length === 1
  ) {
    const parsed = designSettingsSchema.safeParse(payload.designSettings);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.",
        },
        { status: 400 },
      );
    }

    const result = await updateDesignSettings(parsed.data);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.statusCode ?? 500 },
      );
    }

    revalidatePath("/");

    return NextResponse.json({ success: true, data: result.data });
  }

  // Full settings update
  const parsed = settingsEditorSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.",
      },
      { status: 400 },
    );
  }

  const result = await updateSiteSettings(parsed.data);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: result.message },
      { status: result.statusCode ?? 500 },
    );
  }

  revalidatePath("/", "layout");

  return NextResponse.json({
    success: true,
    data: result.data,
  });
}
