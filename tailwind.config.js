/** @type {import('tailwindcss').Config} */
import animate from "tw-animate-css";

module.exports = {
    content: [
      "./src/**/*.{js,jsx}",
    ],
    theme: {
      extend: {
        colors: {
          brand: {
            green: "#74C043",     // Leaf green
            sky: "#ADD4F7",       // Light blue
            blue: "#0A65A8",      // Accent deep blue
            sand: "#D3C3AA",      // Beige
            earth: "#D6A57C",     // Clay brown
            cream: "#F9E9A0",     // Sunlight yellow
          },
          "brand-green": "#74C043",
          "brand-sky": "#ADD4F7",
          "brand-blue": "#0A65A8",
          "brand-sand": "#D3C3AA",
          "brand-earth": "#D6A57C",
          "brand-cream": "#F9E9A0",
        },
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
          serif: ['Lora', 'Georgia', 'serif'],
        },
        // keyframes: {
        //   fadeInUp: {
        //     '0%': { opacity: '0', transform: 'translateY(20px)' },
        //     '100%': { opacity: '1', transform: 'translateY(0)' },
        //   },
        // },
        // animation: {
        //   'fade-in-up': 'fadeInUp 1s ease both',
        // },
      },
    },
    plugins: [
      require("@tailwindcss/typography"),
      animate
    ],
    safelist: ["animate-fade-in-up"],
  };
  