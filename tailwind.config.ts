import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Rail-themed palette (dark UI)
        rail: {
          900: '#081024',
          800: '#0b1734',
          750: '#0e1d3f',
          700: '#142b56',
          600: '#1f3f7a',
          500: '#2d7dff',
          400: '#5aa2ff',
          300: '#9fd0ff',
          200: '#d3eaff',
          100: '#eef6ff',
        },
      },
      boxShadow: {
        rail: '0 10px 30px rgba(0,0,0,0.35)',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
}

export default config

