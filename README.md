# 🩺 Medical FiveM UI - Vite + React

Interface médicale moderne pour FiveM avec fenêtre superposée au jeu.

## 🎨 Couleurs du projet

```javascript
primary: "#22A7E8"    // Bleu
secondary: "#5E2CA5"  // Violet
accent: "#FFD400"     // Jaune/Étoile
```

## 🚀 Démarrage rapide

### Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## 📦 Scripts disponibles

```bash
npm run dev      # Lance le serveur de développement avec Vite
npm run build    # Crée un build de production
npm run preview  # Prévisualise le build de production
```

## 🎯 Caractéristiques

### Design fenêtre superposée
- ✅ **Fenêtre centrée** qui apparaît par-dessus le jeu (pas en fullscreen)
- ✅ **Bouton fermer (X)** en haut à droite
- ✅ **Touche ESC** pour fermer
- ✅ **Transparent autour** de la fenêtre pour voir le jeu
- ✅ **Arrière-plan semi-transparent** avec effet blur

### Interface médicale
- ✅ Corps humain SVG interactif
- ✅ 7 parties du corps cliquables
- ✅ Panneau de détails des blessures
- ✅ 4 niveaux de gravité avec code couleur
- ✅ Animations fluides

## 📁 Structure du projet

```
src/
├── MedicalUI.jsx    # Composant principal avec toute la logique
├── App.jsx          # Point d'entrée
├── main.jsx         # Initialisation React + Vite
└── index.css        # Styles globaux
```

## 🔧 Modification des données

Pour changer les blessures affichées, éditez l'état `bodyParts` dans `src/MedicalUI.jsx` :

```javascript
const [bodyParts, setBodyParts] = useState({
  head: {
    name: "Tête",
    injuries: [
      { 
        type: "Contusion", 
        severity: "Légère", 
        description: "Coup léger à la tempe" 
      }
    ]
  },
  // ... autres parties
});
```

### Niveaux de gravité disponibles
- `"Légère"` - 🟡 Jaune
- `"Moyenne"` - 🟠 Orange
- `"Grave"` - 🔶 Orange foncé
- `"Critique"` - 🔴 Rouge

## 🔌 Intégration FiveM

### 1. Configuration Vite pour FiveM

Ajoutez dans `vite.config.js` :

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  }
})
```

### 2. Build pour production

```bash
npm run build
```

Les fichiers seront dans le dossier `dist/`

### 3. Structure de ressource FiveM

```
votre-ressource/
├── fxmanifest.lua
├── client/
│   └── client.lua
├── server/
│   └── server.lua
└── html/
    ├── index.html
    └── assets/
        ├── index-[hash].js
        └── index-[hash].css
```

### 4. fxmanifest.lua

```lua
fx_version 'cerulean'
game 'gta5'

author 'Votre Nom'
description 'Interface Médicale'
version '1.0.0'

client_scripts {
    'client/client.lua'
}

server_scripts {
    'server/server.lua'
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/assets/**/*'
}
```

### 5. Code client Lua

```lua
local isUIOpen = false

-- Ouvrir l'interface
function OpenMedicalUI(injuries)
    if not isUIOpen then
        isUIOpen = true
        SetNuiFocus(true, true)
        
        SendNUIMessage({
            action = "openUI",
            injuries = injuries
        })
    end
end

-- Fermer l'interface
function CloseMedicalUI()
    if isUIOpen then
        isUIOpen = false
        SetNuiFocus(false, false)
        
        SendNUIMessage({
            action = "closeUI"
        })
    end
end

-- Callback depuis l'UI
RegisterNUICallback('closeUI', function(data, cb)
    CloseMedicalUI()
    cb('ok')
end)

-- Commande de test
RegisterCommand('medical', function()
    OpenMedicalUI({
        head = { name = "Tête", injuries = { 
            { type = "Commotion", severity = "Grave", description = "Impact violent" }
        }},
        chest = { name = "Torse", injuries = {} },
        leftArm = { name = "Bras Gauche", injuries = {} },
        rightArm = { name = "Bras Droit", injuries = {} },
        abdomen = { name = "Abdomen", injuries = {} },
        leftLeg = { name = "Jambe Gauche", injuries = {} },
        rightLeg = { name = "Jambe Droite", injuries = {} }
    })
end)

-- Event pour ouvrir depuis le serveur
RegisterNetEvent('medical:openUI')
AddEventHandler('medical:openUI', function(injuries)
    OpenMedicalUI(injuries)
end)
```

## 🎮 Utilisation en jeu

```
/medical
```

ou depuis un autre script :

```lua
TriggerEvent('medical:openUI', injuries)
```

## 🔍 Format des données

```javascript
{
  head: {
    name: "Tête",
    injuries: [
      {
        type: "Nom de la blessure",
        severity: "Légère" | "Moyenne" | "Grave" | "Critique",
        description: "Description détaillée"
      }
    ]
  }
  // ... autres parties du corps
}
```

## 📝 Notes importantes

### Showcase mode
Par défaut, `isVisible` est à `true` dans `MedicalUI.jsx` pour le showcase.

Pour la production FiveM, changez :
```javascript
const [isVisible, setIsVisible] = useState(false); // false en prod
```

### Gestion de la fermeture
L'UI se ferme avec :
- Le bouton X en haut à droite
- La touche ESC
- Un callback NUI vers FiveM

### Pointer events
La fenêtre utilise `pointerEvents: 'none'` sur le conteneur parent pour permettre de cliquer à travers, sauf sur la fenêtre elle-même (`pointerEvents: 'all'`).

## 🎨 Personnalisation

### Changer la taille de la fenêtre

Dans `MedicalUI.jsx`, modifiez :
```javascript
maxWidth: '1200px',  // Largeur max
width: '90%',        // Largeur responsive
```

### Changer la position

La fenêtre est centrée par défaut avec `alignItems: 'center'` et `justifyContent: 'center'`.

Pour la positionner ailleurs :
```javascript
alignItems: 'flex-start',     // Haut
justifyContent: 'flex-end',   // Droite
```

## 🛠️ Technologies

- ⚡ **Vite** - Build tool ultra rapide
- ⚛️ **React 18** - Framework UI
- 🎨 **CSS-in-JS** - Styling inline
- 🖼️ **SVG** - Corps humain vectoriel

## 🐛 Débogage

### En développement
```bash
npm run dev
```
Ouvrez `http://localhost:5173` et utilisez F12 pour la console.

### En production FiveM
Utilisez `Ctrl + Shift + I` en jeu pour ouvrir les DevTools.

## 📄 License

Libre d'utilisation pour vos projets FiveM.

---

**Bon développement ! 🚀**
