/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#123B5D',
          50: '#F0F6FA',
          100: '#E1EDF6',
          200: '#BAD6EC',
          300: '#8FBCE0',
          400: '#4D8EC5',
          500: '#1B5B8C',
          600: '#123B5D', // Brand primary navy
          700: '#0E2E49',
          800: '#0A2033',
          900: '#06131F'
        },
        secondary: {
          DEFAULT: '#0EA5A4',
          50: '#F0FDFD',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#0EA5A4', // Brand teal
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A'
        },
        surface: '#F5F8FC',
        hospital: {
          bg: '#F5F8FC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          muted: '#64748B',
          dark: '#1E293B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(18, 59, 93, 0.05)',
        'card': '0 4px 20px -2px rgba(18, 59, 93, 0.08)',
        'modal': '0 20px 40px -15px rgba(18, 59, 93, 0.25)',
      }
    },
  },
  plugins: [],
}
