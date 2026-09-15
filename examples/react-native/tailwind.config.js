/** @type {import('tailwindcss').Config} */
module.exports = {
  // React Native Web adds its atomic styles at runtime. Important utilities
  // keep explicit Tailwind classes authoritative on FlowUI controls.
  important: true,
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../packages/react-native/src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        fui: {
          primary: "#7c3aed",
          surface: "#ffffff",
          canvas: "#f8fafc",
        },
      },
    },
  },
  plugins: [],
};
