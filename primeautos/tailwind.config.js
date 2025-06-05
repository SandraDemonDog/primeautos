/** @type {import('tailwindcss').Config} */
/*module.exports = {
    safelist: [
      "border-b",
      "boder-gray-200",
      'bg-blue-500',
      'bg-gray-900',
      'text-white',
      'hover:text-yellow-400',
    ],
    darkMode: "class", // O "class" si deseas manejarlo manualmente
    */

    export default {
      content: [
      "./src/**/*.{js,ts,jsx,tsx}",
      "./app/**/*.{js,ts,jsx,tsx}", // Para el App Router en Next.js
      "./pages/**/*.{js,ts,jsx,tsx}", // Si usas la carpeta "pages"
      "./components/**/*.{js,ts,jsx,tsx}", // Para tus componentes personalizados
    ],
    theme: {
          extend: {},
    },
    plugins: [],
    }
    
    
    
    