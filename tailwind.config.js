/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nomad: {
          terracotta: "#D95338",
          "terracotta-dark": "#B83D24",
          "terracotta-light": "#F9EBE7",
          navy: "#0F2C59",
          "navy-light": "#1E447B",
          sand: "#FAF6F0",
          "sand-dark": "#EFE6D8",
          gold: "#E59819",
          green: "#2E7D32"
        },
        luxe: {
          sand: "#FAF7F2",
          terracotta: "#C4633A",
          "terracotta-dark": "#A54F2C",
          emerald: "#1B4332",
          "emerald-light": "#2D5A45",
          gold: "#C9A227",
          ink: "#1A1A1A"
        },
        admin: {
          bg: "#F8F9FA"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"]
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
