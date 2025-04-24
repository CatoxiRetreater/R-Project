/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a2a3a',
        secondary: '#0c1824',
        accent: '#4a8fe7',
        text: '#e0e7ff',
        highlight: '#64ffda',
        error: '#ff6b6b',
        success: '#2ecc71',
        neutral: '#f39c12',
        'primary-dark': '#1a2a3a',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
      },
      backdropBlur: {
        md: '10px',
      },
    },
  },
  plugins: [],
};