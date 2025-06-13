/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#f97316',
        'brand-black': '#000000',
        'brand-white': '#ffffff',
        'text': '#333333',
        'text-light': '#666666',
        'background': '#FFFFFF',
      },
      keyframes: {
        'pulse-once': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        }
      },
      animation: {
        'pulse-once': 'pulse-once 0.3s ease-in-out 1',
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '1.5rem',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
} 