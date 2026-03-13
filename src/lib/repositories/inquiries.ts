import { inquiryFixtures } from "@/data/fixtures/inquiries";
import { productsSeed } from "@/data/seeds";
import { mapInquiryRow, mapProductRow } from "@/lib/repositories/mappers";
import { createSupabaseAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/server";
import { formatPhone } from "@/lib/utils/phone";
import type { InquiryCreateInput, InquiryRecord, InquiryStatus } from "@/types/domain";
import type { UpdateInquiryValues } from "@/lib/validators/admin";

function createReadError(entity: string, message: string) {
  return new Error(`[inquiries] ${entity} 조회에 실패했습니다. ${message}`);
}

export async function createInquiry(input: InquiryCreateInput) {
  const phone = formatPhone(input.phone);
  if (!hasSupabaseAdminEnv()) {
    return {
      success: false,
      mode: "unavailable" as const,
      statusCode: 503,
      message: "문의 저장 환경이 설정되지 않았습니다."
    };
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("inquiries")
    .insert({
      inquiry_type: input.inquiryType,
      name: input.name,
      phone,
      product_id: input.productId ?? null,
      carrier_slug: input.carrierSlug ?? null,
      source_page: input.sourcePage,
      status: "new",
      privacy_agreed: input.privacyAgreed,
      region_label: input.regionLabel ?? null,
      contact_time_preference: input.contactTimePreference ?? null,
      payload_json: input.payload ?? {},
      utm_json: input.utm ?? {}
    })
    .select("id, created_at")
    .single();

  if (error) {
    return {
      success: false,
      mode: "database" as const,
      statusCode: 500,
      message: "문의 저장 중 오류가 발생했습니다."
    };
  }

  return {
    success: true,
    mode: "database" as const,
    inquiryId: data.id,
    createdAt: data.created_at
  };
}

export async function getInquiryFixtures() {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });

    if (error) {
      throw createReadError("문의 목록", error.message);
    }

    if (data) {
      return data.map(mapInquiryRow);
    }
  }

  return inquiryFixtures.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getInquiryById(id: string) {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("inquiries").select("*").eq("id", id).maybeSingle();

    if (error) {
      throw createReadError("문의 상세", error.message);
    }

    if (data) {
      return mapInquiryRow(data);
    }

    return null;
  }

  return inquiryFixtures.find((item) => item.id === id) ?? null;
}

export async function getInquiryDashboardSummary() {
  const items = await getInquiryFixtures();
  const formatter = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" });
  const todayDate = formatter.format(new Date());
  const statusCount = items.reduce<Record<InquiryStatus, number>>(
    (acc, item) => {
      acc[item.status] += 1;
      return acc;
    },
    {
      new: 0,
      pending: 0,
      contacted: 0,
      retry: 0,
      consulted: 0,
      in_progress: 0,
      closed: 0
    }
  );

  return {
    total: items.length,
    today: items.filter((item) => {
      const d = new Date(item.createdAt);
      return formatter.format(d) === todayDate;
    }).length,
    statusCount
  };
}

export async function updateInquiry(id: string, input: UpdateInquiryValues) {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const updatePayload: Record<string, string> = {};

    if (input.status !== undefined) {
      updatePayload.status = input.status;
    }

    if (input.adminMemo !== undefined) {
      updatePayload.admin_memo = input.adminMemo;
    }

    const { data, error } = await supabase
      .from("inquiries")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      return {
        success: false,
        statusCode: 500,
        message: "문의 수정 중 오류가 발생했습니다."
      };
    }

    if (!data) {
      return {
        success: false,
        statusCode: 404,
        message: "문의 정보를 찾을 수 없습니다."
      };
    }

    return {
      success: true,
      data: mapInquiryRow(data)
    };
  }

  const inquiry = inquiryFixtures.find((item) => item.id === id);
  if (!inquiry) {
    return {
      success: false,
      statusCode: 404,
      message: "문의 정보를 찾을 수 없습니다."
    };
  }

  if (input.status) {
    inquiry.status = input.status;
  }

  if (input.adminMemo !== undefined) {
    inquiry.adminMemo = input.adminMemo;
  }

  inquiry.updatedAt = new Date().toISOString();

  return {
    success: true,
    data: inquiry
  };
}

export function getInquiryStatusLabel(status: InquiryStatus) {
  const labels: Record<InquiryStatus, string> = {
    new: "신규",
    pending: "연락대기",
    contacted: "연락완료",
    retry: "부재/재시도",
    consulted: "상담완료",
    in_progress: "신청진행",
    closed: "종료/보류"
  };

  return labels[status];
}

export async function findProductById(productId?: string | null) {
  if (!productId) return null;

  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("products").select("*").eq("id", productId).maybeSingle();

    if (error) {
      throw createReadError("연결 상품", error.message);
    }

    if (data) return mapProductRow(data);

    return null;
  }

  return productsSeed.find((product) => product.id === productId) ?? null;
}

export async function findProductBySlug(slug: string) {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();

    if (error) {
      throw createReadError("상품", error.message);
    }

    if (data) return mapProductRow(data);

    return null;
  }

  return productsSeed.find((product) => product.slug === slug) ?? null;
}

export async function getRecentInquiries(limit = 20): Promise<InquiryRecord[]> {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw createReadError("최근 문의", error.message);
    }

    if (data) {
      return data.map(mapInquiryRow);
    }

    return [];
  }

  return inquiryFixtures
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, limit);
}
