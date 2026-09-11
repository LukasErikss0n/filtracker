/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        sans: ["'IBM Plex Sans'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        spool: {
          primary: "#ff4d2e",
          "primary-content": "#ffffff",
          secondary: "#161519",
          accent: "#12855a",
          neutral: "#161519",
          "base-100": "#ffffff",
          "base-200": "#f7f4ee",
          "base-300": "#e9e5dc",
          info: "#2f7de1",
          success: "#12855a",
          warning: "#c26a00",
          error: "#d63b2f",
        },
      },
    ],
  },
};
