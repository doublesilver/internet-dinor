import type { PostType } from "@/types/domain";

export type BoardCategory = PostType;
export type BoardFeaturedVariant = "none" | "highlight" | "ranked";

export interface BoardCategoryConfig {
  category: BoardCategory;
  type: PostType;
  metadataTitle: string;
  metadataDescription: string;
  eyebrow: string;
  title: string;
  description: string;
  badgeLabel: string;
  featuredVariant: BoardFeaturedVariant;
  emptyMessage: string;
  detailCtaLabel: string;
  showRelatedProducts: boolean;
}

export const BOARD_CATEGORY_CONFIGS: Record<BoardCategory, BoardCategoryConfig> = {
  event: {
    category: "event",
    type: "event",
    metadataTitle: "이벤트",
    metadataDescription: "인터넷공룡의 최신 이벤트와 프로모션 소식을 확인하세요.",
    eyebrow: "Event",
    title: "이벤트 & 프로모션",
    description: "인터넷공룡의 최신 이벤트와 프로모션 소식을 확인하세요.",
    badgeLabel: "이벤트",
    featuredVariant: "highlight",
    emptyMessage: "진행 중인 이벤트가 없습니다.",
    detailCtaLabel: "지금 신청하기",
    showRelatedProducts: false
  },
  guide: {
    category: "guide",
    type: "guide",
    metadataTitle: "가이드",
    metadataDescription: "인터넷/TV 가입 전 알아두면 좋은 꿀팁 가이드 모음입니다.",
    eyebrow: "Guide",
    title: "꿀TIP 모아보기",
    description: "인터넷/TV 가입 전 알아두면 좋은 꿀팁을 모아두었습니다.",
    badgeLabel: "가이드",
    featuredVariant: "ranked",
    emptyMessage: "등록된 가이드가 없습니다.",
    detailCtaLabel: "지금 신청하기",
    showRelatedProducts: true
  },
  notice: {
    category: "notice",
    type: "notice",
    metadataTitle: "공지사항",
    metadataDescription: "인터넷공룡의 공지사항과 업데이트 소식입니다.",
    eyebrow: "Notice",
    title: "공지사항",
    description: "인터넷공룡 공지사항과 운영 업데이트를 확인하세요.",
    badgeLabel: "공지",
    featuredVariant: "none",
    emptyMessage: "등록된 공지사항이 없습니다.",
    detailCtaLabel: "문의하기",
    showRelatedProducts: false
  }
};

export function getBoardCategoryConfig(category: string): BoardCategoryConfig | null {
  return BOARD_CATEGORY_CONFIGS[category as BoardCategory] ?? null;
}

export function getBoardCategories(): BoardCategory[] {
  return Object.keys(BOARD_CATEGORY_CONFIGS) as BoardCategory[];
}
