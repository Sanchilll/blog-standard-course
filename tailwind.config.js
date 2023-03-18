/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{html,js,ts,jsx,tsx}",
    "./pages/**/*.{html,js,ts,jsx,tsx}",
    "./component/**/*.{html,js,ts,jsx,tsx}",
    // Or if using `src` directory:
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: "var(--font-dm-sans)",
        heading: "var(--font-dm-serif)",
      },
    },
  },
  plugins: [],
};
