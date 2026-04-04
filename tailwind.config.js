/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f3f1fd',
          100: '#e4e0fb',
          200: '#cac3f8',
          300: '#a99af3',
          400: '#8b73ee',
          500: '#6b5ce6',
          600: '#5a4ace',
          700: '#4838b0',
          800: '#3a2d8e',
          900: '#2d2370',
          950: '#1a1442',
        },
        accent: {
          400: '#f07ba0',
          500: '#ea5c84',
          600: '#d4446c',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
