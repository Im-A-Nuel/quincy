import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Quincy brand palette — forest/mint, evokes Celo + trust/escrow.
        quincy: {
          50: "#eefdf3",
          100: "#d6f9e1",
          200: "#b0f1c8",
          300: "#7be3a8",
          400: "#41cd82",
          500: "#1cb368",
          600: "#0f9054",
          700: "#0d7245",
          800: "#105a39",
          900: "#0f4a31",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
