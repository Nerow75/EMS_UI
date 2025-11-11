import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import App from "./App.jsx";
import { config } from "./config/config";

// Ajouter la classe showcase au body si le mode showcase est activé
if (config.showcase) {
  document.body.classList.add("showcase");
}

// Réduire certaines animations si l'utilisateur préfère moins d'animations
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.body.classList.add("reduced-motion");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
