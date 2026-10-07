/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fc: {
          burgundy: "#4A2523",
          "burgundy-dark": "#351816",
          "burgundy-soft": "#6B403C",
          background: "#F7F2E9",
          surface: "#FFFDF8",
          "surface-warm": "#F8EFE1",
          "surface-muted": "#F2EBDD",
          gold: "#D7A94C",
          "gold-light": "#F5DF9F",
          beige: "#E8D8C1",
          text: "#2D2422",
          "text-muted": "#746B66",
          "text-soft": "#958B85",
          "text-on-dark": "#FFF9F0",
          border: "#E7DED1",
          "border-strong": "#D6C8B8",
          success: "#5F8F65",
          "success-soft": "#E8F0E6",
          warning: "#B98228",
          "warning-soft": "#F8EBCB",
          danger: "#B84C46",
          "danger-soft": "#F5E3E0",
          info: "#557A8A",
          "info-soft": "#E4EDF0",
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        'fc-sm': '6px',
        'fc-md': '8px',
        'fc-lg': '12px',
        'fc-xl': '18px',
      }
    },
  },
  plugins: [],
}
