# Portfolio — Redouane Skouti

Portfolio personnel construit avec React, Vite et CSS personnalisé.

## Prérequis
- Node.js récent (Node 20+ recommandé)
- npm

## Installation
```bash
npm install
npm run dev
```
Ouvrir l'URL locale affichée par Vite (généralement http://localhost:5173).

## Vérifier la version de production
```bash
npm run build
npm run preview
```

## Personnalisation
- `src/data/portfolio.js` : coordonnées, compétences, projets et parcours.
- `src/App.jsx` : composants et structure de la page.
- `src/styles.css` : couleurs, responsive et styles.
- `index.html` : titre et description SEO.

## Avant publication
1. Vérifier que les descriptions de projets reflètent les fonctionnalités réellement terminées.
2. Remplacer les liens GitHub génériques des projets par les URL exactes de chaque dépôt.
3. Ajouter le vrai lien LinkedIn dans `src/data/portfolio.js` si tu en as un.
4. Ajouter un CV PDF dans `public/cv-redouane-skouti.pdf` si tu veux proposer un bouton de téléchargement.
5. Remplacer le lien de démonstration par l'URL exacte du projet déployé si elle change.
