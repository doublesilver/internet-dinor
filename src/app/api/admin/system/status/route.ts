import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/admin";
import { getAdminSystemDiagnostics } from "@/lib/system/admin-system";

export async function GET() {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const diagnostics = await getAdminSystemDiagnostics();

  return NextResponse.json({
    success: true,
    data: diagnostics,
  });
}
