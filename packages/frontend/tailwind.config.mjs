import flowbitePlugin from "flowbite/plugin";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}", // ✅ Ajoute Flowbite React
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [flowbitePlugin], // ✅ Utilise `flowbite/plugin` au lieu de `flowbite-react/tailwind`
};

export default config;
