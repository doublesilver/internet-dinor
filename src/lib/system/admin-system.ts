import { inquiryFixtures } from "@/data/fixtures/inquiries";
import { carriersSeed, postsSeed, productsSeed, reviewsSeed } from "@/data/seeds";
import { getAdminAllowedEmails, getAdminAuthConfig, getAdminAuthMode, isAdminAuthConfigured } from "@/lib/auth/admin";
import { createSupabaseAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/server";
import { hasSupabasePublicEnv } from "@/lib/supabase/public";

export type DiagnosticStatus = "ready" | "warning" | "missing";
type DataSource = "database" | "mock";

interface DiagnosticItem {
  id: string;
  label: string;
  status: DiagnosticStatus;
  value: string;
  description: string;
  action: string;
}

interface DataSummaryItem {
  id: string;
  label: string;
  count: number;
  source: DataSource;
}

interface DatabaseConnectionStatus {
  status: DiagnosticStatus;
  message: string;
}

export interface AdminSystemDiagnostics {
  generatedAt: string;
  authMode: "preview" | "supabase";
  authConfigured: boolean;
  checks: DiagnosticItem[];
  dataSummary: DataSummaryItem[];
  databaseConnection: DatabaseConnectionStatus;
  recommendations: string[];
}

function getMockDataSummary(): DataSummaryItem[] {
  return [
    { id: "carriers", label: "통신사", count: carriersSeed.length, source: "mock" },
    { id: "products", label: "상품", count: productsSeed.length, source: "mock" },
    { id: "posts", label: "게시물", count: postsSeed.length, source: "mock" },
    { id: "reviews", label: "후기", count: reviewsSeed.length, source: "mock" },
    { id: "inquiries", label: "문의", count: inquiryFixtures.length, source: "mock" }
  ];
}

async function getDatabaseHealth() {
  if (!hasSupabaseAdminEnv()) {
    return {
      databaseConnection: {
        status: "missing" as const,
        message: "Supabase service role 환경변수가 없어 mock 데이터 기준으로 동작합니다."
      },
      dataSummary: getMockDataSummary()
    };
  }

  try {
    const supabase = createSupabaseAdminClient();
    const tables = [
      { id: "carriers", label: "통신사", table: "carriers", fallback: carriersSeed.length },
      { id: "products", label: "상품", table: "products", fallback: productsSeed.length },
      { id: "posts", label: "게시물", table: "posts", fallback: postsSeed.length },
      { id: "reviews", label: "후기", table: "reviews", fallback: reviewsSeed.length },
      { id: "inquiries", label: "문의", table: "inquiries", fallback: inquiryFixtures.length }
    ] as const;

    const results = await Promise.allSettled(
      tables.map(async (item) => {
        const { count, error } = await supabase.from(item.table).select("id", { count: "exact", head: true });

        if (error) {
          throw new Error(error.message);
        }

        return {
          id: item.id,
          label: item.label,
          count: count ?? 0,
          source: "database" as const
        };
      })
    );

    const failedResult = results.find((item) => item.status === "rejected");
    const dataSummary = results.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      }

      return {
        id: tables[index].id,
        label: tables[index].label,
        count: tables[index].fallback,
        source: "mock" as const
      };
    });

    if (failedResult?.status === "rejected") {
      return {
        databaseConnection: {
          status: "warning" as const,
          message: `DB 연결은 감지됐지만 일부 테이블을 읽지 못했습니다. ${failedResult.reason instanceof Error ? failedResult.reason.message : "스키마를 확인해주세요."}`
        },
        dataSummary
      };
    }

    return {
      databaseConnection: {
        status: "ready" as const,
        message: "Supabase DB 연결 및 주요 테이블 조회가 정상입니다."
      },
      dataSummary
    };
  } catch (error) {
    return {
      databaseConnection: {
        status: "warning" as const,
        message: `Supabase 연결 시도가 실패했습니다. ${error instanceof Error ? error.message : "환경설정을 확인해주세요."}`
      },
      dataSummary: getMockDataSummary()
    };
  }
}

function buildRecommendations(input: {
  authMode: "preview" | "supabase";
  authConfigured: boolean;
  hasSiteUrl: boolean;
  hasPublicEnv: boolean;
  hasAdminEnv: boolean;
  previewConfigured: boolean;
  allowedEmailsCount: number;
  databaseConnection: DatabaseConnectionStatus;
}) {
  const items: string[] = [];

  if (!input.hasSiteUrl) {
    items.push("`NEXT_PUBLIC_SITE_URL`을 실제 도메인으로 설정하세요.");
  }

  if (input.authMode === "supabase" && input.allowedEmailsCount === 0) {
    items.push("`ADMIN_ALLOWED_EMAILS`에 관리자 이메일을 등록하세요.");
  }

  if (input.authMode === "preview" && !input.previewConfigured) {
    items.push("프리뷰 로그인 사용 시 `ADMIN_PREVIEW_EMAIL`, `ADMIN_PREVIEW_PASSWORD`, `ADMIN_SESSION_SECRET`을 모두 설정하세요.");
  }

  if (!input.hasPublicEnv) {
    items.push("실운영 전환 전 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 입력해 관리자 인증을 Supabase Auth로 전환하세요.");
  }

  if (!input.hasAdminEnv) {
    items.push("실데이터 저장/조회 전환을 위해 `SUPABASE_SERVICE_ROLE_KEY`를 설정하세요.");
  }

  if (input.databaseConnection.status === "warning") {
    items.push("Supabase 프로젝트 스키마 적용 여부와 테이블 권한, `.env.local` 값을 다시 확인하세요.");
  }

  if (items.length === 0 && input.authConfigured) {
    items.push("현재 기준으로 운영 전환 준비 상태가 양호합니다. 실제 관리자 계정과 시드 데이터만 최종 점검하면 됩니다.");
  }

  return items;
}

export async function getAdminSystemDiagnostics(): Promise<AdminSystemDiagnostics> {
  const authMode = getAdminAuthMode();
  const authConfigured = isAdminAuthConfigured();
  const hasPublicEnv = hasSupabasePublicEnv();
  const hasAdminEnv = hasSupabaseAdminEnv();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const previewConfig = getAdminAuthConfig();
  const previewConfigured = Boolean(previewConfig.email && previewConfig.password && previewConfig.sessionSecret);
  const allowedEmails = getAdminAllowedEmails();
  const { databaseConnection, dataSummary } = await getDatabaseHealth();

  const checks: DiagnosticItem[] = [
    {
      id: "auth-mode",
      label: "관리자 인증 모드",
      status: authConfigured ? "ready" : "warning",
      value: authMode === "supabase" ? "Supabase Auth" : "Preview Login",
      description: authMode === "supabase" ? "실운영 전환 권장 모드입니다." : "선수금 수령용 데모와 임시 운영에 적합합니다.",
      action: authMode === "supabase" ? "허용 이메일 계정으로 로그인 테스트를 진행하세요." : "실운영 전환 전에는 Supabase Auth로 바꾸는 편이 안전합니다."
    },
    {
      id: "site-url",
      label: "사이트 URL",
      status: siteUrl ? "ready" : "missing",
      value: siteUrl ?? "미설정",
      description: "완료 페이지, 링크 공유, 운영 점검 기준 URL입니다.",
      action: "`.env.local`에 `NEXT_PUBLIC_SITE_URL`을 실제 접속 주소로 입력하세요."
    },
    {
      id: "supabase-public",
      label: "Supabase Public Env",
      status: hasPublicEnv ? "ready" : "missing",
      value: hasPublicEnv ? "설정됨" : "미설정",
      description: "관리자 Supabase Auth 로그인에 필요합니다.",
      action: "`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 입력하세요."
    },
    {
      id: "supabase-admin",
      label: "Supabase Service Role",
      status: hasAdminEnv ? "ready" : "missing",
      value: hasAdminEnv ? "설정됨" : "미설정",
      description: "문의 저장, 콘텐츠 관리, 실데이터 전환에 필요합니다.",
      action: "`SUPABASE_SERVICE_ROLE_KEY`를 입력하고 스키마를 적용하세요."
    },
    {
      id: "allowed-emails",
      label: "허용 관리자 이메일",
      status: authMode === "supabase" ? (allowedEmails.length > 0 ? "ready" : "missing") : previewConfigured ? "ready" : "warning",
      value: authMode === "supabase" ? `${allowedEmails.length}개 등록` : previewConfigured ? "프리뷰 계정 설정됨" : "프리뷰 계정 미설정",
      description: authMode === "supabase" ? "allowlist에 포함된 이메일만 관리자 접근이 가능합니다." : "현재는 환경변수 기반 프리뷰 계정으로 로그인합니다.",
      action: authMode === "supabase" ? "`ADMIN_ALLOWED_EMAILS`를 실제 관리자 메일 기준으로 입력하세요." : "데모용 계정 정보는 외부 공유 전에 반드시 변경하세요."
    },
    {
      id: "database-connection",
      label: "DB 연결 상태",
      status: databaseConnection.status,
      value: databaseConnection.status === "ready" ? "정상" : databaseConnection.status === "warning" ? "주의" : "미연결",
      description: databaseConnection.message,
      action: "문제가 있으면 `db/supabase-schema.sql` 적용 여부와 프로젝트 키를 다시 확인하세요."
    }
  ];

  return {
    generatedAt: new Date().toISOString(),
    authMode,
    authConfigured,
    checks,
    dataSummary,
    databaseConnection,
    recommendations: buildRecommendations({
      authMode,
      authConfigured,
      hasSiteUrl: Boolean(siteUrl),
      hasPublicEnv,
      hasAdminEnv,
      previewConfigured,
      allowedEmailsCount: allowedEmails.length,
      databaseConnection
    })
  };
}
