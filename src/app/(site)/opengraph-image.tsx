import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "인터넷공룡 - 인터넷/TV 가입 비교 최대 사은품";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 900,
          color: "#FF6B35",
          marginBottom: 20,
        }}
      >
        인터넷공룡
      </div>
      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          textAlign: "center",
          maxWidth: 800,
          lineHeight: 1.4,
        }}
      >
        인터넷/TV 가입 비교
      </div>
      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          textAlign: "center",
          maxWidth: 800,
          lineHeight: 1.4,
        }}
      >
        전국 최대 사은품 지급
      </div>
      <div
        style={{
          fontSize: 24,
          marginTop: 30,
          opacity: 0.85,
        }}
      >
        당일설치 · 당일입금 · 무료 상담
      </div>
    </div>,
    { ...size },
  );
}
