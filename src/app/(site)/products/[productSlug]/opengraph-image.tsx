import { ImageResponse } from "next/og";
import { getProductBySlug } from "@/lib/repositories/content";

export const runtime = "edge";
export const alt = "인터넷공룡 상품";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);
  const name = product?.name ?? "상품";
  const summary = product?.summary ?? "";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#4A86CF",
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
        인터넷공룡
      </div>
      <div
        style={{
          fontSize: 52,
          fontWeight: 900,
          textAlign: "center",
          maxWidth: 900,
          lineHeight: 1.3,
          wordBreak: "keep-all",
        }}
      >
        {name}
      </div>
      {summary && (
        <div
          style={{
            fontSize: 24,
            marginTop: 20,
            opacity: 0.85,
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          {summary}
        </div>
      )}
    </div>,
    { ...size },
  );
}
