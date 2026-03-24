import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Frame-Options",
    // ALLOW-FROM은 비표준이며 대부분 브라우저에서 무시됨. CSP frame-ancestors가 Builder.io를 이미 허용하므로 SAMEORIGIN으로 대체.
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value:
      // unsafe-eval 제거: Builder.io SDK v5는 RSC 기반으로 런타임 eval 불필요. 런타임 오류 발생 시 재추가 필요.
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.builder.io; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdn.builder.io https://fonts.googleapis.com; font-src 'self' https://cdn.jsdelivr.net https://fastly.jsdelivr.net https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co https://cdn.builder.io https://cdn.jsdelivr.net; frame-src https://builder.io https://*.builder.io; frame-ancestors 'self' https://builder.io https://*.builder.io;",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  typedRoutes: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.builder.io" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
