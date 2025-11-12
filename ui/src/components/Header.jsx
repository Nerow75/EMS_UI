// Header.jsx
// Composant d’en-tête de l’interface médicale.
// Affiche le titre, les boutons de contrôle de fenêtre (réduire, agrandir, fermer)
// et applique un effet de flou avec style translucide cohérent avec le thème visuel.

import { config } from "../config/config";

// Composant principal du bandeau supérieur de l'UI
const Header = ({ onClose }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "3rem",
        background: config.colors.bgPrimary,
        borderBottom: `1px solid ${config.colors.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "1.25rem 1.25rem 0 0",
        zIndex: 10,
        WebkitBackdropFilter: "blur(15px)",
        backdropFilter: "blur(15px)",
      }}
    >
      {/* Zone centrale contenant le titre et l’icône principale */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <i
          className="fa-solid fa-heartbeat-pulse"
          aria-hidden="true"
          style={{
            fontSize: "1rem",
            color: config.colors.primary,
          }}
        ></i>
        <h1
          style={{
            margin: 0,
            fontSize: "0.9375rem",
            color: "#ffffff",
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          Examen Médical
        </h1>
      </div>

      {/* Groupe de boutons positionné à droite (contrôles de la fenêtre) */}
      <div
        style={{
          position: "absolute",
          right: "0.5rem",
          display: "flex",
          gap: "0.375rem",
        }}
      >
        {/* Bouton réduire la fenêtre */}
        <button
          type="button"
          aria-label="Réduire la fenêtre"
          style={{
            background: "transparent",
            border: "none",
            width: "2.25rem",
            height: "2rem",
            borderRadius: "0.375rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            color: config.colors.muted,
          }}
          onMouseEnter={(e) => {
            e.target.style.background = config.colors.bgSecondary;
            e.target.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = config.colors.muted;
          }}
        >
          <i className="fa-solid fa-minus" style={{ fontSize: "0.75rem" }}></i>
        </button>

        {/* Bouton agrandir la fenêtre */}
        <button
          type="button"
          aria-label="Agrandir la fenêtre"
          style={{
            background: "transparent",
            border: "none",
            width: "2.25rem",
            height: "2rem",
            borderRadius: "0.375rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            color: config.colors.muted,
          }}
          onMouseEnter={(e) => {
            e.target.style.background = config.colors.bgSecondary;
            e.target.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = config.colors.muted;
          }}
        >
          <i
            className="fa-regular fa-square"
            style={{ fontSize: "0.75rem" }}
          ></i>
        </button>

        {/* Bouton de fermeture de l’interface */}
        <button
          type="button"
          aria-label="Fermer l’interface"
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            width: "2.25rem",
            height: "2rem",
            borderRadius: "0.375rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            color: config.colors.muted,
          }}
          onMouseEnter={(e) => {
            e.target.style.background = config.colors.accent;
            e.target.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = config.colors.muted;
          }}
        >
          <i className="fa-solid fa-xmark" style={{ fontSize: "1rem" }}></i>
        </button>
      </div>
    </div>
  );
};

export default Header;
