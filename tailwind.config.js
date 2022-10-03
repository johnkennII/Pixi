module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat Alternates", "sans-serif"],
        primary: ["Cormorant Garamond", "serif"],
      },
      colors: {
        background: "#191919",
        primary: "#2D4263",
        secondary: "#C84B31",
        tertiary: "#ECDBBA",
        yellow:"#ffffbe",
        brown:"#e06f1f",
        dark:"#70380f",
        green:"#7d7d00",
        orange:"#ffc14d"
      },
    },
  },
  plugins: ["@tailwindcss/forms"],
};
