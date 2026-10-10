/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        champagne: {
          50: '#FDFCF9',
          100: '#FAF4ED',
          200: '#F7E9DD', // Core champagne
          300: '#EED3BE',
          400: '#E4BDA0',
          500: '#D8A37E',
        },
        blush: {
          50: '#FDF5F6',
          100: '#FBE8EB',
          200: '#F5C6CD',
          300: '#E8A0A8', // Core blush pink
          400: '#D97B87',
          500: '#C75B69',
        },
        rosegold: {
          300: '#D4969E',
          400: '#C4818B',
          500: '#B76E79', // Core rose gold
          600: '#9E5560',
          700: '#83404A',
        },
        gold: {
          300: '#DFC286',
          400: '#D1AC69',
          500: '#C49A52', // Core rich metallic gold
          600: '#A9813D',
          700: '#8E692D',
        },
        chocolate: {
          600: '#5F4133',
          700: '#493126', // Core deep chocolate brown
          800: '#38241B',
          900: '#261811',
          950: '#170E0A',
        },
        ivory: {
          50: '#FFFFFF',
          100: '#FFFDF9',
          200: '#FFF9F4', // Core soft ivory
          300: '#FBF2EA',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Montserrat', 'Inter', 'sans-serif'],
        script: ['"Great Vibes"', '"Playfair Display"', 'cursive'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(73, 49, 38, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(73, 49, 38, 0.16)',
        'gold-glow': '0 0 25px rgba(196, 154, 82, 0.28)',
        'rose-glow': '0 0 25px rgba(183, 110, 121, 0.25)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        shimmer: 'shimmer 2.5s infinite',
        fadeIn: 'fadeIn 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
}
