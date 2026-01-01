/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#222222", // main text – dark ink
          soft: "#4A4A4A", // softer body text
        },
        parchment: {
          light: "#F8F1E7", // page background
          DEFAULT: "#EFE0CB", // main card color
          dark: "#D1B38C", // borders/shadows
        },
        accent: {
          wax: "#7D1F2B", // wax seal red
          waxDeep: "#5C151F", // darker wax hover
          gold: "#BFA27A", // subtle accent
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        "soft-card": "0 22px 55px rgba(15, 23, 42, 0.23)",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      backgroundImage: {
        "parchment-fibers":
          "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.09) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
