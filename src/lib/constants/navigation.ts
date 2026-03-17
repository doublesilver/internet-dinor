import { getBoardNavigationItems } from "@/lib/constants/board";

export const publicNavigation = [
  { href: "/apply", label: "신청서 작성" },
  ...getBoardNavigationItems(),
  { href: "/reviews", label: "후기" }
];

export const carrierNavigation = [
  { href: "/carriers/sk", label: "SK브로드밴드", color: "#FFA13E" },
  { href: "/carriers/kt", label: "KT", color: "#FF5B62" },
  { href: "/carriers/lg", label: "LG유플러스", color: "#FE82B0" },
  { href: "/carriers/skylife", label: "KT스카이라이프", color: "#6DD5C0" },
  { href: "/carriers/hellovision", label: "LG헬로비전", color: "#FFA38B" }
];

export const adminNavigation = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/inquiries", label: "문의 관리" },
  { href: "/admin/products", label: "상품 관리" },
  { href: "/admin/carriers", label: "통신사" },
  { href: "/admin/posts", label: "게시물 관리" },
  { href: "/admin/settings", label: "설정" },
  { href: "/admin/system", label: "운영 진단" }
];
