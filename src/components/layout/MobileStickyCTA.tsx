import type { SiteSettings } from "@/types/domain";
import { Button } from "@/components/ui/Button";

export function MobileStickyCTA({ settings }: { settings: SiteSettings }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-brand-border bg-white/95 p-3 backdrop-blur md:hidden">
      <div className="flex gap-3">
        <Button href="/apply" fullWidth>
          빠른 상담
        </Button>
        <Button href={settings.phoneLink} variant="secondary" fullWidth>
          전화 상담
        </Button>
      </div>
    </div>
  );
}
