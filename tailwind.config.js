/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        snow: {
          '0%': { transform: 'translateY(0px)', opacity: 0 },
          '20%': { opacity: 0.8 },
          '80%': { opacity: 0.8 },
          '100%': { transform: 'translateY(100vh)', opacity: 0 },
        },
      },
      animation: {
        snow: 'snow linear infinite',
      },
    },
  },
  plugins: [],
}