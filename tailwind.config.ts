import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#F4A58A",
          "orange-dark": "#E8937A",
          lavender: "#D4C8FF",
          "lavender-soft": "#F6F2FF",
          sky: "#8BCFE8",
          "sky-soft": "#F0F8FF",
          graphite: "#3D4A5C",
          slate: "#8892A0",
          border: "#E8ECF0",
          surface: "#F9FAFB",
          peach: "#FFF0EB",
          green: "#7BCDA0",
          "green-soft": "#F0FDF4",
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
        surround: ['Cafe24Ssurround', 'Pretendard Variable', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
