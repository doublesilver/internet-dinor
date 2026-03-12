export const BUNDLE_TYPE_LABELS: Record<string, string> = {
  internet_only: "인터넷 단독",
  internet_tv: "인터넷 + TV",
  business: "기업용",
  custom: "맞춤형"
};

export function getBundleTypeLabel(type: string): string {
  return BUNDLE_TYPE_LABELS[type] ?? type;
}
