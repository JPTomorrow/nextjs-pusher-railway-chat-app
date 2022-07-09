/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        synth: "url('/bg.gif')",
      }),
    },
  },
  plugins: [],
};
