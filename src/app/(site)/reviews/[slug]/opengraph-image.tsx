import { ImageResponse } from "next/og";
import { getReviewBySlug } from "@/lib/repositories/content";

export const runtime = "edge";
export const alt = "인터넷공룡 후기";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const review = await getReviewBySlug(slug);
  const title = review?.title ?? "후기";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2C3E50",
        color: "#fff",
        padding: 60,
      }}
    >
      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "#FF6B35",
          marginBottom: 30,
        }}
      >
        인터넷공룡 후기
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: 900,
          textAlign: "center",
          maxWidth: 900,
          lineHeight: 1.3,
          wordBreak: "keep-all",
        }}
      >
        {title}
      </div>
    </div>,
    { ...size },
  );
}
