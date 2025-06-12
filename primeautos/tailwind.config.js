/** @type {import('tailwindcss').Config} */
export default {
  safelist: [
    "border-b",
    "border-gray-200",
    'bg-blue-500',
    'bg-gray-900',
    'text-white',
    'hover:text-yellow-400',
  ],
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
