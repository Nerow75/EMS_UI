// main.jsx
// Point d’entrée de l’application React (initialisation et rendu).
// Gère les préférences d’affichage et charge la configuration globale.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import App from "./App.jsx";
import { config } from "./config/config";

// Application de la classe showcase si le mode démonstration est activé
if (config.showcase) {
  document.body.classList.add("showcase");
}

// Application d’une classe spéciale pour les utilisateurs préférant moins d’animations
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.body.classList.add("reduced-motion");
}

// Rendu de l'application React dans l'élément racine du DOM
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
