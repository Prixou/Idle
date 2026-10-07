# assets/

Dossier réservé aux futurs sprites pixel art (Pokémon, Pokéballs, décors, icônes).

Pour l'instant le jeu utilise des emojis (`src/config.js` → champ `emoji` de chaque
Pokémon) et des Pokéballs dessinées en CSS (`styles/main.css` → `.ball`).

Convention suggérée :

```
assets/
  sprites/pokemon/<id>.png     # ex. pikachu.png (id défini dans src/config.js)
  sprites/balls/<id>.png       # ex. pokeball.png
  ui/                          # cadres, icônes d'onglets…
```

Pensez à `image-rendering: pixelated;` pour garder des pixels nets à l'agrandissement.
