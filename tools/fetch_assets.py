#!/usr/bin/env python3
"""Télécharge les données et sprites PokeAPI utilisés par le jeu.

Usage : python3 tools/fetch_assets.py [dernier_numero_pokedex]   (défaut : 151)

Génère :
  src/pokedex-data.js                    noms FR, rareté, stade d'évolution
  assets/sprites/pokemon/<n>.png         sprite normal
  assets/sprites/pokemon/shiny/<n>.png   sprite chromatique
  assets/sprites/items/<item>.png        Balls et objets
"""
import json
import os
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_URL = 'https://raw.githubusercontent.com/PokeAPI/api-data/master/data/api/v2/pokemon-species/{}/index.json'
SPRITES = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/'
ITEMS = [
    'poke-ball', 'great-ball', 'ultra-ball', 'quick-ball', 'luxury-ball', 'dusk-ball', 'master-ball',
    'x-attack', 'dire-hit', 'amulet-coin', 'muscle-band',
]
UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'


def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=30) as res:
        return res.read()


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


def main():
    last = int(sys.argv[1]) if len(sys.argv) > 1 else 151
    species = {}
    for n in range(1, last + 1):
        species[n] = json.loads(get(DATA_URL.format(n)))
        print('species', n, end='\r')

    def stage(n):
        parent = species[n]['evolves_from_species']
        # Pré-évolutions hors plage (ex. Pichu pour Pikachu) : l'espèce compte comme base
        if not parent or species_id(parent['url']) not in species:
            return 1
        return 1 + stage(species_id(parent['url']))

    rows = []
    for n, s in species.items():
        name = next(x['name'] for x in s['names'] if x['language']['name'] == 'fr')
        rows.append('  [%d, %s, %s, %d],' % (n, json.dumps(name, ensure_ascii=False), json.dumps(rarity(s)), stage(n)))

    js = (
        '/* Généré par tools/fetch_assets.py — données PokeAPI. Ne pas modifier à la main. */\n'
        '// [numéro Pokédex, nom FR, rareté, stade d\'évolution]\n'
        'window.POKEDEX_DATA = [\n' + '\n'.join(rows) + '\n];\n'
    )
    save('src/pokedex-data.js', js.encode('utf-8'))

    for n in species:
        save('assets/sprites/pokemon/%d.png' % n, get(SPRITES + 'pokemon/%d.png' % n))
        save('assets/sprites/pokemon/shiny/%d.png' % n, get(SPRITES + 'pokemon/shiny/%d.png' % n))
        print('sprite', n, end='\r')

    for item in ITEMS:
        save('assets/sprites/items/%s.png' % item, get(SPRITES + 'items/%s.png' % item))

    print('\nOK : %d Pokémon, %d objets' % (len(species), len(ITEMS)))


if __name__ == '__main__':
    main()
