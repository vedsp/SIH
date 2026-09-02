/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fin: {
          dark: '#0B0F19',
          card: '#111827',
          border: '#1F2937',
          hover: '#1E293B',
          accent: '#3B82F6',
          primary: '#0284C7',
          teal: '#0D9488',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
