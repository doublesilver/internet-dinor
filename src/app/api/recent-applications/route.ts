import { NextResponse } from "next/server";
import { getRecentInquiries } from "@/lib/repositories/content";

function maskName(name: string): string {
  if (name.length <= 1) return name;
  if (name.length === 2) return name[0] + "*";
  return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
}

const statusMap: Record<string, string> = {
  new: "접수완료",
  pending: "설치예정",
  contacted: "상담완료",
  in_progress: "설치예정",
  consulted: "개통완료",
  closed: "개통완료"
};

const payMap: Record<string, string> = {
  new: "지급예정",
  pending: "지급예정",
  contacted: "지급예정",
  in_progress: "지급예정",
  consulted: "지급완료",
  closed: "지급완료"
};

export async function GET() {
  try {
    const inquiries = await getRecentInquiries(20);

    const rows = inquiries.map((inq) => {
      const date = new Date(inq.createdAt);

      return {
        date: `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`,
        name: maskName(inq.name),
        installStatus: statusMap[inq.status] ?? "접수완료",
        paymentStatus: payMap[inq.status] ?? "지급예정"
      };
    });

    return NextResponse.json(rows);
  } catch (error) {
    console.error("[recent-applications] Failed to fetch inquiries:", error);
    return NextResponse.json([], { status: 200 });
  }
}
