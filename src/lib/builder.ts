export const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY ?? "";
export const BUILDER_MODEL_PAGE = "page";
export const BUILDER_MODEL_SECTION = "section";

export function isBuilderEnabled(): boolean {
  return BUILDER_API_KEY.length > 0;
}
