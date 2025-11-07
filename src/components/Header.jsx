import { config } from '../config/config';

const Header = ({ onClose }) => {
  return (
    <>
      {/* Bouton fermer X en haut à droite */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: `rgba(94, 44, 165, 0.3)`,
          border: `2px solid ${config.colors.secondary}`,
          color: config.colors.accent,
          width: '35px',
          height: '35px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '20px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          e.target.style.background = config.colors.secondary;
          e.target.style.transform = 'scale(1.1) rotate(90deg)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(94, 44, 165, 0.3)';
          e.target.style.transform = 'scale(1) rotate(0deg)';
        }}
      >
        ×
      </button>

      {/* Titre */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '40px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <div style={{ fontSize: '32px' }}>🩺</div>
        <h1 style={{
          margin: 0,
          fontSize: '24px',
          background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          Examen Médical
        </h1>
      </div>
    </>
  );
};

export default Header;
