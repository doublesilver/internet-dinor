const MAX_INQUIRY_PAYLOAD_VALUE_LENGTH = 200;

export const APPLY_INQUIRY_PAYLOAD_KEYS = [
  "current_carrier",
  "desired_carrier",
  "internet_plan",
  "tv_plan",
  "customer_type",
  "mobile_carrier",
  "payment_method",
  "install_date_type",
  "install_date",
  "source_channel",
  "memo"
] as const;

export const PRODUCT_INQUIRY_PAYLOAD_KEYS = [
  "signup_type",
  "desired_bundle",
  "desired_speed",
  "tv_required",
  "mobile_bundle_interest",
  "memo"
] as const;

function filterTextEntries<T extends readonly string[]>(
  allowedKeys: T,
  entries: Iterable<[string, FormDataEntryValue]>
): Partial<Record<T[number], string>> {
  const allowedKeySet = new Set<string>(allowedKeys);
  const filtered = new Map<string, string>();

  for (const [key, value] of entries) {
    if (!allowedKeySet.has(key) || typeof value !== "string") {
      continue;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      continue;
    }

    filtered.set(key, trimmed.slice(0, MAX_INQUIRY_PAYLOAD_VALUE_LENGTH));
  }

  return Object.fromEntries(filtered) as Partial<Record<T[number], string>>;
}

export function buildApplyInquiryPayload(entries: Iterable<[string, FormDataEntryValue]>) {
  return filterTextEntries(APPLY_INQUIRY_PAYLOAD_KEYS, entries);
}

export function buildProductInquiryPayload(entries: Iterable<[string, FormDataEntryValue]>) {
  return filterTextEntries(PRODUCT_INQUIRY_PAYLOAD_KEYS, entries);
}

export function extractRegionLabel(address: string) {
  const segments = address
    .replace(/[()]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return segments.slice(0, 2).join(" ");
}
