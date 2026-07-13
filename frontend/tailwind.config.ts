import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // App surfaces - CSS vars so light/dark flip everywhere at once.
        canvas: "var(--canvas)",
        surface: "var(--surface)",
        // Quincy brand palette - indigo/violet, modern web3 consumer feel.
        quincy: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        // Soft tint accents for category tiles + status chips.
        soft: {
          green: "#e7f8ee",
          mint: "#e3f9f1",
          blue: "#e8f1ff",
          purple: "#ecebff",
          indigo: "#eef2ff",
          pink: "#ffeef4",
          orange: "#fff1e6",
          yellow: "#fff8e1",
          gray: "#f1f2f7",
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
        // Diffuse, low-opacity elevation - cards should feel like they float.
        soft: "0 2px 8px -2px rgba(49, 46, 129, 0.06), 0 4px 20px -4px rgba(49, 46, 129, 0.08)",
        float: "0 8px 30px -6px rgba(79, 70, 229, 0.16)",
        pill: "0 6px 16px -4px rgba(79, 70, 229, 0.4)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
        "gradient-mint": "linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)",
        "gradient-canvas": "linear-gradient(180deg, #fafbff 0%, #eef2ff 100%)",
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
