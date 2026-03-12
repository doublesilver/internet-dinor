import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  fullWidth?: boolean;
}

const variantClassName: Record<Variant, string> = {
  primary: "bg-brand-orange text-white hover:bg-brand-orange-dark",
  secondary: "border border-brand-orange bg-white text-brand-orange hover:bg-orange-50",
  ghost: "bg-brand-lavender-soft text-brand-graphite hover:bg-brand-lavender"
};

function getClassName(variant: Variant, fullWidth?: boolean) {
  return [
    "inline-flex items-center justify-center rounded-2xl px-6 py-3.5 text-sm font-bold transition-colors",
    variantClassName[variant],
    fullWidth ? "w-full" : ""
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button({ children, href, variant = "primary", fullWidth, className, ...props }: ButtonProps) {
  const mergedClassName = [getClassName(variant, fullWidth), className].filter(Boolean).join(" ");

  if (href) {
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={mergedClassName}>
          {children}
        </Link>
      );
    }

    return (
      <a href={href} className={mergedClassName}>
        {children}
      </a>
    );
  }

  return (
    <button className={mergedClassName} {...props}>
      {children}
    </button>
  );
}
