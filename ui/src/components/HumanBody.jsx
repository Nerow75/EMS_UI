// HumanBody.jsx
// Composant responsable de l’affichage interactif du corps humain et de la visualisation des blessures.
// S’appuie sur la librairie `reactjs-human-body` pour la représentation SVG du modèle humain.

import { useCallback, useEffect, useMemo, useState } from "react";
import { BodyComponent } from "reactjs-human-body";
import { config } from "../config/config";

// Couleurs de base et de sélection pour les segments corporels
const BASE_BODY_COLOR = "#64748B";
const SELECTED_STROKE_COLOR = "#FFFFFF";

// Association entre les identifiants du modèle SVG et les clés internes de l’application
const PART_MAPPING = {
  head: "head",
  chest: "torso",
  stomach: "torso",
  leftShoulder: "leftArm",
  leftArm: "leftArm",
  leftHand: "leftArm",
  rightShoulder: "rightArm",
  rightArm: "rightArm",
  rightHand: "rightArm",
  leftLeg: "leftLeg",
  leftFoot: "leftLeg",
  rightLeg: "rightLeg",
  rightFoot: "rightLeg",
};

// Liste des parties à masquer (permet une configuration dynamique)
const HIDDEN_PARTS = new Set([]);

// Composant principal
const HumanBody = ({ selectedPart, onPartSelect, bodyParts, gender }) => {
  // Suivi de la partie survolée
  const [hoveredPart, setHoveredPart] = useState(null);

  // Détermination de la couleur d’une partie selon la présence de blessures
  const getPartColor = useCallback(
    (partKey) => {
      let injuries = [];
      if (partKey === "torso") {
        // Fusion des blessures du torse et de l’abdomen
        const chestInj = bodyParts.chest?.injuries || [];
        const abdomenInj = bodyParts.abdomen?.injuries || [];
        injuries = [...chestInj, ...abdomenInj];
      } else {
        injuries = bodyParts[partKey]?.injuries || [];
      }
      if (injuries.length === 0)
        return { color: config.colors.noInjury, highlighted: false };
      return { color: config.colors.injury, highlighted: true };
    },
    [bodyParts]
  );

  // Génération de la configuration d’affichage du corps selon l’état des blessures
  const bodyConfiguration = useMemo(() => {
    const parts = {};
    Object.keys(PART_MAPPING).forEach((reactjsPart) => {
      const ourPart = PART_MAPPING[reactjsPart];
      const partInfo = getPartColor(ourPart);
      parts[reactjsPart] = {
        highlighted: partInfo.highlighted,
        color: partInfo.color,
      };
    });

    // Création du mapping de rendu par partie visible/masquée/sélectionnée
    const configuration = {};
    Object.keys(parts).forEach((bodyPartName) => {
      configuration[bodyPartName] = {
        show: !HIDDEN_PARTS.has(bodyPartName),
        selected: selectedPart
          ? PART_MAPPING[bodyPartName] === selectedPart
          : false,
      };
    });

    return { parts, configuration };
  }, [selectedPart, getPartColor]);

  // Application dynamique des couleurs et effets visuels sur le SVG
  useEffect(() => {
    Object.entries(bodyConfiguration.parts).forEach(
      ([bodyPartName, partData]) => {
        if (HIDDEN_PARTS.has(bodyPartName)) return;
        const element = document.getElementById(bodyPartName);
        if (!element) return;
        const paths = element.querySelectorAll("path");
        const fillColor = partData.highlighted
          ? partData.color
          : BASE_BODY_COLOR;
        const isSelected = selectedPart
          ? PART_MAPPING[bodyPartName] === selectedPart
          : false;

        // Mise à jour des propriétés graphiques du SVG
        paths.forEach((path) => {
          path.style.fill = fillColor;
          path.style.filter =
            partData.highlighted || isSelected
              ? `drop-shadow(0 0 8px ${fillColor})`
              : "none";
          path.style.stroke = isSelected ? SELECTED_STROKE_COLOR : "none";
          path.style.strokeWidth = isSelected ? "2px" : "0";
        });
      }
    );
  }, [bodyConfiguration, gender, selectedPart]);

  // Sélection d’une partie du corps via clic
  const handleClick = useCallback(
    (partId) => {
      const mappedPart = PART_MAPPING[partId];
      if (mappedPart) onPartSelect(mappedPart);
    },
    [onPartSelect]
  );

  // Gestion du survol de la souris pour afficher le badge d’information
  const handleMouseMove = useCallback((event) => {
    if (!(event.target instanceof Element)) return setHoveredPart(null);
    const svgElement = event.target.closest("[data-position]");
    if (!svgElement) return setHoveredPart(null);
    const partId = svgElement.getAttribute("data-position");
    if (!partId || HIDDEN_PARTS.has(partId)) return setHoveredPart(null);
    const mappedPart = PART_MAPPING[partId];
    setHoveredPart(mappedPart || null);
  }, []);

  // Réinitialisation du survol
  const handleMouseLeave = useCallback(() => setHoveredPart(null), []);

  // Clé de rendu unique pour déclencher le recalcul du composant SVG
  const bodyKey = useMemo(
    () =>
      JSON.stringify({ gender, selectedPart, state: bodyConfiguration.parts }),
    [bodyConfiguration.parts, gender, selectedPart]
  );

  // Détermination du modèle à utiliser (homme ou femme)
  const resolvedGender = gender === "female" ? "female" : "male";

  // Vérifie la présence de blessures sur le corps entier
  const hasFullBodyInjuries =
    bodyParts.fullBody && bodyParts.fullBody.injuries.length > 0;

  // Rendu du composant principal
  return (
    <div
      style={{
        flex: "0 1 350px",
        maxWidth: "350px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "stretch",
        gap: "0.75rem",
        paddingTop: "0.25rem",
        height: "100%",
        minHeight: 0,
      }}
    >
      {/* Zone centrale d’affichage du modèle du corps humain */}
      <div
        style={{
          position: "relative",
          isolation: "isolate",
          width: "100%",
          flex: "1 1 auto",
          minHeight: 0,
          aspectRatio: "3 / 4",
          overflow: "hidden",
          filter: `drop-shadow(0 0 24px ${config.colors.primary}20)`,
          margin: "0 auto",
          display: "grid",
          placeItems: "center",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <BodyComponent
          key={bodyKey}
          partsInput={bodyConfiguration.configuration}
          onClick={handleClick}
          bodyModel={resolvedGender}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />

        {/* Infobulle contextuelle affichée au survol d’une partie */}
        {hoveredPart &&
          (() => {
            let name = "";
            let count = 0;
            if (hoveredPart === "torso") {
              name = "Tronc";
              const chestInj = bodyParts.chest?.injuries?.length || 0;
              const abdomenInj = bodyParts.abdomen?.injuries?.length || 0;
              count = chestInj + abdomenInj;
            } else if (bodyParts[hoveredPart]) {
              name = bodyParts[hoveredPart].name;
              count = bodyParts[hoveredPart].injuries.length;
            } else {
              return null;
            }
            return (
              <div
                style={{
                  position: "absolute",
                  bottom: "0.5rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: config.colors.bgSecondary,
                  border: `1px solid ${config.colors.border}`,
                  borderRadius: "0.5rem",
                  padding: "0.35rem 0.55rem",
                  fontSize: "0.7rem",
                  color: "#ffffff",
                  textAlign: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  fontWeight: 600,
                  pointerEvents: "none",
                  zIndex: 3,
                  maxWidth: "90%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {name} • {count} blessure{count > 1 ? "s" : ""}
              </div>
            );
          })()}
      </div>

      {/* Légende des états de blessure */}
      <div
        style={{
          minHeight: "2.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "320px",
          marginTop: "0.125rem",
          flex: "0 0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.875rem",
            flexWrap: "wrap",
            justifyContent: "center",
            fontSize: "0.675rem",
            color: config.colors.muted,
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
          >
            <div
              style={{
                width: "0.5rem",
                height: "0.5rem",
                borderRadius: "50%",
                background: config.colors.injury,
              }}
            />
            <span>Blessure</span>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
          >
            <div
              style={{
                width: "0.5rem",
                height: "0.5rem",
                borderRadius: "50%",
                background: config.colors.noInjury,
              }}
            />
            <span>Sain</span>
          </div>
        </div>
      </div>

      {/* Bouton permettant la sélection du corps entier */}
      {hasFullBodyInjuries && (
        <button
          onClick={() => onPartSelect("fullBody")}
          style={{
            background:
              selectedPart === "fullBody"
                ? `linear-gradient(135deg, ${config.colors.accent} 0%, #B91C1C 100%)`
                : config.colors.bgSecondary,
            border: `2px solid ${
              selectedPart === "fullBody"
                ? config.colors.accent
                : config.colors.border
            }`,
            borderRadius: "0.5rem",
            padding: "0.5rem 1rem",
            color: "#ffffff",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow:
              selectedPart === "fullBody"
                ? `0 0 20px ${config.colors.accent}40, 0 4px 12px rgba(0,0,0,0.3)`
                : "0 2px 8px rgba(0,0,0,0.2)",
            width: "100%",
            maxWidth: "240px",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              selectedPart === "fullBody"
                ? `0 0 25px ${config.colors.accent}60, 0 8px 16px rgba(0,0,0,0.4)`
                : `0 4px 12px rgba(0,0,0,0.3)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              selectedPart === "fullBody"
                ? `0 0 20px ${config.colors.accent}40, 0 4px 12px rgba(0,0,0,0.3)`
                : "0 2px 8px rgba(0,0,0,0.2)";
          }}
        >
          <i className="fa-solid fa-person" style={{ fontSize: "0.875rem" }} />
          <span>Corps Entier</span>
          <span
            style={{
              background: "rgba(255,255,255,0.2)",
              padding: "0.125rem 0.375rem",
              borderRadius: "999px",
              fontSize: "0.625rem",
              fontWeight: 700,
            }}
          >
            {bodyParts.fullBody.injuries.length}
          </span>
        </button>
      )}
    </div>
  );
};

export default HumanBody;
