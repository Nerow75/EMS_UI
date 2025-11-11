// Configuration de l'interface médicale
export const config = {
  // Couleurs du thème - Palette moderne médicale
  colors: {
    // Palette principale
    primary: "#3B82F6", // Bleu moderne vif
    secondary: "#1E293B", // Gris-bleu sombre
    accent: "#EF4444", // Rouge moderne pour urgences
    success: "#10B981", // Vert pour succès
    warning: "#F59E0B", // Orange pour warnings
    muted: "#94A3B8", // Gris clair pour textes secondaires

    // Backgrounds
    bgPrimary: "rgba(15, 23, 42, 0.95)", // Fond principal sombre
    bgSecondary: "rgba(30, 41, 59, 0.8)", // Fond secondaire
    bgTertiary: "rgba(51, 65, 85, 0.6)", // Fond tertiaire

    // Bordures et séparateurs
    border: "rgba(148, 163, 184, 0.2)",
    borderLight: "rgba(148, 163, 184, 0.1)",

    // État des blessures
    injury: "#DC2626", // Rouge pour blessure présente
    noInjury: "#64748B", // Gris pour pas de blessure
  },

  // Configuration du fond
  background: {
    blur: true,
    opacity: 0.98,
  },

  // Configuration de la fenêtre
  window: {
    maxWidth: "1400px",
    width: "92%",
    padding: "2rem",
    borderRadius: "1.25rem",
  },

  // Mode showcase
  showcase: true,

  // Actions médicales
  actions: {
    soins: [
      { id: "bandage", label: "Bandage", icon: "fa-solid fa-bandage" },
      {
        id: "first_aid_kit",
        label: "Kit de premiers soins",
        icon: "fa-solid fa-kit-medical",
      },
      { id: "morphine", label: "Morphine", icon: "fa-solid fa-pills" },
    ],
    operations: [
      { id: "suture", label: "Suture", icon: "fa-solid fa-scissors" },
      { id: "surgery", label: "Chirurgie", icon: "fa-solid fa-user-doctor" },
    ],
    transfusions: [
      { id: "blood_bag", label: "Poche de sang", icon: "fa-solid fa-droplet" },
      { id: "adrenaline", label: "Adrénaline", icon: "fa-solid fa-syringe" },
      { id: "serum", label: "Sérum", icon: "fa-solid fa-flask" },
    ],
    autres: [
      {
        id: "defibrillator",
        label: "Défibrillateur",
        icon: "fa-solid fa-heart-pulse",
      },
    ],
  },
};
