import { useMemo, useState } from "react";
import { config } from "../config/config";

const InjuryPanel = ({ selectedPart, bodyParts }) => {
  const [selectedInjuryIndex, setSelectedInjuryIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("soins");

  const handleAction = async (action, index) => {
    try {
      await fetch(`https://medical-ui/treat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          part: selectedPart,
          injuryIndex: index,
        }),
      });
    } catch (error) {
      console.log("Dev mode: treat callback", action, selectedPart, index);
    }
  };

  const availableActions = useMemo(() => {
    switch (activeTab) {
      case "soins":
        return config.actions.soins || [];
      case "operations":
        return config.actions.operations || [];
      case "transfusions":
        return config.actions.transfusions || [];
      case "autres":
        return config.actions.autres || [];
      default:
        return [];
    }
  }, [activeTab]);

  if (!selectedPart) {
    return (
      <div
        style={{
          flex: "1 1 0",
          background: config.colors.bgSecondary,
          borderRadius: "1rem",
          padding: "clamp(1.5rem, 3vw, 2rem)",
          border: `1px solid ${config.colors.border}`,
          height: "100%", // ← prend toute la hauteur
          minHeight: 0,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            fontSize: "clamp(4rem, 10vw, 5rem)",
            marginBottom: "1.5rem",
            opacity: 0.6,
          }}
        >
          🩺
        </div>
        <h3
          style={{
            color: config.colors.primary,
            fontSize: "clamp(1.5rem, 3vw, 1.75rem)",
            margin: 0,
            fontWeight: 600,
          }}
        >
          Sélectionnez une partie
        </h3>
        <p
          style={{
            color: config.colors.muted,
            fontSize: "clamp(0.875rem, 2vw, 1rem)",
            maxWidth: "20rem",
            margin: "0.75rem 0 0 0",
            lineHeight: 1.6,
          }}
        >
          Cliquez sur une région du corps pour voir les détails médicaux
        </p>
      </div>
    );
  }

  let part = bodyParts[selectedPart];
  if (selectedPart === "torso") {
    const chest = bodyParts.chest || { name: "Torse", injuries: [] };
    const abdomen = bodyParts.abdomen || { name: "Abdomen", injuries: [] };
    part = {
      name: "Tronc",
      injuries: [...(chest.injuries || []), ...(abdomen.injuries || [])],
    };
  }
  if (selectedPart === "fullBody") {
    part = bodyParts.fullBody || { name: "Corps Entier", injuries: [] };
  }

  const hasInjuries = (part.injuries || []).length > 0;
  const nothingSelected = selectedInjuryIndex === null;
  const selectedInjury =
    selectedInjuryIndex !== null ? part.injuries[selectedInjuryIndex] : null;

  return (
    <div
      style={{
        flex: "1 1 0",
        background: config.colors.bgSecondary,
        borderRadius: "1rem",
        padding: "clamp(1rem, 2.5vw, 1.5rem)",
        border: `1px solid ${config.colors.border}`,
        height: "100%", // ← prend toute la hauteur dispo
        minHeight: 0, // ← nécessaire pour que le scroll fonctionne correctement en flex
        overflow: "hidden", // ← on contrôle le scroll dans le contenu
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* En-tête */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
          paddingBottom: "0.75rem",
          borderBottom: `2px solid ${config.colors.borderLight}`,
          flex: "0 0 auto",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.125rem",
            color: "#ffffff",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {selectedPart === "fullBody" && (
            <i
              className="fa-solid fa-person"
              style={{ fontSize: "1rem", color: config.colors.accent }}
            />
          )}
          {part.name}
        </h2>
        {hasInjuries && (
          <span
            style={{
              background: config.colors.accent,
              color: "#ffffff",
              padding: "0.375rem 0.75rem",
              borderRadius: "999px",
              fontSize: "0.75rem",
              fontWeight: 700,
              boxShadow: `0 0 20px ${config.colors.accent}30`,
            }}
          >
            {part.injuries.length}
          </span>
        )}
      </div>

      {/* Contenu scrollable pleine hauteur */}
      <div
        style={{
          flex: "1 1 auto",
          minHeight: 0,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {hasInjuries ? (
          <>
            {/* Liste blessures */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {part.injuries.map((injury, index) => (
                <div
                  key={index}
                  style={{
                    background:
                      selectedInjuryIndex === index
                        ? `linear-gradient(135deg, ${config.colors.bgTertiary} 0%, ${config.colors.bgSecondary} 100%)`
                        : config.colors.bgPrimary,
                    border:
                      selectedInjuryIndex === index
                        ? `2px solid ${config.colors.primary}`
                        : `1px solid ${config.colors.borderLight}`,
                    borderLeft: `4px solid ${config.colors.accent}`,
                    borderRadius: "0.75rem",
                    padding: "0.75rem 0.875rem",
                    transition: "all 0.25s ease",
                    cursor: "pointer",
                    boxShadow:
                      selectedInjuryIndex === index
                        ? `0 0 0 4px ${config.colors.primary}15, 0 4px 16px rgba(0,0,0,0.2)`
                        : "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  onClick={() => setSelectedInjuryIndex(index)}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        color: "#ffffff",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      {injury.type}
                    </h4>
                    {selectedInjuryIndex === index && (
                      <i
                        className="fa-solid fa-circle-check"
                        style={{
                          color: config.colors.primary,
                          fontSize: "1rem",
                        }}
                      />
                    )}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      color: config.colors.muted,
                      fontSize: "0.75rem",
                      lineHeight: "1.5",
                    }}
                  >
                    {injury.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Blessure sélectionnée */}
            {selectedInjury && (
              <div
                style={{
                  background: `linear-gradient(135deg, ${config.colors.primary}15 0%, ${config.colors.primary}05 100%)`,
                  border: `1px solid ${config.colors.primary}40`,
                  borderRadius: "0.5rem",
                  padding: "0.5rem 0.625rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <i
                  className="fa-solid fa-hand-pointer"
                  style={{ color: config.colors.primary, fontSize: "0.875rem" }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: config.colors.primary,
                      fontSize: "0.625rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "0.125rem",
                    }}
                  >
                    Blessure sélectionnée
                  </div>
                  <div
                    style={{
                      color: "#ffffff",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                    }}
                  >
                    {selectedInjury.type}
                  </div>
                </div>
              </div>
            )}

            {/* Tabs & Actions */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                borderBottom: `2px solid ${config.colors.borderLight}`,
                marginTop: "0.25rem",
              }}
            >
              {[
                {
                  id: "soins",
                  label: "Soins",
                  icon: "fa-solid fa-briefcase-medical",
                },
                {
                  id: "operations",
                  label: "Opérations",
                  icon: "fa-solid fa-user-doctor",
                },
                {
                  id: "transfusions",
                  label: "Transfusions",
                  icon: "fa-solid fa-syringe",
                },
                { id: "autres", label: "Autres", icon: "fa-solid fa-ellipsis" },
              ].map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      background: active
                        ? config.colors.primary
                        : "transparent",
                      border: "none",
                      borderBottom: active
                        ? `2px solid ${config.colors.primary}`
                        : "2px solid transparent",
                      color: active ? "#ffffff" : config.colors.muted,
                      padding: "0.375rem 0.625rem",
                      cursor: "pointer",
                      display: "flex",
                      gap: "0.375rem",
                      alignItems: "center",
                      transition: "all 0.2s ease",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      borderRadius: active ? "0.375rem 0.375rem 0 0" : "0",
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    <i className={tab.icon}></i>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "0.625rem",
                paddingTop: "0.375rem",
              }}
            >
              {availableActions.length === 0 ? (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    color: config.colors.muted,
                    fontSize: "0.875rem",
                    textAlign: "center",
                    padding: "1rem",
                  }}
                >
                  Aucune action disponible
                </div>
              ) : (
                availableActions.map((action) => {
                  const disabled = nothingSelected;
                  return (
                    <button
                      key={action.id}
                      type="button"
                      disabled={disabled}
                      onClick={() =>
                        handleAction(action.id, selectedInjuryIndex)
                      }
                      style={{
                        padding: "0.5rem 0.625rem",
                        borderRadius: "0.5rem",
                        border: disabled
                          ? `1px solid ${config.colors.borderLight}`
                          : `1px solid ${config.colors.primary}`,
                        background: disabled
                          ? config.colors.bgPrimary
                          : `linear-gradient(135deg, ${config.colors.primary}20 0%, ${config.colors.primary}10 100%)`,
                        color: disabled ? config.colors.muted : "#ffffff",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: disabled ? "not-allowed" : "pointer",
                        opacity: disabled ? 0.5 : 1,
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        boxShadow: disabled
                          ? "none"
                          : "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      {action.icon && <i className={action.icon}></i>}
                      <span>{action.label}</span>
                    </button>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "2rem",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${config.colors.success}20 0%, ${config.colors.success}10 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
              }}
            >
              <i
                className="fa-solid fa-check"
                style={{ fontSize: "2.5rem", color: config.colors.success }}
              />
            </div>
            <h3
              style={{
                color: config.colors.success,
                fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
                margin: "0 0 0.75rem 0",
                fontWeight: 600,
              }}
            >
              Aucune blessure
            </h3>
            <p
              style={{
                color: config.colors.muted,
                margin: 0,
                fontSize: "clamp(0.875rem, 2vw, 1rem)",
                lineHeight: 1.6,
              }}
            >
              Cette partie du corps est en parfait état
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InjuryPanel;
