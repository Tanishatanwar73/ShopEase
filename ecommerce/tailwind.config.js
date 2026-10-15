/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: "#f3f7f1",
          100: "#e4eee1",
          200: "#cbdcc7",
          300: "#afc6a9",
          400: "#91ad8b",
          500: "#75986f",
          600: "#5e8059",
          700: "#4b6848",
          800: "#3b5239",
          900: "#30432f",
          950: "#233323",
        },
      },
    },
  },
  plugins: [],
}

