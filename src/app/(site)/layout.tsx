import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { getSiteSettings } from "@/lib/repositories/content";

export default async function PublicSiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();

  return <SiteShell settings={settings}>{children}</SiteShell>;
}
