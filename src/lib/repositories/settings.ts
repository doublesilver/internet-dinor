import { siteSettingsSeed } from "@/data/seeds";
import { mapSiteSettingsRow } from "@/lib/repositories/mappers";
import { createSupabaseAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/server";
import type { SiteSettings } from "@/types/domain";
import type { SettingsEditorValues } from "@/lib/validators/content";

export async function getSiteSettings(): Promise<SiteSettings> {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();

    if (!error && data) {
      return mapSiteSettingsRow(data);
    }
  }

  return siteSettingsSeed;
}

export async function updateSiteSettings(input: SettingsEditorValues) {
  const payload = {
    site_name: input.siteName,
    phone_label: input.phoneLabel,
    phone_link: input.phoneLink,
    hero_cta_label: input.heroCtaLabel,
    secondary_cta_label: input.secondaryCtaLabel,
    footer_notice: input.footerNotice,
    business_info_json: {
      owner: input.owner,
      businessNumber: input.businessNumber,
      address: input.address,
      email: input.email
    }
  };

  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data: currentSettings } = await supabase.from("site_settings").select("id").limit(1).maybeSingle();

    if (!currentSettings?.id) {
      return { success: false, statusCode: 404, message: "설정 정보를 찾을 수 없습니다." };
    }

    const { data, error } = await supabase.from("site_settings").update(payload).eq("id", currentSettings.id).select("*").maybeSingle();

    if (error) {
      return { success: false, statusCode: 500, message: "설정 저장 중 오류가 발생했습니다." };
    }

    if (!data) {
      return { success: false, statusCode: 404, message: "설정 정보를 찾을 수 없습니다." };
    }

    return { success: true, data: mapSiteSettingsRow(data) };
  }

  siteSettingsSeed.siteName = input.siteName;
  siteSettingsSeed.phoneLabel = input.phoneLabel;
  siteSettingsSeed.phoneLink = input.phoneLink;
  siteSettingsSeed.heroCtaLabel = input.heroCtaLabel;
  siteSettingsSeed.secondaryCtaLabel = input.secondaryCtaLabel;
  siteSettingsSeed.footerNotice = input.footerNotice;
  siteSettingsSeed.businessInfo.owner = input.owner;
  siteSettingsSeed.businessInfo.businessNumber = input.businessNumber;
  siteSettingsSeed.businessInfo.address = input.address;
  siteSettingsSeed.businessInfo.email = input.email;

  return { success: true, data: siteSettingsSeed };
}
