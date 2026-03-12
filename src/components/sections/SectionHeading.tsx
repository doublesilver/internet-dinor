import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {eyebrow ? <p className="text-sm font-semibold text-brand-orange">{eyebrow}</p> : null}
        <h2 className="text-2xl font-bold tracking-tight text-brand-graphite md:text-4xl">{title}</h2>
        {description ? <p className="max-w-2xl text-sm leading-6 text-brand-slate md:text-base">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
