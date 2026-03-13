import type { RegisteredComponent } from "@builder.io/sdk-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/sections/SectionHeading";

/**
 * Builder.io에서 사용할 수 있도록 등록된 커스텀 컴포넌트 목록.
 * Builder 비주얼 에디터에서 드래그 앤 드롭으로 배치 가능.
 */
export const builderCustomComponents: RegisteredComponent[] = [
  {
    component: Button,
    name: "Button",
    friendlyName: "버튼",
    inputs: [
      { name: "href", type: "url", friendlyName: "링크 URL" },
      {
        name: "variant",
        type: "enum",
        friendlyName: "스타일",
        enum: ["primary", "secondary", "outline"],
        defaultValue: "primary"
      },
      { name: "fullWidth", type: "boolean", friendlyName: "전체 너비", defaultValue: false },
      { name: "children", type: "text", friendlyName: "버튼 텍스트", defaultValue: "버튼" }
    ]
  },
  {
    component: SectionHeading,
    name: "SectionHeading",
    friendlyName: "섹션 제목",
    inputs: [
      { name: "title", type: "text", friendlyName: "제목", required: true },
      { name: "subtitle", type: "text", friendlyName: "부제목" }
    ]
  }
];
