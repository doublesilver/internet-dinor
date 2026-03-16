export interface InternetOption {
  label: string;
  speed: string;
  price: number;
}

export interface TvOption {
  label: string;
  price: number;
}

export interface MobileOption {
  label: string;
  discount: number;
}

export interface CarrierPriceData {
  internetOptions: InternetOption[];
  tvOptions: TvOption[];
  mobileOptions: MobileOption[];
}

export const CARRIER_PRICE_DATA: Record<string, CarrierPriceData> = {
  sk: {
    internetOptions: [
      { label: "100M", speed: "100M", price: 22000 },
      { label: "500M", speed: "500M", price: 27500 },
      { label: "1G", speed: "1G", price: 33000 }
    ],
    tvOptions: [
      { label: "미결합", price: 0 },
      { label: "이코노미", price: 9900 },
      { label: "스탠다드", price: 13200 },
      { label: "ALL", price: 17600 }
    ],
    mobileOptions: [
      { label: "미결합", discount: 0 },
      { label: "1회선", discount: -5500 },
      { label: "2회선", discount: -11000 },
      { label: "3회선+", discount: -16500 }
    ]
  },
  kt: {
    internetOptions: [
      { label: "100M", speed: "100M", price: 22000 },
      { label: "500M", speed: "500M", price: 27500 },
      { label: "1G", speed: "1G", price: 33000 }
    ],
    tvOptions: [
      { label: "미결합", price: 0 },
      { label: "베이직", price: 9900 },
      { label: "스탠다드", price: 13200 },
      { label: "프리미엄", price: 17600 }
    ],
    mobileOptions: [
      { label: "미결합", discount: 0 },
      { label: "1회선", discount: -5500 },
      { label: "2회선", discount: -11000 },
      { label: "3회선+", discount: -16500 }
    ]
  },
  lg: {
    internetOptions: [
      { label: "100M", speed: "100M", price: 22000 },
      { label: "500M", speed: "500M", price: 27500 },
      { label: "1G", speed: "1G", price: 33000 }
    ],
    tvOptions: [
      { label: "미결합", price: 0 },
      { label: "베이직", price: 9900 },
      { label: "스탠다드", price: 13200 },
      { label: "프리미엄", price: 17600 }
    ],
    mobileOptions: [
      { label: "미결합", discount: 0 },
      { label: "1회선", discount: -3300 },
      { label: "2회선", discount: -8800 },
      { label: "3회선+", discount: -14300 }
    ]
  },
  skylife: {
    internetOptions: [
      { label: "100M", speed: "100M", price: 22000 }
    ],
    tvOptions: [
      { label: "미결합", price: 0 },
      { label: "SKY베이직", price: 9900 },
      { label: "SKY ALL", price: 15400 }
    ],
    mobileOptions: [
      { label: "미결합", discount: 0 },
      { label: "1회선", discount: -3300 }
    ]
  },
  hellovision: {
    internetOptions: [
      { label: "100M", speed: "100M", price: 22000 }
    ],
    tvOptions: [
      { label: "미결합", price: 0 },
      { label: "이코노미", price: 9900 },
      { label: "스탠다드", price: 13200 }
    ],
    mobileOptions: [
      { label: "미결합", discount: 0 },
      { label: "1회선", discount: -3300 }
    ]
  }
};

export function getCarrierPriceData(carrierSlug: string): CarrierPriceData | null {
  return CARRIER_PRICE_DATA[carrierSlug] ?? null;
}

export function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR") + "원";
}
