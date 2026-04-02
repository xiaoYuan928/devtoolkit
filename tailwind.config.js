/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#131313',
        'bg-secondary': '#1f1f1f',
        'bg-tertiary': '#2a2a2a',
        'text-primary': '#e2e2e2',
        'text-secondary': '#c6c6c6',
        'accent': '#00FF41',
      },
      fontFamily: {
        headline: ['Space Grotesk', 'sans-serif'],
        body: ['Work Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '4px',
      },
    },
  },
  plugins: [],
};
