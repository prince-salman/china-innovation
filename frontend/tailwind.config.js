/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          bg: '#0B0F17',
          panel: '#151D2A',
          border: '#222F44',
          yellow: '#F5B800',
          cyan: '#00E5FF',
          green: '#10B981',
          amber: '#F59E0B',
          red: '#EF4444',
        }
      }
    },
  },
  plugins: [],
}