const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      appearance: ['none'],
      fontFamily: {
        sans: ["var(--font-manrope)", ...fontFamily.sans],
      },
      colors: {
        primary: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',  // Main brand red
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        surface: {
          white: '#FFFFFF',
          light: '#F9FAFB',
          neutral: '#F3F4F6',
          dark: '#1F2937',
        },
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
}