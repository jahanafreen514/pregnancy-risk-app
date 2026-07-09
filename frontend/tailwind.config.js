/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        bgMove: "bgMove 20s ease-in-out infinite",
        fadeIn: "fadeIn 1s ease forwards",
        float: "float 4s ease-in-out infinite",
      },

      keyframes: {
        bgMove: {
          "0%,100%": {
            transform: "scale(1) translate(0,0)",
          },
          "50%": {
            transform: "scale(1.1) translate(-20px,-20px)",
          },
        },

        fadeIn: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        float: {
          "0%,100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
      },
    },
  },
  plugins: [],
};