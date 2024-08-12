/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    screens: {
      'sm': '376px',
      'md': '500px',
      'md2': '768px',
      'lg': '1024px',
    },
  },
  plugins: [],
};
