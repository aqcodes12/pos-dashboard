/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Lato", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#0499A0",
        bgColor: "#FAFAFA",
      },
    },
  },
  plugins: [],
};
