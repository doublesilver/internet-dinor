"use client";

import { Content, isPreviewing, type BuilderContent } from "@builder.io/sdk-react";
import { BUILDER_API_KEY, BUILDER_MODEL_SECTION } from "@/lib/builder";
import { builderCustomComponents } from "@/components/builder/register-components";

interface BuilderEditableSectionProps {
  content: BuilderContent | null;
}

/**
 * 기존 페이지에 삽입 가능한 Builder.io 편집 가능 섹션.
 * Builder 대시보드에서 model="section"으로 컨텐츠를 만들면
 * 이 영역에 이미지, 텍스트, 배너 등을 마우스로 배치 가능.
 *
 * content가 없고 미리보기 모드가 아니면 아무것도 렌더링하지 않음.
 */
export function BuilderEditableSection({ content }: BuilderEditableSectionProps) {
  if (!content && !isPreviewing()) return null;

  return (
    <Content
      content={content}
      model={BUILDER_MODEL_SECTION}
      apiKey={BUILDER_API_KEY}
      customComponents={builderCustomComponents}
    />
  );
}
