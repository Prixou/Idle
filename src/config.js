/**
 * Pokémon Tycoon — configuration du jeu.
 * Toutes les constantes d'équilibrage sont ici : Pokémon, générateurs, upgrades.
 * Exposé globalement via window.CONFIG (scripts classiques pour que index.html
 * fonctionne aussi en ouvrant directement le fichier, sans serveur).
 */
(function () {
  'use strict';

  const GAME = {
    SAVE_KEY: 'pokemon-tycoon-save',
    SAVE_VERSION: 1,
    AUTOSAVE_INTERVAL: 5,            // secondes entre deux sauvegardes auto
    MAX_OFFLINE_SECONDS: 8 * 3600,   // gains hors-ligne plafonnés à 8h

    BASE_HP: 10,                     // PV d'un Pokémon commun en zone 1
    BASE_REWARD: 5,                  // ₽ d'un Pokémon commun en zone 1
    CATCHES_PER_ZONE: 15,            // captures nécessaires pour changer de zone
    ZONE_HP_GROWTH: 1.18,            // PV x1.18 par zone
    ZONE_REWARD_GROWTH: 1.2,         // récompense x1.2 par zone
    CATCH_PROD_BONUS: 2,             // chaque capture rapporte aussi N s de production

    CRIT_MULTIPLIER: 3,
    CATCH_ANIM_MS: 700,              // durée de l'animation de capture
    GENERATOR_COST_GROWTH: 1.15,     // prix x1.15 à chaque achat
  };

  // hp / reward : multiplicateurs appliqués aux valeurs de base
  const RARITIES = {
    common:    { label: 'COMMUN',  weight: 62, hp: 1,   reward: 1 },
    uncommon:  { label: 'PEU COM', weight: 26, hp: 2.5, reward: 3 },
    rare:      { label: 'RARE',    weight: 10, hp: 6,   reward: 9 },
    legendary: { label: 'LÉGEND.', weight: 2,  hp: 20,  reward: 50 },
  };

  // Emojis en attendant les sprites pixel art (voir assets/)
  const POKEMON = [
    { id: 'rattata',    name: 'Rattata',    emoji: '🐀', rarity: 'common' },
    { id: 'roucool',    name: 'Roucool',    emoji: '🐦', rarity: 'common' },
    { id: 'chenipan',   name: 'Chenipan',   emoji: '🐛', rarity: 'common' },
    { id: 'aspicot',    name: 'Aspicot',    emoji: '🐝', rarity: 'common' },
    { id: 'magicarpe',  name: 'Magicarpe',  emoji: '🐟', rarity: 'common' },
    { id: 'nosferapti', name: 'Nosferapti', emoji: '🦇', rarity: 'common' },
    { id: 'abo',        name: 'Abo',        emoji: '🐍', rarity: 'common' },
    { id: 'piafabec',   name: 'Piafabec',   emoji: '🐤', rarity: 'common' },

    { id: 'pikachu',    name: 'Pikachu',    emoji: '🐭', rarity: 'uncommon' },
    { id: 'salameche',  name: 'Salamèche',  emoji: '🦎', rarity: 'uncommon' },
    { id: 'carapuce',   name: 'Carapuce',   emoji: '🐢', rarity: 'uncommon' },
    { id: 'bulbizarre', name: 'Bulbizarre', emoji: '🐸', rarity: 'uncommon' },
    { id: 'psykokwak',  name: 'Psykokwak',  emoji: '🦆', rarity: 'uncommon' },
    { id: 'miaouss',    name: 'Miaouss',    emoji: '😼', rarity: 'uncommon' },
    { id: 'ponyta',     name: 'Ponyta',     emoji: '🐴', rarity: 'uncommon' },
    { id: 'tentacool',  name: 'Tentacool',  emoji: '🦑', rarity: 'uncommon' },

    { id: 'evoli',      name: 'Évoli',      emoji: '🦊', rarity: 'rare' },
    { id: 'ronflex',    name: 'Ronflex',    emoji: '😴', rarity: 'rare' },
    { id: 'lokhlass',   name: 'Lokhlass',   emoji: '🦕', rarity: 'rare' },
    { id: 'dracaufeu',  name: 'Dracaufeu',  emoji: '🐉', rarity: 'rare' },
    { id: 'rondoudou',  name: 'Rondoudou',  emoji: '🎈', rarity: 'rare' },

    { id: 'artikodin',  name: 'Artikodin',  emoji: '❄️', rarity: 'legendary' },
    { id: 'electhor',   name: 'Électhor',   emoji: '⚡', rarity: 'legendary' },
    { id: 'mewtwo',     name: 'Mewtwo',     emoji: '🔮', rarity: 'legendary' },
  ];

  // ball : variante d'icône Pokéball dessinée en CSS (sinon icon emoji)
  const GENERATORS = [
    {
      id: 'trap', name: 'Piège Simple', icon: '🪤',
      desc: 'Un piège rudimentaire dans les hautes herbes.',
      baseCost: 15, baseProd: 0.2,
    },
    {
      id: 'pokeball', name: 'Pokéball', ball: 'poke',
      desc: 'Le classique. Fiable et pas cher.',
      baseCost: 100, baseProd: 1,
    },
    {
      id: 'superball', name: 'Superball', ball: 'super',
      desc: 'Meilleur taux de capture.',
      baseCost: 1100, baseProd: 8,
    },
    {
      id: 'ultraball', name: 'Ultra Ball', ball: 'ultra',
      desc: 'Haute performance pour pros.',
      baseCost: 12000, baseProd: 47,
    },
  ];

  // value(level) : effet de l'upgrade au niveau donné. maxLevel null = illimité.
  const UPGRADES = [
    {
      id: 'damage', name: 'Dégâts', icon: '⚔️',
      desc: 'Frappe plus fort à chaque clic.',
      baseCost: 25, costGrowth: 1.9, maxLevel: null,
      value: (lvl) => Math.floor((1 + lvl) * Math.pow(1.15, lvl)),
      format: (v) => v + ' dmg',
    },
    {
      id: 'crit', name: 'Critiques', icon: '💥',
      desc: '+10% de chance de coup critique (x' + GAME.CRIT_MULTIPLIER + ').',
      baseCost: 150, costGrowth: 4, maxLevel: 5,
      value: (lvl) => lvl * 0.1,
      format: (v) => Math.round(v * 100) + '%',
    },
    {
      id: 'boost', name: 'Boost Génération', icon: '📈',
      desc: '+10% de production des générateurs.',
      baseCost: 500, costGrowth: 2.2, maxLevel: null,
      value: (lvl) => 1 + lvl * 0.1,
      format: (v) => 'x' + v.toFixed(1),
    },
  ];

  const byId = (list) => Object.fromEntries(list.map((item) => [item.id, item]));

  window.CONFIG = {
    GAME,
    RARITIES,
    POKEMON,
    POKEMON_BY_ID: byId(POKEMON),
    GENERATORS,
    UPGRADES,
    UPGRADES_BY_ID: byId(UPGRADES),
  };
})();
