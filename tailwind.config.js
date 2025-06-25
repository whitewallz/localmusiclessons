module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        teal: {
          400: '#14B8A6',
          500: '#0D9488',
          600: '#0F766E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      lineClamp: {
        3: 3,
      },
      boxShadow: {
        'yellow-glow': '0 0 10px 2px rgba(245, 158, 11, 0.7)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}



