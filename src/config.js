/**
 * Pokémon Tycoon — configuration du jeu.
 * Toutes les constantes d'équilibrage sont ici : Pokémon, générateurs, upgrades,
 * événements. Exposé globalement via window.CONFIG (scripts classiques pour que
 * index.html fonctionne aussi en ouvrant directement le fichier, sans serveur).
 */
(function () {
  'use strict';

  const GAME = {
    SAVE_KEY: 'pokemon-tycoon-save',
    SAVE_VERSION: 2,
    EXPORT_PREFIX: 'PKTY2:',
    AUTOSAVE_INTERVAL: 5,            // secondes entre deux sauvegardes auto
    MAX_OFFLINE_SECONDS: 8 * 3600,   // gains hors-ligne plafonnés à 8h

    BASE_HP: 10,                     // PV d'un Pokémon commun en zone 1
    BASE_REWARD: 5,                  // ₽ d'un Pokémon commun en zone 1
    CATCHES_PER_ZONE: 15,            // captures nécessaires pour changer de zone
    ZONE_HP_GROWTH: 1.25,            // PV x1.25 par zone
    ZONE_REWARD_GROWTH: 1.2,         // récompense x1.2 par zone
    CATCH_PROD_BONUS: 1,             // chaque capture rapporte aussi N s de production

    CRIT_MULTIPLIER: 3,
    CATCH_ANIM_MS: 700,              // durée de l'animation de capture
    CATCH_ANIM_FAST_MS: 250,         // pendant un Clic Frénétique

    GENERATOR_COST_GROWTH: 1.15,     // prix x1.15 à chaque achat
    GEN_MILESTONES: [25, 50, 100, 150, 200, 250, 300, 400, 500], // production x2 à chaque palier

    SHINY_CHANCE: 1 / 512,
    SHINY_REWARD_MULT: 5,

    DEX_BONUS_PER_SPECIES: 0.02,     // +2% production et récompenses par espèce capturée
    DEX_BONUS_PER_SHINY: 0.01,       // +1% de plus par espèce capturée en chromatique

    // Zone d'apparition minimale selon le stade d'évolution
    STAGE_MIN_ZONE: { 1: 1, 2: 4, 3: 8 },
    LEGENDARY_MIN_ZONE: 12,

    PERSIST_AFTER_CATCHES: 25,       // demande de stockage persistant après N captures
  };

  // hp / reward : multiplicateurs appliqués aux valeurs de base
  const RARITIES = {
    common:    { label: 'COMMUN',  weight: 55, hp: 1,   reward: 1 },
    uncommon:  { label: 'PEU COM', weight: 28, hp: 2.5, reward: 3 },
    rare:      { label: 'RARE',    weight: 15, hp: 6,   reward: 9 },
    legendary: { label: 'LÉGEND.', weight: 2,  hp: 20,  reward: 50 },
  };

  const SPRITES = 'assets/sprites/';
  const itemSprite = (item) => SPRITES + 'items/' + item + '.png';

  // Données générées par tools/fetch_assets.py (src/pokedex-data.js)
  const POKEMON = window.POKEDEX_DATA.map(([id, name, rarity, stage]) => ({
    id,
    name,
    rarity,
    stage,
    minZone: rarity === 'legendary' ? GAME.LEGENDARY_MIN_ZONE : GAME.STAGE_MIN_ZONE[stage] || 1,
    sprite: SPRITES + 'pokemon/' + id + '.png',
    shinySprite: SPRITES + 'pokemon/shiny/' + id + '.png',
  }));

  // Ratios coût / production inspirés des bâtiments de Cookie Clicker
  const GENERATORS = [
    { id: 'trap', name: 'Piège Simple', icon: '🪤',
      desc: 'Un piège rudimentaire dans les hautes herbes.', baseCost: 15, baseProd: 0.2 },
    { id: 'pokeball', name: 'Pokéball', sprite: itemSprite('poke-ball'),
      desc: 'Le classique. Fiable et pas cher.', baseCost: 100, baseProd: 1 },
    { id: 'superball', name: 'Superball', sprite: itemSprite('great-ball'),
      desc: 'Meilleur taux de capture.', baseCost: 1100, baseProd: 8 },
    { id: 'ultraball', name: 'Ultra Ball', sprite: itemSprite('ultra-ball'),
      desc: 'Haute performance pour pros.', baseCost: 12000, baseProd: 47 },
    { id: 'rapideball', name: 'Rapide Ball', sprite: itemSprite('quick-ball'),
      desc: 'Capture en un éclair.', baseCost: 130000, baseProd: 260 },
    { id: 'luxeball', name: 'Luxe Ball', sprite: itemSprite('luxury-ball'),
      desc: 'Si confortable que les Pokémon ramènent leurs amis.', baseCost: 1.4e6, baseProd: 1400 },
    { id: 'sombreball', name: 'Sombre Ball', sprite: itemSprite('dusk-ball'),
      desc: 'Redoutable la nuit et dans les grottes.', baseCost: 2e7, baseProd: 7800 },
    { id: 'masterball', name: 'Master Ball', sprite: itemSprite('master-ball'),
      desc: 'Ne rate jamais. Jamais.', baseCost: 3.3e8, baseProd: 44000 },
  ];

  // value(level) : effet de l'upgrade au niveau donné. maxLevel null = illimité.
  const UPGRADES = [
    {
      id: 'damage', name: 'Dégâts', sprite: itemSprite('x-attack'),
      desc: 'Frappe plus fort à chaque clic.',
      baseCost: 25, costGrowth: 2.2, maxLevel: null,
      value: (lvl) => Math.floor((1 + lvl) * Math.pow(1.4, lvl)),
      format: (v) => v + ' dmg',
    },
    {
      id: 'crit', name: 'Critiques', sprite: itemSprite('dire-hit'),
      desc: '+10% de chance de coup critique (x' + GAME.CRIT_MULTIPLIER + ').',
      baseCost: 150, costGrowth: 4, maxLevel: 5,
      value: (lvl) => lvl * 0.1,
      format: (v) => Math.round(v * 100) + '%',
    },
    {
      id: 'boost', name: 'Boost Génération', sprite: itemSprite('amulet-coin'),
      desc: 'x1.25 sur la production de tous les générateurs.',
      baseCost: 1000, costGrowth: 6, maxLevel: null,
      value: (lvl) => Math.pow(1.25, lvl),
      format: (v) => 'x' + (v < 10 ? v.toFixed(2) : v.toFixed(0)),
    },
    {
      id: 'clickPps', name: 'Clic Productif', sprite: itemSprite('muscle-band'),
      desc: 'Chaque clic inflige aussi +1% de ta production en dégâts.',
      baseCost: 10000, costGrowth: 10, maxLevel: 5,
      value: (lvl) => lvl * 0.01,
      format: (v) => Math.round(v * 100) + '% prod',
    },
  ];

  // Bonus temporaires (déclenchés par le Pokémon errant)
  const BUFFS = {
    frenzy:      { label: 'FRÉNÉSIE',     mult: 7,   duration: 77, desc: 'Production x7' },
    shinyAura:   { label: 'AURA CHROMA',  mult: 20,  duration: 60, desc: 'Chromatiques x20' },
    clickFrenzy: { label: 'CLIC FRÉNÉT.', mult: 777, duration: 13, desc: 'Clics x777' },
  };

  // Pokémon errant façon « golden cookie » : à taper avant qu'il ne s'enfuie
  const ROAMER = {
    id: 113,                         // Leveinard
    name: 'Leveinard',
    firstDelay: [45, 90],            // secondes avant la première apparition
    delay: [180, 480],               // puis toutes les 3 à 8 minutes de jeu
    visible: 13,                     // secondes avant qu'il ne s'enfuie
    fortuneBankShare: 0.15,          // Fortune : min(15% de la banque, 15 min de prod)
    fortuneProdSeconds: 900,
    fortuneMinCatches: 20,           //   + 20 récompenses de capture de la zone
    effects: [
      { type: 'fortune', weight: 40 },
      { type: 'frenzy', weight: 40 },
      { type: 'shinyAura', weight: 12 },
      { type: 'clickFrenzy', weight: 8 },
    ],
  };

  const byId = (list) => Object.fromEntries(list.map((item) => [item.id, item]));

  window.CONFIG = {
    GAME,
    RARITIES,
    POKEMON,
    POKEMON_BY_ID: byId(POKEMON),
    GENERATORS,
    GENERATORS_BY_ID: byId(GENERATORS),
    UPGRADES,
    UPGRADES_BY_ID: byId(UPGRADES),
    BUFFS,
    ROAMER,
    roamerSprite: SPRITES + 'pokemon/' + ROAMER.id + '.png',
  };
})();
