import { useCallback, useEffect, useMemo, useState } from 'react';
import { BodyComponent } from 'reactjs-human-body';
import { config } from '../config/config';

const BASE_BODY_COLOR = '#a3b2b3';
const SELECTED_STROKE_COLOR = '#FFFFFF';

const PART_MAPPING = {
  head: 'head',
  chest: 'torso',
  stomach: 'torso',
  leftShoulder: 'leftArm',
  leftArm: 'leftArm',
  leftHand: 'leftArm',
  rightShoulder: 'rightArm',
  rightArm: 'rightArm',
  rightHand: 'rightArm',
  leftLeg: 'leftLeg',
  leftFoot: 'leftLeg',
  rightLeg: 'rightLeg',
  rightFoot: 'rightLeg'
};

const HIDDEN_PARTS = new Set([]);

const HumanBody = ({ selectedPart, onPartSelect, bodyParts, gender }) => {
  const [hoveredPart, setHoveredPart] = useState(null);

  // Fonction pour obtenir la couleur selon les blessures
  const getPartColor = useCallback((partKey) => {
    let injuries = [];
    if (partKey === 'torso') {
      const chestInj = bodyParts.chest?.injuries || [];
      const abdomenInj = bodyParts.abdomen?.injuries || [];
      injuries = [...chestInj, ...abdomenInj];
    } else {
      injuries = bodyParts[partKey]?.injuries || [];
    }
    if (injuries.length === 0) return { color: config.colors.primary, highlighted: false };
    // Binaire: toute blessure -> couleur unique
    return { color: config.colors.severity.critical, highlighted: true };
  }, [bodyParts]);

  const bodyConfiguration = useMemo(() => {
    const parts = {};

    Object.keys(PART_MAPPING).forEach((reactjsPart) => {
      const ourPart = PART_MAPPING[reactjsPart];
      const partInfo = getPartColor(ourPart);

      parts[reactjsPart] = {
        highlighted: partInfo.highlighted,
        color: partInfo.color
      };
    });

    const configuration = {};

    Object.keys(parts).forEach((bodyPartName) => {
      configuration[bodyPartName] = {
        show: !HIDDEN_PARTS.has(bodyPartName),
        selected: selectedPart ? PART_MAPPING[bodyPartName] === selectedPart : false
      };
    });

    return { parts, configuration };
  }, [selectedPart, getPartColor]);

  useEffect(() => {
    Object.entries(bodyConfiguration.parts).forEach(([bodyPartName, partData]) => {
      if (HIDDEN_PARTS.has(bodyPartName)) {
        return;
      }

      const element = document.getElementById(bodyPartName);
      if (!element) return;

      const paths = element.querySelectorAll('path');
      const fillColor = partData.highlighted ? partData.color : BASE_BODY_COLOR;
      const isSelected = selectedPart ? PART_MAPPING[bodyPartName] === selectedPart : false;

      paths.forEach((path) => {
        path.style.fill = fillColor;
        path.style.filter = (partData.highlighted || isSelected)
          ? `drop-shadow(0 0 6px ${fillColor}cc)`
          : 'none';
        path.style.stroke = isSelected ? SELECTED_STROKE_COLOR : 'none';
        path.style.strokeWidth = isSelected ? '2px' : '0';
      });
    });
  }, [bodyConfiguration, gender, selectedPart]);

  // Gérer le clic sur une partie
  const handleClick = useCallback((partId) => {
    const mappedPart = PART_MAPPING[partId];
    if (mappedPart) {
      onPartSelect(mappedPart);
    }
  }, [onPartSelect]);

  const handleMouseMove = useCallback((event) => {
    if (!(event.target instanceof Element)) {
      setHoveredPart(null);
      return;
    }

    const svgElement = event.target.closest('[data-position]');
    if (!svgElement) {
      setHoveredPart(null);
      return;
    }

    const partId = svgElement.getAttribute('data-position');
    if (!partId) {
      setHoveredPart(null);
      return;
    }

    if (HIDDEN_PARTS.has(partId)) {
      setHoveredPart(null);
      return;
    }

    const mappedPart = PART_MAPPING[partId];
    setHoveredPart(mappedPart || null);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredPart(null);
  }, []);

  const bodyKey = useMemo(() => (
    JSON.stringify({ gender, selectedPart, state: bodyConfiguration.parts })
  ), [bodyConfiguration.parts, gender, selectedPart]);

  const resolvedGender = gender === 'female' ? 'female' : 'male';

  return (
    <div style={{
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '320px',
      gap: '15px'
    }}>
      {/* Indicateur de genre retiré */}

      {/* Corps humain */}
      <div style={{
        position: 'relative',
        filter: `drop-shadow(0 0 20px ${config.colors.primary}40)`,
        transform: 'scale(1.0)',
        transformOrigin: 'top center'
      }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <BodyComponent
          key={bodyKey}
          partsInput={bodyConfiguration.configuration}
          onClick={handleClick}
          bodyModel={resolvedGender}
        />
      </div>

      {/* Légende des couleurs */}
      <div style={{
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '320px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '3px',
            background: config.colors.severity.critical
          }} />
          <span>Blessure</span>
        </div>
      </div>

      {/* Info hover */}
      {hoveredPart && (
        (() => {
          let name = '';
          let count = 0;
          if (hoveredPart === 'torso') {
            name = 'Tronc';
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
        <div style={{
          background: `rgba(94, 44, 165, 0.5)`,
          border: `2px solid ${config.colors.primary}`,
          borderRadius: '8px',
          padding: '8px 15px',
          fontSize: '12px',
          color: '#ffffff',
          textAlign: 'center'
        }}>
          {name} - {count} blessure(s)
        </div>
          );
        })()
      )}
    </div>
  );
};

export default HumanBody;