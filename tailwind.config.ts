import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#f15c2d",
          "orange-dark": "#d94a1f",
          lavender: "#CDBDFF",
          "lavender-soft": "#F5F1FF",
          sky: "#2DC2F1",
          "sky-soft": "#EEF9FF",
          graphite: "#1F2937",
          slate: "#5F6B7A",
          border: "#eaeaea",
          surface: "#F8FAFD",
          peach: "#FFE9E2",
          green: "#22C55E",
          "green-soft": "#F0FDF4",
          red: "#EF4444",
          yellow: "#F59E0B"
        }
      },
      maxWidth: {
        "7xl": "1400px"
      },
      boxShadow: {
        soft: "0 16px 50px rgba(31, 41, 55, 0.08)"
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      fontFamily: {
        surround: ['Cafe24Ssurround', 'Pretendard Variable', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
