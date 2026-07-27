/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Sicak, oyunlastirilmis (Duolingo hissi) — aydinlik tema.
        cream: { 50: "#fffdf8", 100: "#fbf6ec", 200: "#f0e7d6", 300: "#e4d7bf" },
        ink: { DEFAULT: "#3a322c", soft: "#6e6156" },
        // `btn` = darker green for white text on buttons (WCAG); DEFAULT stays bright for fills/dots.
        grass: { DEFAULT: "#58cc02", dark: "#46a302", btn: "#3d8f01", soft: "#e9f8d6" },
        coral: { DEFAULT: "#ff6f59", dark: "#e5573f", soft: "#ffe7e1" },
        gold: { DEFAULT: "#ffc02e", dark: "#e0a400", soft: "#fff2cf" },
        sky: { DEFAULT: "#25b4f5", dark: "#0e97d6", soft: "#dcf1fd" },
        grape: { DEFAULT: "#a56bff", soft: "#efe6ff" },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      keyframes: {
        pop: { "0%": { transform: "scale(0.9)", opacity: "0" }, "100%": { transform: "scale(1)", opacity: "1" } },
        rise: { "0%": { transform: "translateY(10px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
      },
      animation: {
        pop: "pop 0.2s ease-out",
        rise: "rise 0.28s ease-out",
      },
    },
  },
  plugins: [],
};
