import { Suspense, type ReactNode } from "react";
import type { SiteSettings } from "@/types/domain";
import { CharacterOverlay } from "@/components/CharacterOverlay";
import { FixedBottomBar } from "@/components/layout/FixedBottomBar";
import { DesktopBottomBar } from "@/components/layout/DesktopBottomBar";
import { FloatingChatFab } from "@/components/layout/FloatingChatFab";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export function SiteShell({ children, settings }: { children: ReactNode; settings: SiteSettings }) {
  const ds = settings.designSettings;

  const designVars = ds
    ? ({
        "--design-hero-bg": ds.hero_bgColor,
        "--design-hero-title-font-size": ds.hero_titleFontSize,
        "--design-hero-title-color": ds.hero_titleColor,
        "--design-hero-subtitle-font-size": ds.hero_subtitleFontSize,
        "--design-hero-subtitle-color": ds.hero_subtitleColor,

        "--design-carrier-bg": ds.carrierProducts_bgColor,
        "--design-carrier-heading-font-size": ds.carrierProducts_headingFontSize,
        "--design-carrier-heading-color": ds.carrierProducts_headingColor,

        "--design-benefits-bg": ds.benefits_bgColor,
        "--design-benefits-heading-font-size": ds.benefits_headingFontSize,
        "--design-benefits-heading-color": ds.benefits_headingColor,

        "--design-cta-bg": ds.cta_bgColor,
        "--design-cta-heading-font-size": ds.cta_headingFontSize,
        "--design-cta-heading-color": ds.cta_headingColor,

        "--design-recent-heading-font-size": ds.recent_headingFontSize,
        "--design-recent-heading-color": ds.recent_headingColor,

        "--design-tips-bg": ds.tips_bgColor,
        "--design-tips-heading-font-size": ds.tips_headingFontSize,
        "--design-tips-heading-color": ds.tips_headingColor,

        "--design-carrier-nav-font-size": ds.carrierNav_fontSize,
        "--design-carrier-nav-height": ds.carrierNav_height,

        "--design-button-font-size": ds.button_fontSize,
        "--design-button-radius": ds.button_radius,
        "--design-primary": ds.button_primaryColor,
        "--design-primary-dark": ds.button_primaryDarkColor,

        "--design-section-padding": ds.section_padding
      } as React.CSSProperties)
    : undefined;

  return (
    <div className="relative min-h-screen bg-white pb-16 md:pb-0" style={designVars}>
      <Suspense><CharacterOverlay /></Suspense>
      <SiteHeader settings={settings} />
      <main>{children}</main>
      <SiteFooter settings={settings} />
      <DesktopBottomBar />
      <FloatingChatFab settings={settings} />
      <FixedBottomBar settings={settings} />
    </div>
  );
}
