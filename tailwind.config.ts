import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#FF7A1A",
          "orange-dark": "#E66500",
          lavender: "#CDBDFF",
          "lavender-soft": "#F5F1FF",
          sky: "#72C9F5",
          "sky-soft": "#EEF9FF",
          graphite: "#1F2937",
          slate: "#5F6B7A",
          border: "#E7ECF3",
          surface: "#F8FAFD"
        }
      },
      boxShadow: {
        soft: "0 16px 50px rgba(31, 41, 55, 0.08)"
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    }
  },
  plugins: []
};

export default config;
