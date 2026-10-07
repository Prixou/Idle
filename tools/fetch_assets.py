#!/usr/bin/env python3
"""Télécharge les données et sprites PokeAPI utilisés par le jeu.

Usage : python3 tools/fetch_assets.py [dernier_numero_pokedex]   (défaut : 1025, générations 1 à 9)

Nécessite Pillow (pip install pillow) pour mesurer les sprites.

Génère :
  src/pokedex-data.js                    noms FR, rareté, stade d'évolution, génération, cadre du sprite
  assets/sprites/pokemon/<n>.png         sprite normal
  assets/sprites/pokemon/shiny/<n>.png   sprite chromatique (si disponible)
  assets/sprites/items/<item>.png        Balls et objets
"""
import json
import os
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_URL = 'https://raw.githubusercontent.com/PokeAPI/api-data/master/data/api/v2/pokemon-species/{}/index.json'
SPRITES = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/'
ITEMS = [
    'poke-ball', 'great-ball', 'ultra-ball', 'quick-ball', 'luxury-ball', 'dusk-ball', 'master-ball',
    'x-attack', 'dire-hit', 'amulet-coin', 'muscle-band',
]
GENERATIONS = {
    'generation-i': 1, 'generation-ii': 2, 'generation-iii': 3, 'generation-iv': 4, 'generation-v': 5,
    'generation-vi': 6, 'generation-vii': 7, 'generation-viii': 8, 'generation-ix': 9,
}
UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'


def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=30) as res:
                return res.read()
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            if attempt == 3:
                raise
        except OSError:
            if attempt == 3:
                raise


def save(path, data):
    path = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'wb') as f:
        f.write(data)


def rarity(species):
    if species['is_legendary'] or species['is_mythical']:
        return 'legendary'
    rate = species['capture_rate']
    if rate >= 150:
        return 'common'
    if rate >= 75:
        return 'uncommon'
    return 'rare'


def species_id(url):
    return int(url.rstrip('/').split('/')[-1])


def download_sprites(n):
    """Retourne True si le sprite chromatique existe."""
    normal = get(SPRITES + 'pokemon/%d.png' % n)
    if normal is None:
        raise RuntimeError('sprite manquant pour le n° %d' % n)
    save('assets/sprites/pokemon/%d.png' % n, normal)
    shiny = get(SPRITES + 'pokemon/shiny/%d.png' % n)
    if shiny is not None:
        save('assets/sprites/pokemon/shiny/%d.png' % n, shiny)
    return shiny is not None


def sprite_box(n):
    """Cadre [x0, y0, x1, y1] du contenu non transparent du sprite (dans l'image 96x96)."""
    with Image.open(os.path.join(ROOT, 'assets/sprites/pokemon/%d.png' % n)) as im:
        return list(im.convert('RGBA').getbbox())


def main():
    last = int(sys.argv[1]) if len(sys.argv) > 1 else 1025
    numbers = range(1, last + 1)
    with ThreadPoolExecutor(16) as pool:
        species = dict(zip(numbers, pool.map(lambda n: json.loads(get(DATA_URL.format(n))), numbers)))
    print('données : %d espèces' % len(species))

    def stage(n):
        parent = species[n]['evolves_from_species']
        if not parent:
            return 1
        pid = species_id(parent['url'])
        # Bébés (Pichu, Toudoudou…) et pré-évolutions hors plage : l'espèce compte comme base
        if pid not in species or species[pid]['is_baby']:
            return 1
        return 1 + stage(pid)

    with ThreadPoolExecutor(16) as pool:
        has_shiny = dict(zip(numbers, pool.map(download_sprites, numbers)))
    missing = [n for n, ok in has_shiny.items() if not ok]
    print('sprites : %d (sans chromatique : %s)' % (len(has_shiny), missing or 'aucun'))

    rows = []
    for n, s in species.items():
        name = next(x['name'] for x in s['names'] if x['language']['name'] == 'fr')
        row = [n, name, rarity(s), stage(n), GENERATIONS[s['generation']['name']], sprite_box(n)]
        if not has_shiny[n]:
            row.append(0)  # pas de sprite chromatique : le jeu réutilise le sprite normal
        rows.append('  ' + json.dumps(row, ensure_ascii=False) + ',')

    js = (
        '/* Généré par tools/fetch_assets.py — données PokeAPI. Ne pas modifier à la main. */\n'
        '// [numéro Pokédex, nom FR, rareté, stade d\'évolution, génération, cadre du sprite [x0, y0, x1, y1],\n'
        '//  (0 = pas de sprite chromatique)]\n'
        'window.POKEDEX_DATA = [\n' + '\n'.join(rows) + '\n];\n'
    )
    save('src/pokedex-data.js', js.encode('utf-8'))

    for item in ITEMS:
        save('assets/sprites/items/%s.png' % item, get(SPRITES + 'items/%s.png' % item))

    print('OK : %d Pokémon, %d objets' % (len(species), len(ITEMS)))


if __name__ == '__main__':
    main()
