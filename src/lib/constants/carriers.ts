export interface CarrierTheme {
  accentColor: string;
  logoPath: string;
  logoAlt: string;
}

export const DEFAULT_CARRIER_THEME: CarrierTheme = {
  accentColor: "#7EB5D6",
  logoPath: "/images/carriers/sk_logo.png",
  logoAlt: "인터넷공룡"
};

export const CARRIER_THEME_MAP: Record<string, CarrierTheme> = {
  sk: {
    accentColor: "#8ABDE0",
    logoPath: "/images/carriers/sk_logo.png",
    logoAlt: "SK"
  },
  kt: {
    accentColor: "#6EA8D4",
    logoPath: "/images/carriers/kt_logo.png",
    logoAlt: "KT"
  },
  lg: {
    accentColor: "#94C4E8",
    logoPath: "/images/carriers/lg_logo.png",
    logoAlt: "LG"
  },
  skylife: {
    accentColor: "#A0D8E8",
    logoPath: "/images/carriers/kt_logo_sky.png",
    logoAlt: "Skylife"
  },
  hellovision: {
    accentColor: "#B0CCE0",
    logoPath: "/images/carriers/lg_vision.png",
    logoAlt: "Hellovision"
  }
};

export function getCarrierTheme(carrierSlug: string): CarrierTheme {
  return CARRIER_THEME_MAP[carrierSlug] ?? DEFAULT_CARRIER_THEME;
}

export function getCarrierAccentColor(carrierSlug: string): string {
  return getCarrierTheme(carrierSlug).accentColor;
}
