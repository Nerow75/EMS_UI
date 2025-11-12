-- fxmanifest.lua
-- Déclaration du manifeste principal du script FiveM.
-- Définit les métadonnées, la version du moteur et les ressources utilisées.
-- Ce fichier informe le runtime FiveM sur la structure et le comportement du projet.

fx_version 'cerulean'     -- Version du framework FiveM (Cerulean = version stable et actuelle)
game 'gta5'               -- Indique le jeu ciblé (GTA V)
lua54 'yes'               -- Activation du support Lua 5.4

-- Informations descriptives sur la ressource
name 'ems-medical'        -- Nom technique de la ressource
author 'NRW'              -- Auteur ou organisation responsable du script
description 'EMS UI + back blessures' -- Brève description de la ressource
version '0.1.0'           -- Numéro de version du projet

-- Définition de l’interface NUI
-- Le fichier index.html est généré automatiquement par Vite lors du build
-- Le dossier "ui/dist" contient l’ensemble des fichiers front compilés
ui_page 'ui/dist/index.html'

-- Liste complète des fichiers à inclure dans la ressource
-- Ces fichiers sont requis pour le bon fonctionnement du front-end NUI
files {
  'ui/dist/index.html',   -- Point d’entrée HTML de l’interface
  'ui/dist/assets/**',    -- Fichiers JavaScript et CSS générés par Vite
  'ui/dist/media/**',     -- Ressources multimédias (images, sons, vidéos)
  'ui/dist/webfonts/**'   -- Polices et icônes web embarquées
}
