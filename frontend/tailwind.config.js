/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7fa',
          100: '#e8edf2',
          200: '#d1dae3',
          300: '#a8b8c8',
          400: '#7a92a8',
          500: '#5a7289',
          600: '#475a6f',
          700: '#3a4859',
          800: '#323d4a',
          900: '#2c343e',
        },
        accent: {
          50: '#fef3e2',
          100: '#fde4b8',
          200: '#fbcb7d',
          300: '#f9a842',
          400: '#f7871e',
          500: '#e86a0a',
          600: '#d45506',
          700: '#b04108',
          800: '#8f360c',
          900: '#762f0d',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}

