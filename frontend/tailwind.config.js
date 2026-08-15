/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        backdrop: "#E7E4DC", // seamless studio paper, cool-warm neutral
        ink: "#15181C", // near-black, used for text not backgrounds
        panel: "#FFFFFF",
        cutout: {
          DEFAULT: "#1F8A70", // "cutout green" — a nod to green-screen, desaturated
          dark: "#0B3D2E",
        },
        tape: "#E8A33D", // "gaffer tape amber" — accent for highlights/CTAs
        line: "#D8D3C6",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
