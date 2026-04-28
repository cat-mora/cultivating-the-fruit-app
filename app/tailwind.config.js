/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
  ],
  presets: process.env.EXPO_OS !== 'web' ? [require("nativewind/preset")] : [],
  theme: {
    extend: {
      colors: {
        // Logo-inspired colors
        blue: {
          dark: "#2C5A75",
          DEFAULT: "#3D7A9A",
          light: "#A8C5D9",
          pale: "#C8D9E5",
        },
        rose: {
          dark: "#C28896",
          DEFAULT: "#D99BA6",
          light: "#F2D5DC",
        },
        gold: {
          dark: "#A88F62",
          DEFAULT: "#C4A777",
          light: "#E5D8BC",
        },
        // Supporting colors
        charcoal: "#2F2F2F",
        cream: {
          DEFAULT: "#FFF9F0",
          dark: "#F5EDE0",
        },
        parchment: "#FFFBF5",
        // Legacy colors (keep for compatibility)
        sage: "#7D8C69",
        sand: "#F5F2E8",
        terracotta: "#B25B42",
        wine: "#3D7A9A", // Map wine to blue
        blush: {
          DEFAULT: "#F5E1E6",
          light: "#FDF5F7",
        },
        mint: {
          DEFAULT: "#D4E8D7",
          light: "#EDF5EE",
        },
      },
    },
  },
  plugins: [],
};
