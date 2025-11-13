// MedicalUI.jsx
// Composant principal de l'interface médicale.
// Gère l'affichage, les interactions et la synchronisation avec le client FiveM.

import { useState, useEffect, useMemo } from "react";
import { config } from "./config/config";
import { resolveBoneName } from "./config/boneMap";
import Header from "./components/Header";
import HumanBody from "./components/HumanBody";
import InjuryPanel from "./components/InjuryPanel";

// Constantes de mise en page (unités relatives et espacement)
const HEADER_HEIGHT = "3rem";
const VERTICAL_SPACING = "1.5rem";
const HORIZONTAL_SPACING = "1.5rem";

// Dimensions de référence pour le calcul du scale dynamique
const BASE_WIDTH = 1120;
const BASE_HEIGHT = 780;

const MedicalUI = () => {
  // États principaux de l'interface
  const [selectedPart, setSelectedPart] = useState(null);
  const [isVisible, setIsVisible] = useState(config.showcase);
  const [gender, setGender] = useState("male");

  // État temporaire de démonstration (données simulées)
  const [bodyParts, setBodyParts] = useState({
    fullBody: {
      name: "Corps Entier",
      injuries: [
        {
          type: "Brûlure",
          severity: "Grave",
          description: "Brûlures superficielles étendues",
        },
      ],
    },
    head: {
      name: "Tête",
      injuries: [
        {
          type: "Contusion",
          severity: "Légère",
          description: "Coup léger à la tempe",
        },
        {
          type: "Lacération",
          severity: "Moyenne",
          description: "Coupure au front",
        },
      ],
    },
    chest: {
      name: "Torse",
      injuries: [
        {
          type: "Fracture",
          severity: "Grave",
          description: "Côtes fêlées côté gauche",
        },
        {
          type: "Contusion",
          severity: "Moyenne",
          description: "Hématome thoracique",
        },
      ],
    },
    abdomen: {
      name: "Abdomen",
      injuries: [
        {
          type: "Hémorragie",
          severity: "Critique",
          description: "Suspicion de saignement interne",
        },
      ],
    },
    leftArm: {
      name: "Bras Gauche",
      injuries: [
        {
          type: "Entorse",
          severity: "Légère",
          description: "Poignet douloureux à la flexion",
        },
      ],
    },
    rightArm: { name: "Bras Droit", injuries: [] },
    leftLeg: {
      name: "Jambe Gauche",
      injuries: [
        {
          type: "Fracture",
          severity: "Grave",
          description: "Tibia cassé, douleur à la charge",
        },
      ],
    },
    rightLeg: {
      name: "Jambe Droite",
      injuries: [
        {
          type: "Brûlure",
          severity: "Moyenne",
          description: "Brûlure du mollet 2ème degré",
        },
      ],
    },
  });

  // États d’adaptation à la taille de la fenêtre
  const [stacked, setStacked] = useState(false);
  const [scale, setScale] = useState(1);

  // Ajustement du layout et du scale selon la taille du viewport
  useEffect(() => {
    const computeLayout = () => {
      const vw = window.innerWidth - 32;
      const vh = window.innerHeight - 32;

      const sW = vw / BASE_WIDTH;
      const sH = vh / BASE_HEIGHT;
      const s = Math.max(0.72, Math.min(1, Math.min(sW, sH)));

      setScale(s);
      setStacked(vw < 1100 * s);
    };

    computeLayout();
    window.addEventListener("resize", computeLayout);
    return () => window.removeEventListener("resize", computeLayout);
  }, []);

  // Gestion des messages NUI (open, close, update)
  useEffect(() => {
    const handleMessage = (event) => {
      if (!event || !event.data) return;
      const data = event.data;

      switch (data.action) {
        case "openUI":
          setIsVisible(true);
          if (data.injuries && typeof data.injuries === "object")
            setBodyParts(data.injuries);
          if (data.gender)
            setGender(data.gender === "female" ? "female" : "male");
          break;
        case "closeUI":
          closeUI();
          break;
        case "updateInjuries":
          if (data.injuries && typeof data.injuries === "object")
            setBodyParts(data.injuries);
          break;
        case "addInjury": {
          // Côté LUA tu envoies : boneName = "Tête" par ex.
          const { boneName, type, severity, description } = data;
          if (!boneName || !type) return;

          const { key, cleanLabel } = resolveBoneName(boneName);

          setBodyParts((prev) => {
            const next = { ...prev };
            const current = next[key] || {
              name: next[key]?.name || key,
              injuries: [],
            };

            // Tu peux inclure le nom précis de l'os dans le type ou dans la description
            const label = type; // ex: "Impact", "Plaie", etc.

            current.injuries = [
              ...(current.injuries || []),
              {
                type: label,
                severity: severity || "Inconnue",
                // On ajoute le nom précis en plus dans la description
                description: description
                  ? `${description} (${cleanLabel})`
                  : `Blessure localisée : ${cleanLabel}`,
              },
            ];

            next[key] = current;
            return next;
          });
          break;
        }
        case "batchInjuries": {
          const { list } = data; // [{ boneName, type, severity, description }, ...]
          if (!Array.isArray(list)) return;

          setBodyParts((prev) => {
            const next = { ...prev };

            list.forEach((item) => {
              if (!item) return;
              const { boneName, type, severity, description } = item;
              if (!boneName || !type) return;

              const { key, cleanLabel } = resolveBoneName(boneName);
              const current = next[key] || {
                name: next[key]?.name || key,
                injuries: [],
              };

              current.injuries = [
                ...(current.injuries || []),
                {
                  type,
                  severity: severity || "Inconnue",
                  description: description
                    ? `${description} (${cleanLabel})`
                    : `Blessure localisée : ${cleanLabel}`,
                },
              ];

              next[key] = current;
            });

            return next;
          });
          break;
        }
        default:
          break;
      }
    };

    // Écouteurs de messages et de raccourcis clavier
    window.addEventListener("message", handleMessage);
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isVisible) closeUI();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible]);

  // Fermeture de l'interface et notification au client Lua
  const closeUI = () => {
    setIsVisible(false);
    setSelectedPart(null);
    setGender("male");

    fetch(`https://medical-ui/closeUI`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    }).catch(() => {
      if (config.showcase) console.log("[Dev mode] closeUI callback");
    });
  };

  // Masque complet lorsque l'interface n'est pas visible
  if (!isVisible) return null;

  // Styles du conteneur principal
  const containerStyle = useMemo(
    () => ({
      display: "flex",
      gap: stacked ? "1rem" : HORIZONTAL_SPACING,
      width: `${BASE_WIDTH}px`,
      height: `${BASE_HEIGHT}px`,
      background: config.colors.bgPrimary,
      borderRadius: "1.25rem",
      padding: 0,
      border: `1px solid ${config.colors.border}`,
      boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      backdropFilter: config.background.blur ? "blur(15px)" : "none",
      WebkitBackdropFilter: config.background.blur ? "blur(15px)" : "none",
      pointerEvents: "all",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: "#ffffff",
      position: "relative",
      overflow: "hidden",
      flexDirection: stacked ? "column" : "row",
      transform: `scale(${scale})`,
      transformOrigin: "center center",
    }),
    [stacked, scale]
  );

  // Styles du contenu interne
  const contentStyle = useMemo(
    () => ({
      display: "flex",
      gap: stacked ? "1rem" : HORIZONTAL_SPACING,
      width: "100%",
      height: "100%",
      padding: stacked ? "1rem" : VERTICAL_SPACING,
      paddingTop: stacked
        ? `calc(${HEADER_HEIGHT} + 1rem)`
        : `calc(${HEADER_HEIGHT} + ${VERTICAL_SPACING} * 1.1)`,
      paddingBottom: stacked ? "1rem" : VERTICAL_SPACING,
      alignItems: "stretch",
      flexDirection: stacked ? "column" : "row",
      minHeight: 0,
    }),
    [stacked]
  );

  // Rendu de l'interface complète
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="medical-title"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div style={containerStyle}>
        <Header onClose={closeUI} />
        <div style={contentStyle}>
          <HumanBody
            selectedPart={selectedPart}
            onPartSelect={setSelectedPart}
            bodyParts={bodyParts}
            gender={gender}
          />
          <InjuryPanel selectedPart={selectedPart} bodyParts={bodyParts} />
        </div>
      </div>
    </div>
  );
};

export default MedicalUI;
