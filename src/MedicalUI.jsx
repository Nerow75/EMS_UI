import { useState, useEffect, useMemo } from "react";
import { config } from "./config/config";
import Header from "./components/Header";
import HumanBody from "./components/HumanBody";
import InjuryPanel from "./components/InjuryPanel";

const HEADER_HEIGHT = "3rem";
const VERTICAL_SPACING = "1.5rem";
const HORIZONTAL_SPACING = "1.5rem";

// Dimensions "de référence" (avant scale)
const BASE_WIDTH = 1120; // légèrement plus étroit
const BASE_HEIGHT = 780; // un peu moins haut

const MedicalUI = () => {
  const [selectedPart, setSelectedPart] = useState(null);
  const [isVisible, setIsVisible] = useState(config.showcase);
  const [gender, setGender] = useState("male");

  // Exemples de blessures (démo)
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

  // Layout responsive (colonne si étroit)
  const [stacked, setStacked] = useState(false);

  // Auto-scale de la fenêtre (texte + UI) selon viewport
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const computeLayout = () => {
      const vw = window.innerWidth - 32; // - padding extérieur
      const vh = window.innerHeight - 32;

      // scale pour faire rentrer la fenêtre de base
      const sW = vw / BASE_WIDTH;
      const sH = vh / BASE_HEIGHT;
      const s = Math.max(0.72, Math.min(1, Math.min(sW, sH))); // clamp 0.72 → 1

      setScale(s);
      setStacked(vw < 1100 * s); // bascule en colonne si vraiment étroit
    };

    computeLayout();
    window.addEventListener("resize", computeLayout);
    return () => window.removeEventListener("resize", computeLayout);
  }, []);

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
        default:
          break;
      }
    };
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

  if (!isVisible) return null;

  const containerStyle = useMemo(
    () => ({
      display: "flex",
      gap: stacked ? "1rem" : HORIZONTAL_SPACING,
      width: `${BASE_WIDTH}px`, // taille de base
      height: `${BASE_HEIGHT}px`, // taille de base
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

      // Auto-scale
      transform: `scale(${scale})`,
      transformOrigin: "center center",
    }),
    [stacked, scale]
  );

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
