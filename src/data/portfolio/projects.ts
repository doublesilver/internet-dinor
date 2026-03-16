import type {
  PortfolioProfile,
  PortfolioProject,
  PortfolioStat,
  PortfolioWorkflowStep
} from "@/types/portfolio";

export const portfolioProfile: PortfolioProfile = {
  eyebrow: "Selected Work",
  title: "데모와 코드, 그리고 판단 근거를 한 페이지에서 보여주는 포트폴리오 허브",
  description:
    "면접관과 클라이언트가 Git 로그를 끝까지 읽지 않아도 결과물을 빠르게 파악할 수 있게 구성했습니다. 카드마다 데모 여부, 저장소, 맡은 역할, 문제 해결 포인트를 한 번에 확인할 수 있습니다.",
  availability: "프론트엔드 구축, 운영형 풀스택, 관리자 도구 자동화",
  githubProfileUrl: "https://github.com/doublesilver",
  ctaLabel: "GitHub 프로필",
  secondaryCtaLabel: "대표 작업 보기"
};

export const portfolioStats: PortfolioStat[] = [
  {
    label: "집중 분야",
    value: "실서비스 웹, 운영형 백오피스, 내부 자동화"
  },
  {
    label: "작업 기준",
    value: "데모 우선, 역할 명확화, 운영 안정성 확보"
  },
  {
    label: "주요 스택",
    value: "Next.js, React, Supabase, TypeScript, WXT"
  }
];

export const portfolioWorkflow: PortfolioWorkflowStep[] = [
  {
    title: "문제를 먼저 구조화합니다",
    description:
      "화면 구성보다 먼저 사용자 흐름, 운영자가 막히는 지점, 반복 비용이 어디서 발생하는지부터 정리합니다."
  },
  {
    title: "빠르게 보여줄 수 있게 만듭니다",
    description:
      "면접이나 제안 단계에서도 바로 눌러볼 수 있도록 데모, 핵심 화면, 저장소 접근 경로를 명확하게 남깁니다."
  },
  {
    title: "운영 내구성까지 챙깁니다",
    description:
      "폼 검증, 에러 처리, 보안 보강, 관리자 수정 흐름처럼 실제 운영에서 무너질 지점을 먼저 보완합니다."
  }
];

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "internet-dinor",
    title: "Internet Dinor",
    subtitle: "인터넷/TV 가입 비교와 운영 관리를 한곳에 묶은 실서비스",
    category: "Live Service",
    year: "2026",
    status: "운영 중",
    description:
      "랜딩 페이지, 문의 폼, 게시판, 관리자 화면, Supabase seed fallback까지 포함한 운영형 서비스입니다.",
    summary:
      "단순 홍보 페이지가 아니라 실제 문의 수집과 운영 관리를 함께 다루는 구조로 만들었습니다. 최근에는 timing-safe 세션 비교, 입력 검증 강화, safeFetch 도입, 메타데이터 정리 같은 안정성 개선도 반영했습니다.",
    repoUrl: "https://github.com/doublesilver/internet-dinor",
    demoUrl: "https://인터넷공룡.com",
    demoLabel: "실서비스 보기",
    demoHint: "실제 운영 중인 서비스라 상담 흐름과 운영 화면을 기준으로 확인할 수 있습니다.",
    stack: ["Next.js 15", "React 19", "Tailwind CSS", "Supabase", "Vercel"],
    responsibilities: [
      "랜딩, 비교, 신청 흐름 설계와 구현",
      "관리자 상품/게시물/문의 관리 화면 구축",
      "보안 점검 후 세션 비교와 입력 검증 강화",
      "seed fallback과 배포 환경 차이 대응"
    ],
    highlights: [
      "실사용 문의 흐름과 관리자 운영 흐름을 하나의 코드베이스로 정리",
      "네트워크 실패와 환경 변수 누락에 대비한 예외 처리 보강",
      "SEO 메타데이터와 noindex 정책을 페이지 단위로 정리"
    ],
    theme: {
      accent: "#7EB5D6",
      surface: "linear-gradient(135deg, #6AA3C8 0%, #A8D4F0 50%, #E0ECF5 100%)",
      glow: "rgba(126, 181, 214, 0.34)",
      border: "rgba(126, 181, 214, 0.2)"
    }
  },
  {
    slug: "flolink-macro",
    title: "FLOLINK Macro",
    subtitle: "반복적인 관리자 업무를 줄이는 브라우저 확장 자동화 도구",
    category: "Automation Tool",
    year: "2026",
    status: "시연 중심",
    description:
      "반복 클릭과 입력이 많은 관리자 작업을 줄이기 위해 만든 WXT 기반 브라우저 확장 프로그램입니다.",
    summary:
      "일회성 스크립트보다 유지보수 가능한 확장 구조에 초점을 맞췄습니다. 반복 작업을 안정적으로 재현할 수 있도록 모듈화했고, 내부 도구 특성상 공개 데모보다 저장소와 개별 시연이 더 적합한 유형입니다.",
    repoUrl: "https://github.com/doublesilver/flolink_macro",
    demoLabel: "시연 문의",
    demoHint: "내부 운영 자동화 도구라 공개용 데모 대신 저장소 설명과 시연 중심으로 소개합니다.",
    stack: ["WXT", "TypeScript", "Chrome Extension APIs", "Shell Deploy Script"],
    responsibilities: [
      "반복 업무 플로우 분석과 자동화 포인트 선정",
      "브라우저 확장 구조 설계와 TypeScript 기반 구현",
      "빌드와 배포 스크립트 정리",
      "유지보수를 위한 모듈 분리"
    ],
    highlights: [
      "운영자가 자주 반복하는 액션을 브라우저 확장으로 묶어 자동화",
      "스크립트 조각이 아니라 배포 가능한 제품 형태로 관리",
      "내부 도구 특성에 맞춰 공개 범위와 시연 방식을 분리"
    ],
    theme: {
      accent: "#0d9488",
      surface: "linear-gradient(135deg, #062f32 0%, #0f766e 50%, #90f1d8 100%)",
      glow: "rgba(13, 148, 136, 0.28)",
      border: "rgba(13, 148, 136, 0.2)"
    }
  }
];
