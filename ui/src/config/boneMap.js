// src/config/boneNameMap.js
// On NE manipule que des noms (strings) envoyés par le LUA.

const NAME_TO_PART = {
  // 🧠 Tête & Cou
  "tête": "head",
  "tete": "head",
  "cou": "head",
  "mâchoire": "head",
  "machoire": "head",
  "nez": "head",
  "œil gauche": "head",
  "oeil gauche": "head",
  "œil droit": "head",
  "oeil droit": "head",
  "oreille gauche": "head",
  "oreille droite": "head",

  // 🫀 Torse / Dos
  "haut du torse": "chest",
  "milieu du torse": "chest",
  "bas du torse": "chest",
  "colonne vertébrale (haute)": "chest",
  "colonne vertébrale (milieu)": "chest",
  "colonne vertébrale (basse)": "chest",
  "poitrine gauche": "chest",
  "poitrine droite": "chest",
  "abdomen": "abdomen",
  "centre du torse": "chest",
  "bassin": "abdomen", // tu peux le passer en leftLeg/rightLeg si tu préfères
  "base du dos": "abdomen",

  // 💪 Bras gauche
  "clavicule gauche": "leftArm",
  "épaule gauche": "leftArm",
  "epaule gauche": "leftArm",
  "bras gauche": "leftArm",
  "coude gauche": "leftArm",
  "avant-bras gauche": "leftArm",
  "avant bras gauche": "leftArm",
  "poignet gauche": "leftArm",
  "main gauche": "leftArm",
  "doigt pouce gauche": "leftArm",
  "doigt index gauche": "leftArm",
  "doigt majeur gauche": "leftArm",
  "doigt annulaire gauche": "leftArm",
  "doigt auriculaire gauche": "leftArm",

  // 💪 Bras droit
  "clavicule droite": "rightArm",
  "épaule droite": "rightArm",
  "epaule droite": "rightArm",
  "bras droit": "rightArm",
  "coude droit": "rightArm",
  "avant-bras droit": "rightArm",
  "avant bras droit": "rightArm",
  "poignet droit": "rightArm",
  "main droite": "rightArm",
  "doigt pouce droit": "rightArm",
  "doigt index droit": "rightArm",
  "doigt majeur droit": "rightArm",
  "doigt annulaire droit": "rightArm",
  "doigt auriculaire droit": "rightArm",

  // 🦵 Jambe gauche
  "hanche gauche": "leftLeg",
  "cuisse gauche": "leftLeg",
  "genou gauche": "leftLeg",
  "tibia gauche": "leftLeg",
  "cheville gauche": "leftLeg",
  "pied gauche": "leftLeg",
  "orteils gauche": "leftLeg",

  // 🦵 Jambe droite
  "hanche droite": "rightLeg",
  "cuisse droite": "rightLeg",
  "genou droit": "rightLeg",
  "tibia droit": "rightLeg",
  "cheville droite": "rightLeg",
  "pied droit": "rightLeg",
  "orteils droit": "rightLeg",

  // 🦴 Général
  "corps entier": "fullBody",
  "colonne cervicale": "head",
};

// Petit helper de normalisation (accents, majuscules…)
function normalizeName(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .normalize("NFD") // vire les accents
    .replace(/[\u0300-\u036f]/g, "");
}

// Résout un nom → { key, cleanLabel }
export function resolveBoneName(boneName) {
  if (!boneName) {
    return { key: "fullBody", cleanLabel: "Corps entier" };
  }

  const raw = String(boneName).trim();
  const norm = normalizeName(raw);
  const key = NAME_TO_PART[norm] || "fullBody";

  return { key, cleanLabel: raw }; // on garde le label exact pour l'affichage
}
