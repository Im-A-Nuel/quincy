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
        // Layered mesh gradient - soft radial blooms (light violet top-left,
        // deeper indigo glow bottom-right) over the linear base, instead of a
        // flat two-stop fill. Used everywhere gradient-primary is (hero cards,
        // buttons, FAB), so the richer look cascades app-wide.
        "gradient-primary":
          "radial-gradient(130% 150% at 12% 8%, rgba(199, 210, 254, 0.55) 0%, rgba(199, 210, 254, 0) 55%), " +
          "radial-gradient(130% 150% at 88% 92%, rgba(67, 56, 202, 0.5) 0%, rgba(67, 56, 202, 0) 55%), " +
          "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
        "gradient-mint": "linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)",
        "gradient-canvas": "linear-gradient(180deg, #fafbff 0%, #eef2ff 100%)",
      },
      transitionTimingFunction: {
        // Decelerate-only: default motion curve for entrances/hovers.
        soft: "cubic-bezier(0.22, 1, 0.36, 1)",
        // Slight overshoot: premium "spring" feel for taps and toggles.
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        // Sharp in, soft out: exits and dismissals.
        snappy: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "toast-out": {
          "0%": { opacity: "1", transform: "translateY(0) scale(1)", maxHeight: "80px" },
          "100%": { opacity: "0", transform: "translateY(-6px) scale(0.96)", maxHeight: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(-1deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) backwards",
        "fade-in": "fade-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) backwards",
        "scale-in": "scale-in 0.22s cubic-bezier(0.22, 1, 0.36, 1) backwards",
        "toast-in": "toast-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) backwards",
        "toast-out": "toast-out 0.22s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        shimmer: "shimmer 1.8s ease-in-out infinite",
        // Slow idle bob for hero illustrations - a subtle sign of life, not a distraction.
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
