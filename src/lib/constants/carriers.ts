export interface CarrierTheme {
  accentColor: string;
  logoPath: string;
  logoAlt: string;
}

export const DEFAULT_CARRIER_THEME: CarrierTheme = {
  accentColor: "#F4A58A",
  logoPath: "/images/carriers/sk_logo.png",
  logoAlt: "인터넷공룡"
};

export const CARRIER_THEME_MAP: Record<string, CarrierTheme> = {
  sk: {
    accentColor: "#FFD0A0",
    logoPath: "/images/carriers/sk_logo.png",
    logoAlt: "SK"
  },
  kt: {
    accentColor: "#F5A8AC",
    logoPath: "/images/carriers/kt_logo.png",
    logoAlt: "KT"
  },
  lg: {
    accentColor: "#F5B8D0",
    logoPath: "/images/carriers/lg_logo.png",
    logoAlt: "LG"
  },
  skylife: {
    accentColor: "#A0E0D0",
    logoPath: "/images/carriers/kt_logo_sky.png",
    logoAlt: "Skylife"
  },
  hellovision: {
    accentColor: "#FFC8B8",
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
