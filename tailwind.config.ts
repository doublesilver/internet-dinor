import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#4A86CF",
          "orange-dark": "#3A74B8",
          lavender: "#B8C8E8",
          "lavender-soft": "#EFF3FA",
          sky: "#6EA8E0",
          "sky-soft": "#EBF2FB",
          graphite: "#2C3E50",
          slate: "#6B829E",
          border: "#D4DDED",
          surface: "#F2F6FB",
          peach: "#D6E4F5",
          green: "#7BCDA0",
          "green-soft": "#EDFAF2",
          red: "#E88B8B",
          yellow: "#F0C97A"
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
        surround: ['Pretendard Variable', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
