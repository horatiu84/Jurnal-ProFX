/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px', // Extra small breakpoint personalizat
      },
      colors: {
        'trading': {
          green: '#22c55e',
          red: '#ef4444',
          blue: '#3b82f6',
          dark: '#1f2937',
        }
      }
    },
  },
  plugins: [],
}