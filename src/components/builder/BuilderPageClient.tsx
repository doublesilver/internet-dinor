"use client";

import { Content, type BuilderContent } from "@builder.io/sdk-react";
import { BUILDER_API_KEY } from "@/lib/builder";
import { builderCustomComponents } from "@/components/builder/register-components";

interface BuilderPageClientProps {
  content: BuilderContent | null;
  model: string;
}

export function BuilderPageClient({ content, model }: BuilderPageClientProps) {
  if (!content) return null;

  return (
    <Content
      content={content}
      model={model}
      apiKey={BUILDER_API_KEY}
      customComponents={builderCustomComponents}
    />
  );
}
