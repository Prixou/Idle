# Pokémon Tycoon

Jeu idle / clicker tycoon mobile-first au style pixel art rétro Pokémon.
Projet personnel non officiel, non affilié à Nintendo, Game Freak ou The Pokémon Company.
Sprites : [PokeAPI/sprites](https://github.com/PokeAPI/sprites) (© The Pokémon Company).

## Jouer

Ouvrez `index.html` dans un navigateur, ou lancez un serveur local
(nécessaire pour installer le jeu comme une appli et y jouer hors ligne) :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

## Mécaniques

- **Clic** : tapez le Pokémon sauvage pour lui retirer des PV. À 0 PV il est attrapé
  et rapporte des ₽ selon sa rareté, plus 1 s de production.
- **1025 Pokémon** (générations 1 à 9) répartis en 9 régions débloquées par zone :
  Kanto (1), Johto (10), Hoenn (20), Sinnoh (30), Unys (40), Kalos (50), Alola (60),
  Galar (70), Paldea (80). Dans chaque région, les évolutions apparaissent 3 (stade 2)
  et 7 zones (stade 3) plus tard, les légendaires 11 zones plus tard.
- **Zones** : toutes les 15 captures → PV x1.25, récompenses x1.2.
- **Pokédex** : +1% de production et de récompenses par espèce, +1% par espèce chromatique.
  Consultable région par région dans l'onglet Stats.
- **Chromatiques** : 1 chance sur 512, récompense x5.
- **Générateurs** : 8 Balls, du Piège Simple à la Master Ball (prix x1.15, achat x1 / x10 / MAX).
  Production x2 aux paliers 25, 50, 100, 150… exemplaires.
- **Upgrades** : Dégâts, Critiques (+10% par niveau, x3), Boost Génération (x1.25 par niveau),
  Clic Productif (+1% de la production ajouté aux dégâts de chaque clic).
- **Leveinard errant** : traverse l'écran toutes les 3 à 8 min. Tapez-le avant qu'il ne s'enfuie :
  Fortune (₽ instantanés), Frénésie (production x7, 77 s), Aura Chroma (chromatiques x20, 60 s)
  ou Clic Frénétique (clics x777, 13 s).
- **Sauvegarde** : automatique (localStorage), gains hors-ligne jusqu'à 8 h,
  export / import en texte (onglet Stats).
- **PWA** : installable et jouable hors ligne (service worker, servi en http/https).

## Structure

```
index.html            page du jeu
manifest.webmanifest  manifeste PWA
sw.js                 service worker (hors ligne)
src/pokedex-data.js   1025 Pokémon (généré par tools/fetch_assets.py)
src/config.js         constantes : raretés, générateurs, upgrades, événements, équilibrage
src/game.js           logique : état, sauvegarde et migration, économie, game loop
src/ui.js             rendu de l'UI, onglets, animations, formatage des nombres
styles/main.css       design pixel art (police Press Start 2P intégrée)
assets/               sprites PokeAPI et icônes de l'appli
tools/fetch_assets.py retélécharge données et sprites depuis PokeAPI
```

## Feuille de route

Voir `reports/` pour l'étude complète. Prochaines étapes envisagées :

- **Prestige « Ligue »** : arènes toutes les 5 zones, 8 badges, puis reset contre un bonus permanent
  (la progression ralentit nettement après 2 à 4 h de jeu : c'est là qu'il doit intervenir).
- Équipe de 6 Pokémon qui attaque seule, succès, missions et cadeau quotidien.
- Évolutions par bonbons, types et zones typées, œufs.
- **Plus tard (pas prioritaire)** : son 8-bit avec [ZzFX](https://github.com/KilledByAPixel/ZzFX)
  et vibrations sur Android.
