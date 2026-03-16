import { revalidateTag, unstable_cache } from "next/cache";
import { siteSettingsSeed } from "@/data/seeds";
import { mapSiteSettingsRow } from "@/lib/repositories/mappers";
import { createSupabaseAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/server";
import type { SiteSettings } from "@/types/domain";
import type { SettingsEditorValues } from "@/lib/validators/content";

const SITE_SETTINGS_TAG = "site-settings";

const getCachedSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();

    if (error) {
      throw new Error(`[settings:getSiteSettings] ${error.message}`);
    }

    if (!data) {
      throw new Error("[settings:getSiteSettings] site_settings 데이터가 없습니다.");
    }

    return mapSiteSettingsRow(data);
  },
  ["site-settings"],
  { tags: [SITE_SETTINGS_TAG], revalidate: 60 }
);

export async function getSiteSettings(): Promise<SiteSettings> {
  if (hasSupabaseAdminEnv()) {
    return getCachedSiteSettings();
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
      ecommerceNumber: input.ecommerceNumber,
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

    revalidateTag(SITE_SETTINGS_TAG);
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
  siteSettingsSeed.businessInfo.ecommerceNumber = input.ecommerceNumber;
  siteSettingsSeed.businessInfo.address = input.address;
  siteSettingsSeed.businessInfo.email = input.email;

  return { success: true, data: siteSettingsSeed };
}
