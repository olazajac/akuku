// tailwind.config.js

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust this path based on your project structure
  ],
  theme: {
    extend: {
      colors: {
        lightblue: {
          300: "#bfdbfe", // Custom light blue color
        },
      },
    },
  },
  plugins: [],
};
