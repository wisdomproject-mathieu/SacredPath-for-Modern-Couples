/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        copper: {
          DEFAULT: '#d1a07b',
          light: '#e8c4a0',
          dark: '#a87850',
        },
        charcoal: {
          DEFAULT: '#0f0d10',
          surface: '#1a171c',
          elevated: '#241f27',
          border: '#2e2831',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Times New Roman', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(209, 160, 123, 0.15)',
        'glow-md': '0 0 40px rgba(209, 160, 123, 0.2)',
        'glow-lg': '0 0 60px rgba(209, 160, 123, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
