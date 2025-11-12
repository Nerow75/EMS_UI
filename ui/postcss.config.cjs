// postcss.config.cjs
// Configuration PostCSS pour le traitement automatique des fichiers CSS.
// Utilisée par Vite afin d'intégrer TailwindCSS et Autoprefixer dans la chaîne de build.

module.exports = {
  plugins: {
    "@tailwindcss/postcss": {}, // Activation de TailwindCSS
    autoprefixer: {}, // Ajout automatique des préfixes navigateurs
  },
};
