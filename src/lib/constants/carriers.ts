export interface CarrierTheme {
  accentColor: string;
  logoPath: string;
  logoAlt: string;
}

export const DEFAULT_CARRIER_THEME: CarrierTheme = {
  accentColor: "#4A86CF",
  logoPath: "/images/carriers/sk_logo.png",
  logoAlt: "인터넷공룡"
};

export const CARRIER_THEME_MAP: Record<string, CarrierTheme> = {
  sk: {
    accentColor: "#5A94D8",
    logoPath: "/images/carriers/sk_logo.png",
    logoAlt: "SK"
  },
  kt: {
    accentColor: "#3E78C0",
    logoPath: "/images/carriers/kt_logo.png",
    logoAlt: "KT"
  },
  lg: {
    accentColor: "#6BA0E0",
    logoPath: "/images/carriers/lg_logo.png",
    logoAlt: "LG"
  },
  skylife: {
    accentColor: "#7AADE4",
    logoPath: "/images/carriers/kt_logo_sky.png",
    logoAlt: "Skylife"
  },
  hellovision: {
    accentColor: "#8AB8E8",
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
