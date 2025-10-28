/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FAF8F5',
        accent: '#356454',
        text: '#1f2937',
      },
      fontFamily: {
        display: ['"Poppins"', '"Montserrat"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
