/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        primary: {
          DEFAULT: '#8b5cf6', // Violet 500
          hover: '#7c3aed', // Violet 600
        },
        secondary: {
          DEFAULT: '#06b6d4', // Cyan 500
          hover: '#0891b2', // Cyan 600
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #8b5cf6, 0 0 10px #8b5cf6' },
          '100%': { boxShadow: '0 0 10px #06b6d4, 0 0 20px #06b6d4' },
        }
      }
    },
  },
  plugins: [],
}
