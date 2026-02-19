/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif']
      },
      boxShadow: {
        glass: '0 10px 30px rgba(15, 23, 42, 0.35)'
      }
    }
  },
  plugins: []
};
