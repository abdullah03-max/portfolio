/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          100: '#fff3c9',
          200: '#f9e6ab',
          300: '#f5d978',
          400: '#f5c542',
          500: '#c9a84c'
        },
        ink: {
          900: '#0f0f0f',
          800: '#161920'
        }
      },
      boxShadow: {
        glowGold: '0 16px 36px rgba(0,0,0,.45), 0 0 26px rgba(245, 197, 66, .18)'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
};
