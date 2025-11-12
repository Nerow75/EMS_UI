// eslint.config.js
// Configuration ESLint appliquée au projet React (front-end UI).
// Permet d'assurer la qualité, la cohérence et la conformité du code JavaScript et JSX.

import js from "@eslint/js";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";

export default [
  // Activation de la configuration recommandée par ESLint
  js.configs.recommended,
  {
    // Fichiers concernés : code source React/TypeScript du dossier UI
    files: ["ui/src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2023, // Version ECMAScript utilisée
      sourceType: "module", // Utilisation du format de modules ES
    },
    plugins: {
      react, // Analyse spécifique React
      "react-hooks": hooks, // Analyse des hooks React
    },
    settings: {
      react: { version: "detect" }, // Détection automatique de la version de React
    },
    rules: {
      // Désactivation de la contrainte d'import explicite de React (nouveau JSX transform)
      "react/react-in-jsx-scope": "off",

      // Vérification stricte des règles d'usage des hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Bonnes pratiques générales
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Autorise les variables préfixées par _
      "no-console": "warn", // Prévient l'utilisation excessive des logs console
    },
  },
];
