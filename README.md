# Pokémon Tycoon

Jeu idle / clicker tycoon mobile-first au style pixel art rétro Pokémon.

## Jouer

Aucune installation : ouvrez `index.html` dans un navigateur.

Ou avec un petit serveur local :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

## Mécaniques

- **Clic** : tapez le Pokémon sauvage pour lui retirer des PV. À 0 PV il est attrapé
  et rapporte des Pokédollars (₽) selon sa rareté (commun, peu commun, rare, légendaire).
- **Zones** : toutes les 15 captures, la zone augmente → Pokémon plus résistants, meilleures récompenses.
- **Générateurs** (production passive, prix x1.15 par achat, achat x1 / x10 / MAX) :
  Piège Simple → Pokéball → Superball → Ultra Ball.
- **Upgrades** :
  - Dégâts : plus de dégâts par clic
  - Critiques : +10% de chance de critique (x3) par niveau, max 5
  - Boost Génération : +10% de production par niveau
- **Stats** : statistiques détaillées, Pokédex, sauvegarde manuelle / réinitialisation.
- Sauvegarde automatique dans `localStorage` (toutes les 5 s et à la fermeture),
  gains hors-ligne jusqu'à 8 h.

## Structure

```
index.html        page du jeu
src/config.js     constantes : Pokémon, raretés, générateurs, upgrades, équilibrage
src/game.js       logique : état, sauvegarde, économie, game loop 60 fps
src/ui.js         rendu de l'UI, onglets, animations, formatage des nombres
styles/main.css   design pixel art (police Press Start 2P)
assets/           futurs sprites pixel art
```

Les scripts sont des scripts classiques (pas de modules ES) pour que le jeu
fonctionne aussi en ouvrant directement le fichier (`file://`).
