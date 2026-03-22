export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefbf3",
          100: "#d7f6e2",
          500: "#28915b",
          700: "#1f6b45",
          900: "#103724"
        },
        soil: "#5f3c2d",
        sun: "#f4b740"
      },
      boxShadow: {
        panel: "0 18px 45px rgba(15, 23, 42, 0.18)"
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top left, rgba(244,183,64,0.24), transparent 32%), linear-gradient(135deg, #f8fafc 0%, #dcfce7 45%, #ecfccb 100%)"
      }
    }
  },
  plugins: []
};
