// vite.config.js
// Configuration du bundler Vite pour le projet React (UI).
// Définit les paramètres de compilation, le dossier de sortie et la structure des assets.

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuration standard adaptée à un environnement FiveM (build statique dans /dist)
export default defineConfig({
  plugins: [react()], // Activation du support React
  base: "./", // Chemin relatif pour compatibilité avec FiveM
  build: {
    outDir: "dist", // Dossier de sortie du build
    assetsDir: "assets", // Répertoire des fichiers statiques
    emptyOutDir: true, // Nettoyage automatique avant build
    rollupOptions: {
      output: {
        // Nommage des fichiers générés pour cohérence avec le manifest
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
