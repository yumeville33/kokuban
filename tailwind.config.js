/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    // colors: {
    //   grape: "#94618E",
    //   eggplant: "#49274A",
    //   sand: "#F4DECB",
    //   shell: "#F8EEE7",
    //   gray: colors.neutral,
    //   white: colors.white,
    // },
  },
  plugins: [],
};
