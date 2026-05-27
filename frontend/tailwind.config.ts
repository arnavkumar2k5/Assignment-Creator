import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        heading: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        veda: {
          ink: '#2c2c2c',
          muted: '#858585',
          bg: '#d1d1d1',
          orange: '#ff5b2e',
          green: '#42c978',
        },
        ink: {
          DEFAULT: '#1a1a2e',
          50: '#f0f0f8',
          100: '#d6d6f0',
          200: '#adadd9',
          300: '#8585c2',
          400: '#5c5cab',
          500: '#3a3a8c',
          600: '#2d2d70',
          700: '#1a1a2e',
          800: '#131326',
          900: '#0d0d1a',
        },
        accent: {
          DEFAULT: '#e8a900',
          light: '#ffc72c',
          dark: '#b87800',
        },
        paper: '#faf8f2',
        cream: '#f5f0e8',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
