/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Lato", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#2D336B",
        bgColor: "#FFF2F2",
      },
    },
  },
  plugins: [],
};
