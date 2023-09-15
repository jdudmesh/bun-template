/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.js", "../src/**/*.tsx"],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}
