/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // cobalt scale taken from the logo; "primary" keeps existing class names working
        primary: {
          50: "#edf2fd",
          100: "#dbe5fb",
          200: "#bccdf7",
          300: "#8eabf0",
          400: "#5b82e6",
          500: "#2f5fdc",
          600: "#1747d1",
          700: "#1339ad",
          800: "#0f2f8a",
          900: "#0a1a4a",
        },
        ink: "#0a1a4a",
        bloom: { DEFAULT: "#f6a21a", soft: "#fff1d6", deep: "#c97a00" },
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      fontFamily: {
        sans: ['"Figtree Variable"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Bricolage Grotesque Variable"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
