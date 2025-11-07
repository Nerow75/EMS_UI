import { useState, useEffect } from 'react';
import { config } from './config/config';
import Header from './components/Header';
import HumanBody from './components/HumanBody';
import InjuryPanel from './components/InjuryPanel';

const MedicalUI = () => {
  const [selectedPart, setSelectedPart] = useState(null);
  const [isVisible, setIsVisible] = useState(config.showcase);
  const [gender, setGender] = useState('male');

  // Données exemple des parties du corps
  const [bodyParts, setBodyParts] = useState({
    head: {
      name: "Tête",
      injuries: [
        { type: "Contusion", severity: "Légère", description: "Coup léger à la tempe" },
        { type: "Lacération", severity: "Moyenne", description: "Coupure au front" }
      ]
    },
    chest: {
      name: "Torse",
      injuries: [
        { type: "Fracture", severity: "Grave", description: "Côtes fêlées" },
        { type: "Contusion", severity: "Moyenne", description: "Hématome thoracique" }
      ]
    },
    leftArm: {
      name: "Bras Gauche",
      injuries: [
        { type: "Entorse", severity: "Légère", description: "Poignet tordu" }
      ]
    },
    rightArm: {
      name: "Bras Droit",
      injuries: []
    },
    abdomen: {
      name: "Abdomen",
      injuries: [
        { type: "Hémorragie", severity: "Critique", description: "Saignement interne" }
      ]
    },
    leftLeg: {
      name: "Jambe Gauche",
      injuries: [
        { type: "Fracture", severity: "Grave", description: "Tibia cassé" }
      ]
    },
    rightLeg: {
      name: "Jambe Droite",
      injuries: [
        { type: "Brûlure", severity: "Moyenne", description: "Brûlure au 2ème degré" }
      ]
    }
  });

  // Gestion des événements NUI depuis FiveM
  useEffect(() => {
    const handleMessage = (event) => {
      const data = event.data;

      switch (data.action) {
        case 'openUI':
          setIsVisible(true);
          if (data.injuries) {
            setBodyParts(data.injuries);
          }
          if (data.gender) {
            const normalizedGender = data.gender === 'female' ? 'female' : 'male';
            setGender(normalizedGender);
          }
          break;

        case 'closeUI':
          setIsVisible(false);
          setSelectedPart(null);
          setGender('male');
          break;

        case 'updateInjuries':
          if (data.injuries) {
            setBodyParts(data.injuries);
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    // Gestion de la touche ESC
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isVisible) {
        closeUI();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  const closeUI = () => {
    setIsVisible(false);
    setSelectedPart(null);
    setGender('male');
    
    // Envoyer un message à FiveM
    fetch(`https://medical-ui/closeUI`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    }).catch(() => {
      // En dev, ignorer l'erreur
      console.log('Dev mode: closeUI callback');
    });
  };

  // Genre par défaut à "male"; peut être écrasé par NUI openUI.gender

  // Ne pas afficher l'UI si elle n'est pas visible
  if (!isVisible) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 1000
    }}>
      {/* Fenêtre principale */}
      <div style={{
        display: 'flex',
        gap: '30px',
        maxWidth: config.window.maxWidth,
        width: config.window.width,
        background: `linear-gradient(135deg, rgba(15, 15, 25, ${config.background.opacity}) 0%, rgba(10, 10, 18, ${config.background.opacity}) 100%)`,
        borderRadius: config.window.borderRadius,
        padding: config.window.padding,
        border: `1px solid ${config.colors.secondary}55`,
        boxShadow: `0 12px 50px rgba(0, 0, 0, 0.85), 0 0 0 1px ${config.colors.primary}15 inset, 0 0 40px ${config.colors.primary}20`,
        backdropFilter: config.background.blur ? 'blur(10px)' : 'none',
        pointerEvents: 'all',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#ffffff',
        position: 'relative'
      }}>
        
        <Header onClose={closeUI} />

        {/* Contenu principal */}
        <div style={{
          display: 'flex',
          gap: '30px',
          width: '100%',
          marginTop: '50px',
          alignItems: 'stretch'
        }}>
          
          <HumanBody 
            selectedPart={selectedPart}
            onPartSelect={setSelectedPart}
            bodyParts={bodyParts}
            gender={gender}
          />

          <InjuryPanel 
            selectedPart={selectedPart}
            bodyParts={bodyParts}
            onClose={() => setSelectedPart(null)}
          />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        
        /* Personnalisation de la scrollbar */
        div::-webkit-scrollbar {
          width: 8px;
        }
        
        div::-webkit-scrollbar-track {
          background: rgba(94, 44, 165, 0.1);
          border-radius: 10px;
        }
        
        div::-webkit-scrollbar-thumb {
          background: ${config.colors.secondary};
          border-radius: 10px;
        }
        
        div::-webkit-scrollbar-thumb:hover {
          background: ${config.colors.primary};
        }
      `}</style>

      {/* Plus de demande de genre côté UI */}
    </div>
  );
};

export default MedicalUI;

