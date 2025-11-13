// App.jsx
// Composant racine de l'application React.
// Sert de conteneur principal pour l'interface médicale.

import { useEffect } from "react";
import MedicalUI from "./MedicalUI";
import { config } from "./config/config";

function App() {
  // Dès que la NUI est chargée, on prévient le script client
  useEffect(() => {
    try {
      fetch(`https://medical-ui/nuiReady`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ready: true }),
      }).catch(() => {
        if (config.showcase) {
          console.log("[Dev mode] nuiReady callback");
        }
      });
    } catch (err) {
      if (config.showcase) {
        console.log("[Dev mode] nuiReady error", err);
      }
    }
  }, []);

  // Rend le composant MedicalUI représentant la vue principale de l'interface
  return <MedicalUI />;
}

export default App;
