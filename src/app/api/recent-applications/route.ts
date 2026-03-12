import { NextResponse } from "next/server";
import { buildPublicRecentApplications } from "@/data/fixtures/recent-applications";

export async function GET() {
  return NextResponse.json(buildPublicRecentApplications());
}
