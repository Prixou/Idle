# assets/

```
sprites/pokemon/<n>.png         sprite 96x96 du Pokémon n° n (PokeAPI)
sprites/pokemon/shiny/<n>.png   version chromatique
sprites/items/<item>.png        Balls et objets 30x30 (icônes des générateurs et upgrades)
icons/                          icônes de l'appli (PWA, écran d'accueil)
```

Les sprites viennent de [PokeAPI/sprites](https://github.com/PokeAPI/sprites)
(© The Pokémon Company, usage personnel). Pour les retélécharger (ou ajouter une
future génération : ajouter aussi la région dans `REGIONS` de `src/config.js`) :

```bash
python3 tools/fetch_assets.py        # Pokédex complet, n° 1 à 1025
```
Les sprites s'affichent avec `image-rendering: pixelated` pour garder des pixels nets.
