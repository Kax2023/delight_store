import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        navy: {
          50: "#eef1f8",
          100: "#d7dff1",
          200: "#b1c1e3",
          300: "#8aa2d5",
          400: "#5f7bc3",
          500: "#3b59a9",
          600: "#2e4686",
          700: "#223663",
          800: "#172340",
          900: "#0d1425",
        },
        emerald: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        gold: {
          50: "#fff9e6",
          100: "#ffefbf",
          200: "#ffe08a",
          300: "#fdd25a",
          400: "#f5c542",
          500: "#e5ad24",
          600: "#c49119",
          700: "#9a7012",
          800: "#6f4f0a",
          900: "#4a3405",
        },
      },
    },
  },
  plugins: [],
};
export default config;
