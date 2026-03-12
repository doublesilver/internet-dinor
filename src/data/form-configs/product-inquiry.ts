export const productInquiryFieldConfig = [
  {
    key: "signup_type",
    label: "가입 유형",
    type: "select",
    required: true,
    options: [
      { value: "new", label: "신규 가입" },
      { value: "carrier_change", label: "통신사 변경" },
      { value: "renewal", label: "재약정 문의" }
    ]
  },
  {
    key: "desired_bundle",
    label: "희망 구성",
    type: "select",
    required: true,
    options: [
      { value: "internet_only", label: "인터넷 단독" },
      { value: "internet_tv", label: "인터넷 + TV" }
    ]
  },
  {
    key: "desired_speed",
    label: "희망 인터넷 속도",
    type: "select",
    required: false,
    options: [
      { value: "100M", label: "100M" },
      { value: "500M", label: "500M" },
      { value: "1G", label: "1G" }
    ]
  },
  {
    key: "tv_required",
    label: "TV 필요 여부",
    type: "select",
    required: false,
    options: [
      { value: "yes", label: "필요함" },
      { value: "no", label: "필요없음" }
    ]
  },
  {
    key: "mobile_bundle_interest",
    label: "휴대폰 결합 여부",
    type: "select",
    required: false,
    options: [
      { value: "interested", label: "관심 있음" },
      { value: "not_interested", label: "관심 없음" },
      { value: "unknown", label: "모르겠음" }
    ]
  }
] as const;
