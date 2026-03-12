import type { ReactNode } from "react";
import type { SiteSettings } from "@/types/domain";
import { FixedBottomBar } from "@/components/layout/FixedBottomBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSiteSettings } from "@/lib/repositories/content";

type SiteShellChildren = ReactNode | ((settings: SiteSettings) => ReactNode);

function isRenderChild(children: SiteShellChildren): children is (settings: SiteSettings) => ReactNode {
  return typeof children === "function";
}

export async function SiteShell({ children, settings }: { children: SiteShellChildren; settings?: SiteSettings }) {
  const resolvedSettings = settings ?? (await getSiteSettings());

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <SiteHeader settings={resolvedSettings} />
      <main>{isRenderChild(children) ? children(resolvedSettings) : children}</main>
      <SiteFooter settings={resolvedSettings} />
      <FixedBottomBar settings={resolvedSettings} />
    </div>
  );
}
