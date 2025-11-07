// Configuration de l'interface médicale
export const config = {
  // Couleurs du thème
  colors: {
    // Palette EMS / Ambulance Soins
    primary: "#1E90FF", // Bleu ambulance (accent principal)
    secondary: "#0B4F6C", // Bleu/teal sombre (bordures/contours)
    accent: "#FF3B3B", // Rouge soin/urgence (accents, alertes)
    muted: "#9AA9B2", // Texte secondaire

    // Gravités des blessures (pour le moment, binaire: 0/1)
    severity: {
      // light: "#FFD166", // Légère - Jaune doux
      // medium: "#F4A261", // Moyenne - Orange doux
      // severe: "#E76F51", // Grave - Orange foncé
      critical: "#D90429", // Présence de blessure
    },
  },

  // Configuration du fond
  background: {
    blur: true, // true = fond flou, false = fond transparent sans flou
    opacity: 0.95, // Opacité de la fenêtre principale (0-1)
  },

  // Configuration de la fenêtre
  window: {
    maxWidth: "1200px",
    width: "90%",
    padding: "40px",
    borderRadius: "20px",
  },

  // Mode showcase (pour le dev, mettre false en prod FiveM)
  showcase: true,

  // Définition des catégories et actions disponibles
  actions: {
    soins: [
      { id: "bandage", label: "Bandage" },
      { id: "first_aid_kit", label: "Kit de soins" },
    ],
    operations: [{ id: "suture", label: "Suture" }],
    transfusions: [
      { id: "blood_bag", label: "Poche de sang" },
      { id: "adrenaline", label: "Adrénaline" },
    ],
    autres: [
      // Ajoutez ici d'autres actions spécifiques serveur
    ],
  },
};
