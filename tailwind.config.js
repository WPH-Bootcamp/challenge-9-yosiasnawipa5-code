/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        background: '#0a0a0a',
        foreground: '#fafafa',
        primary: {
          DEFAULT: '#dc2626',
          foreground: '#ffffff',
        },
        card: {
          DEFAULT: '#141414',
          foreground: '#fafafa',
        },
        muted: {
          DEFAULT: '#1f1f1f',
          foreground: '#a1a1a1',
        },
        border: '#2a2a2a',
        input: '#1f1f1f',
        ring: '#dc2626',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['"DM Serif Display"', 'serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
