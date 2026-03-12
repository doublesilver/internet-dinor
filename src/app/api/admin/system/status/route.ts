import { NextResponse } from "next/server";
import { getAdminSystemDiagnostics } from "@/lib/system/admin-system";

export async function GET() {
  const diagnostics = await getAdminSystemDiagnostics();

  return NextResponse.json({
    success: true,
    data: diagnostics
  });
}
