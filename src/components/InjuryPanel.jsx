import { useMemo, useState } from 'react';
import { config } from '../config/config';

const InjuryPanel = ({ selectedPart, bodyParts, onClose }) => {
  const [selectedInjuryIndex, setSelectedInjuryIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('soins');
  const getSeverityColor = (severity) => {
    switch(severity) {
      case "Légère": return config.colors.severity.light;
      case "Moyenne": return config.colors.severity.medium;
      case "Grave": return config.colors.severity.severe;
      case "Critique": return config.colors.severity.critical;
      default: return config.colors.primary;
    }
  };

  const handleAction = async (action, index) => {
    try {
      await fetch(`https://medical-ui/treat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, part: selectedPart, injuryIndex: index })
      });
    } catch (e) {
      console.log('Dev mode: treat callback', action, selectedPart, index);
    }
  };

  // Hooks must be called before any return path
  const availableActions = useMemo(() => {
    switch (activeTab) {
      case 'soins': return config.actions.soins || [];
      case 'operations': return config.actions.operations || [];
      case 'transfusions': return config.actions.transfusions || [];
      case 'autres': return config.actions.autres || [];
      default: return [];
    }
  }, [activeTab]);

  if (!selectedPart) {
    return (
      <div style={{
        flex: '1.2',
        background: 'rgba(20, 20, 35, 0.6)',
        borderRadius: '15px',
        padding: '25px',
        border: '1px solid rgba(34, 167, 232, 0.3)',
        minHeight: '500px',
        maxHeight: '580px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '70px',
          marginBottom: '15px',
          animation: 'pulse 2s infinite'
        }}>
          👈
        </div>
        <h3 style={{
          color: config.colors.primary,
          fontSize: '24px',
          marginBottom: '12px',
          margin: 0
        }}>
          Sélectionnez une partie
        </h3>
        <p style={{
          color: '#999',
          fontSize: '14px',
          maxWidth: '280px',
          margin: '10px 0 0 0'
        }}>
          Cliquez sur une partie du corps pour afficher les détails des blessures
        </p>
      </div>
    );
  }

  let part = bodyParts[selectedPart];
  if (selectedPart === 'torso') {
    const chest = bodyParts.chest || { name: 'Torse', injuries: [] };
    const abdomen = bodyParts.abdomen || { name: 'Abdomen', injuries: [] };
    part = {
      name: 'Tronc',
      injuries: [...(chest.injuries || []), ...(abdomen.injuries || [])]
    };
  }
  const hasInjuries = (part.injuries || []).length > 0;
  const nothingSelected = selectedInjuryIndex === null;
  

  return (
    <div style={{
      flex: '1.2',
      background: 'rgba(20, 20, 35, 0.6)',
      borderRadius: '15px',
      padding: '25px',
      border: '1px solid rgba(34, 167, 232, 0.3)',
      minHeight: '500px',
      maxHeight: '580px',
      overflowY: 'auto'
    }}>
      {/* En-tête */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: `1px solid ${config.colors.secondary}55`
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '24px',
          color: '#ffffff',
          letterSpacing: '0.3px'
        }}>
          {part.name}
        </h2>
      </div>

      {/* Blessure (1 max) */}

      {/* Contenu */}
      {hasInjuries ? (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '0 0 12px 0'
          }}>
            <h3 style={{
              color: config.colors.primary,
              fontSize: '16px',
              margin: 0
            }}>
              Blessures détectées : {part.injuries.length}
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '6px' }}>
            {part.injuries.slice(0,1).map((injury, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid rgba(255,255,255,0.08)`,
                  borderLeft: `4px solid ${getSeverityColor(injury.severity)}`,
                  borderRadius: '10px',
                  padding: '12px 14px',
                  outline: selectedInjuryIndex === index ? `2px solid ${config.colors.primary}55` : 'none',
                  outlineOffset: '1px',
                  transition: 'all 0.3s'
                }}
                onClick={() => setSelectedInjuryIndex(index)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.boxShadow = `0 6px 16px rgba(0,0,0,0.25)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <h4 style={{
                    margin: 0,
                    color: '#ffffff',
                    fontSize: '15px'
                  }}>
                    {injury.type}
                  </h4>
                  <span style={{
                    background: getSeverityColor(injury.severity),
                    color: '#0a0a0a',
                    padding: '2px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 700
                  }}>
                    {injury.severity}
                  </span>
                </div>
                <p style={{
                  margin: 0,
                  color: config.colors.muted,
                  fontSize: '12px',
                  lineHeight: '1.5',
                  marginBottom: '0'
                }}>
                  {injury.description}
                </p>
              </div>
            ))}
          </div>

          {/* Tabs catégories - juste au-dessus des actions */}
          <div style={{ display: 'flex', gap: '18px', margin: '8px 0 10px 0', alignItems: 'flex-end' }}>
            {[
              { id: 'soins', label: 'Soins', icon: 'fa-solid fa-briefcase-medical' },
              { id: 'operations', label: 'Opérations', icon: 'fa-solid fa-screwdriver-wrench' },
              { id: 'transfusions', label: 'Transfusions', icon: 'fa-solid fa-syringe' },
              { id: 'autres', label: 'Autres', icon: 'fa-solid fa-ellipsis' }
            ].map(tab => (
              <div key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  paddingBottom: '6px',
                  borderBottom: activeTab === tab.id ? `2px solid ${config.colors.primary}` : '2px solid transparent',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  opacity: activeTab === tab.id ? 1 : 0.7
                }}
              >
                <i className={tab.icon} style={{ fontSize: '13px' }}></i>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{tab.label}</span>
              </div>
            ))}
          </div>

          {/* Actions globales (onglet courant) */}
          <div style={{
            marginTop: '6px',
            borderTop: `1px dashed ${config.colors.secondary}55`,
            paddingTop: '12px',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '10px'
          }}>
            <div style={{ color: config.colors.muted, fontSize: '12px' }}>
              {nothingSelected ? 'Sélectionnez une blessure pour agir' : `Blessure sélectionnée: #${selectedInjuryIndex + 1}`}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {availableActions.length === 0 && (
                <span style={{ color: config.colors.muted, fontSize: '12px' }}>Aucune action dans cet onglet</span>
              )}
              {availableActions.map((a) => (
                <button key={a.id} type="button" disabled={nothingSelected}
                  onClick={() => handleAction(a.id, selectedInjuryIndex)}
                  style={{
                    padding: '8px 12px', borderRadius: '10px',
                    border: `1px solid ${config.colors.primary}`,
                    background: nothingSelected ? 'transparent' : `${config.colors.primary}20`, color: '#fff',
                    fontSize: '12px', cursor: nothingSelected ? 'not-allowed' : 'pointer', opacity: nothingSelected ? 0.5 : 1
                  }}
                >{a.label}</button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '50px 20px'
        }}>
          <div style={{
            fontSize: '54px',
            marginBottom: '15px'
          }}>✓</div>
          <h3 style={{
            color: config.colors.primary,
            fontSize: '20px',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>
            Aucune blessure
          </h3>
          <p style={{ 
            color: '#999',
            margin: 0
          }}>
            Cette partie du corps est en bonne santé
          </p>
        </div>
      )}
    </div>
  );
};

export default InjuryPanel;
