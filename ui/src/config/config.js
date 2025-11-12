// config.js
// Fichier de configuration globale pour l'interface médicale.
// Centralise les constantes de style, les comportements visuels et les paramètres de démonstration.

export const config = {
  // Couleurs du thème - Palette visuelle cohérente inspirée du milieu médical
  colors: {
    // Couleurs principales
    primary: "#3B82F6", // Bleu médical utilisé pour les éléments interactifs
    secondary: "#1E293B", // Gris-bleu sombre pour les fonds et zones neutres
    accent: "#EF4444", // Rouge vif pour les alertes ou urgences
    success: "#10B981", // Vert pour signaler une réussite ou une guérison
    warning: "#F59E0B", // Orange pour les avertissements
    muted: "#94A3B8", // Gris clair pour les éléments secondaires

    // Fonds principaux et transparences
    bgPrimary: "rgba(15, 23, 42, 0.95)", // Fond principal sombre semi-opaque
    bgSecondary: "rgba(30, 41, 59, 0.8)", // Fond secondaire utilisé dans les panneaux
    bgTertiary: "rgba(51, 65, 85, 0.6)", // Fond tertiaire pour superpositions

    // Bordures et séparateurs
    border: "rgba(148, 163, 184, 0.2)", // Bordure standard
    borderLight: "rgba(148, 163, 184, 0.1)", // Bordure légère

    // États liés aux blessures
    injury: "#DC2626", // Rouge utilisé pour marquer les blessures présentes
    noInjury: "#64748B", // Gris utilisé lorsqu'aucune blessure n’est détectée
  },

  // Configuration du fond d’interface
  background: {
    blur: true, // Active le flou de fond (effet verre dépoli)
    opacity: 0.98, // Opacité générale de la fenêtre
  },

  // Configuration de la fenêtre principale
  window: {
    maxWidth: "1400px", // Largeur maximale autorisée
    width: "92%", // Largeur relative de la fenêtre
    padding: "2rem", // Espacement interne
    borderRadius: "1.25rem", // Rayon d’arrondi des bords
  },

  // Mode démonstration (permet l’affichage direct sans intégration FiveM)
  showcase: true,

  // Liste des actions médicales disponibles (catégorisées)
  actions: {
    // Soins de base
    soins: [
      { id: "bandage", label: "Bandage", icon: "fa-solid fa-bandage" },
      {
        id: "first_aid_kit",
        label: "Kit de premiers soins",
        icon: "fa-solid fa-kit-medical",
      },
      { id: "morphine", label: "Morphine", icon: "fa-solid fa-pills" },
    ],

    // Interventions chirurgicales
    operations: [
      { id: "suture", label: "Suture", icon: "fa-solid fa-scissors" },
      { id: "surgery", label: "Chirurgie", icon: "fa-solid fa-user-doctor" },
    ],

    // Actions de transfusion ou injection
    transfusions: [
      { id: "blood_bag", label: "Poche de sang", icon: "fa-solid fa-droplet" },
      { id: "adrenaline", label: "Adrénaline", icon: "fa-solid fa-syringe" },
      { id: "serum", label: "Sérum", icon: "fa-solid fa-flask" },
    ],

    // Autres interventions spécifiques
    autres: [
      {
        id: "defibrillator",
        label: "Défibrillateur",
        icon: "fa-solid fa-heart-pulse",
      },
    ],
  },
};
