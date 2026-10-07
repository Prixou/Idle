# assets/

```
sprites/pokemon/<n>.png         sprite 96x96 du Pokémon n° n (PokeAPI)
sprites/pokemon/shiny/<n>.png   version chromatique
sprites/items/<item>.png        Balls et objets 30x30 (icônes des générateurs et upgrades)
icons/                          icônes de l'appli (PWA, écran d'accueil)
```

Les sprites viennent de [PokeAPI/sprites](https://github.com/PokeAPI/sprites)
(© The Pokémon Company, usage personnel). Pour les retélécharger ou ajouter une génération :

```bash
python3 tools/fetch_assets.py 251   # Pokédex jusqu'au n° 251
```

Pensez à mettre `POKEDEX_SIZE` à jour dans `sw.js` si vous changez la taille du Pokédex.
Les sprites s'affichent avec `image-rendering: pixelated` pour garder des pixels nets.
