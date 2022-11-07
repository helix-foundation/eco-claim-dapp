module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Founders Grotesk"],
      },
      colors: {
        "eco-blue-primary": "#0624E0",
        "eco-blue-dark": "#04138A",
        "eco-red-danger": "#DA1E28",
        "eco-yellow-warning": "#FF9900",
        "eco-green-success": "#59C785",
        "eco-teal-accent": "#67DEE5",
        "eco-orange-accent": "#FF9900",
        "eco-off-black": "#222222",
        "eco-dark-gray": "#727272",
        "eco-medium-gray": "#B7B7B7",
        "eco-light-gray": "#D9D9D9",
        "eco-lightest-gray": "#F6F6F6",
      },
    },
  },
  plugins: [],
};
