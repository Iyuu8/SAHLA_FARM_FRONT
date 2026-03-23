/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { 
    extend: {
      fontFamily: {
        newblack: ['NewBlack', 'sans-serif'],
      },
      screens: {
        'laptop': '1180px',
        'single-short': { 'raw': '(max-width: 1179px) and (max-height: 699px)' },
        'single-tall': { 'raw': '(max-width: 1179px) and (min-height: 900px)' },
        'single-taller': { 'raw': '(max-width: 1179px) and (min-height: 1100px)' },
      },
    }, 
  },
  plugins: [],
}

