import { Suspense, type ReactNode } from "react";
import type { SiteSettings } from "@/types/domain";
import { CharacterOverlay } from "@/components/CharacterOverlay";
import { CharacterPlacements } from "@/components/CharacterPlacements";
import { FixedBottomBar } from "@/components/layout/FixedBottomBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export function SiteShell({ children, settings }: { children: ReactNode; settings: SiteSettings }) {
  return (
    <div className="relative min-h-screen bg-white pb-16 md:pb-0">
      <CharacterPlacements />
      <Suspense><CharacterOverlay /></Suspense>
      <SiteHeader settings={settings} />
      <main>{children}</main>
      <SiteFooter settings={settings} />
      <FixedBottomBar settings={settings} />
    </div>
  );
}
