/**
 * Pokémon Tycoon — service worker (jeu installable et jouable hors ligne).
 * - Code (HTML/JS/CSS) : réseau d'abord, cache en secours → les mises à jour
 *   arrivent sans changer de version.
 * - assets/ (sprites, icônes) : cache d'abord, mis en cache au premier affichage.
 * Changer CACHE pour forcer le re-téléchargement de tous les assets.
 */
const CACHE = 'pokemon-tycoon-v3';
const ITEMS = [
  'poke-ball', 'great-ball', 'ultra-ball', 'quick-ball', 'luxury-ball', 'dusk-ball', 'master-ball',
  'x-attack', 'dire-hit', 'amulet-coin', 'muscle-band',
];

const PRECACHE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'styles/main.css',
  'src/pokedex-data.js',
  'src/config.js',
  'src/ui.js',
  'src/game.js',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  ...ITEMS.map((item) => 'assets/sprites/items/' + item + '.png'),
];
// Les sprites de Pokémon ne bloquent pas l'installation : le jeu demande ensuite
// (message « warm ») de télécharger en arrière-plan les sprites normaux manquants.
// Les chromatiques sont mis en cache à leur premier affichage.

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (url.pathname.includes('/assets/')) {
    event.respondWith(caches.match(request).then((cached) => cached || fetchAndCache(request)));
  } else {
    event.respondWith(
      fetchAndCache(request).catch(() =>
        caches.match(request, { ignoreSearch: true })
          .then((cached) => cached || (request.mode === 'navigate' ? caches.match('index.html') : Response.error()))
      )
    );
  }
});

function fetchAndCache(request) {
  return fetch(request).then((response) => {
    if (response.ok) {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(request, copy));
    }
    return response;
  });
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'warm') event.waitUntil(warmSprites(event.data.count));
});

async function warmSprites(count) {
  const cache = await caches.open(CACHE);
  const missing = [];
  for (let n = 1; n <= count; n++) {
    const url = 'assets/sprites/pokemon/' + n + '.png';
    if (!(await cache.match(url))) missing.push(url);
  }
  for (let i = 0; i < missing.length; i += 25) {
    await Promise.all(missing.slice(i, i + 25).map((url) => cache.add(url).catch(() => {})));
  }
}
