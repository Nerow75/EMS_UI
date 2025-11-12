// tailwind.config.js
// Fichier principal de configuration du framework TailwindCSS.
// Définit la portée de scan, la palette de couleurs et la typographie du projet.

export default {
  // Analyse les fichiers pour purger les classes inutilisées
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Personnalisation de la palette de couleurs
      colors: {
        primary: "#22A7E8", // Couleur principale de l'identité visuelle
        secondary: "#5E2CA5", // Couleur secondaire
        accent: "#FFD400", // Couleur d'accentuation
        light: "#9ADCF8", // Ton clair complémentaire
      },
      // Police principale du projet
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [], // Aucun plugin Tailwind additionnel configuré
};
