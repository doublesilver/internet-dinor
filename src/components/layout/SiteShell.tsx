import type { ReactNode } from "react";
import type { SiteSettings } from "@/types/domain";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export function SiteShell({ children, settings }: { children: ReactNode; settings: SiteSettings }) {
  return (
    <div className="min-h-screen bg-white pb-24 md:pb-0">
      <SiteHeader settings={settings} />
      <main>{children}</main>
      <SiteFooter settings={settings} />
      <MobileStickyCTA settings={settings} />
    </div>
  );
}
