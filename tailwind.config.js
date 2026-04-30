const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { 
    // Moving screens OUTSIDE of extend lets us control the exact order
    screens: {
      'xs': '480px',            // 1. Your custom xs comes FIRST
      ...defaultTheme.screens,  // 2. sm, md, lg, xl, 2xl come NEXT
      'laptop': '1180px',       // 3. Your custom larger screens come LAST
      'single-short': { 'raw': '(max-width: 1179px) and (max-height: 699px)' },
      'single-tall': { 'raw': '(max-width: 1179px) and (min-height: 900px)' },
      'single-taller': { 'raw': '(max-width: 1179px) and (min-height: 1100px)' },
    },
    extend: {
      fontFamily: {
        newblack: ['NewBlack', 'sans-serif'],
      },
      backgroundImage: {
        // Stacked background exactly as defined in Figma
        'sidebar-gradient': `
          linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(85, 187, 51, 0.10) 100%),
          linear-gradient(to bottom, rgba(171, 28, 52, 0.12) 0%, rgba(70, 35, 24, 0.12) 100%),
          linear-gradient(to bottom, #1F2937 0%, #0F172A 98%)
        `,
      },
    }, 
  },
  plugins: [],
}