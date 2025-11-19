/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        flame: {
          mild: '#FFB84D',
          hot: '#FF8C42',
          spicy: '#FF6B35',
          chaotic: '#FF4D1C',
          inferno: '#FF2E2E',
        },
        umass: {
          maroon: '#881C1C',
          gray: '#75787B',
        },
      },
    },
  },
  plugins: [],
};

