import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const SITE_NAME = "인터넷공룡";
const SITE_DESCRIPTION = "인터넷/TV/통신 비교 상담 서비스 인터넷공룡";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://internetdinor.vercel.app"),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  keywords: "인터넷가입, 인터넷비교사이트, 인터넷가입현금지원, 인터넷티비현금많이주는곳, KT인터넷가입, SK인터넷, LG인터넷, 인터넷설치, 당일설치, 사은품",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "ko_KR",
    images: [{ url: "/og-image.png" }]
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"]
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <meta name="naver-site-verification" content="ec6e750e2c69ac6047776c6467df964e04287fe7" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Jua&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
