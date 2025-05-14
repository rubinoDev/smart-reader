/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Allow Tailwind classes to work alongside Material UI
  corePlugins: {
    preflight: false,
  },
  important: '#root',
}
