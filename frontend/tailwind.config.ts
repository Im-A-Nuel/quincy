import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // App surfaces — soft, bright, off-white.
        canvas: "#F8FAF8",
        surface: "#FFFFFF",
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
        // Soft tint accents for category tiles + status chips.
        soft: {
          green: "#e8f8ef",
          mint: "#e3f9f1",
          blue: "#e8f1ff",
          purple: "#f0ecff",
          pink: "#ffeef4",
          orange: "#fff1e6",
          yellow: "#fff8e1",
          gray: "#f1f4f2",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        // Diffuse, low-opacity elevation — cards should feel like they float.
        soft: "0 2px 8px -2px rgba(16, 90, 57, 0.06), 0 4px 20px -4px rgba(16, 90, 57, 0.08)",
        float: "0 8px 30px -6px rgba(16, 90, 57, 0.12)",
        pill: "0 6px 16px -4px rgba(28, 179, 104, 0.35)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #1cb368 0%, #0f9054 100%)",
        "gradient-mint": "linear-gradient(135deg, #7be3a8 0%, #1cb368 100%)",
        "gradient-canvas": "linear-gradient(180deg, #f8faf8 0%, #eefdf3 100%)",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
