import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#7EB5D6",
          "orange-dark": "#6AA3C8",
          lavender: "#C8BBE8",
          "lavender-soft": "#F5F2FA",
          sky: "#A8D4F0",
          "sky-soft": "#F0F7FD",
          graphite: "#3D4A5C",
          slate: "#7A8B9E",
          border: "#DDE4ED",
          surface: "#F5F8FC",
          peach: "#FDDECF",
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
        surround: ['Cafe24Ssurround', 'Pretendard Variable', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
