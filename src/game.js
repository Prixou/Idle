/**
 * Pokémon Tycoon — logique du jeu : état, sauvegarde, économie, game loop.
 */
(function () {
  'use strict';

  const { GAME, RARITIES, POKEMON, POKEMON_BY_ID, GENERATORS, UPGRADES, UPGRADES_BY_ID } = window.CONFIG;
  const UI = window.UI;

  const Game = {
    state: null,
    derived: { damage: 1, critChance: 0, prodMult: 1, pps: 0, genProd: {} },
    catching: false,
    buyMode: 1, // 1, 10 ou 'max'
  };

  /* ------------------------------------------------------------------ */
  /* État & sauvegarde                                                   */
  /* ------------------------------------------------------------------ */

  function defaultState() {
    const now = Date.now();
    return {
      version: GAME.SAVE_VERSION,
      coins: 0,
      totalEarned: 0,
      totalCaught: 0,
      totalClicks: 0,
      totalCrits: 0,
      totalDamage: 0,
      playTime: 0,
      generators: Object.fromEntries(GENERATORS.map((g) => [g.id, 0])),
      upgrades: Object.fromEntries(UPGRADES.map((u) => [u.id, 0])),
      pokedex: {},
      wild: null,
      lastSave: now,
      createdAt: now,
    };
  }

  // Lecture défensive : une sauvegarde corrompue ne doit jamais casser le jeu.
  function num(v, fallback = 0) {
    return typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : fallback;
  }
  function int(v) {
    return Math.floor(num(v));
  }

  function load() {
    const state = defaultState();
    let raw = null;
    try {
      raw = JSON.parse(localStorage.getItem(GAME.SAVE_KEY));
    } catch (e) {
      raw = null;
    }
    if (!raw || typeof raw !== 'object') return state;

    for (const key of ['coins', 'totalEarned', 'totalDamage', 'playTime']) state[key] = num(raw[key]);
    for (const key of ['totalCaught', 'totalClicks', 'totalCrits']) state[key] = int(raw[key]);

    const gens = raw.generators || {};
    for (const g of GENERATORS) state.generators[g.id] = int(gens[g.id]);

    const ups = raw.upgrades || {};
    for (const u of UPGRADES) {
      const lvl = int(ups[u.id]);
      state.upgrades[u.id] = u.maxLevel == null ? lvl : Math.min(lvl, u.maxLevel);
    }

    const dex = raw.pokedex || {};
    for (const p of POKEMON) {
      const count = int(dex[p.id]);
      if (count > 0) state.pokedex[p.id] = count;
    }

    const w = raw.wild;
    if (w && POKEMON_BY_ID[w.id] && num(w.maxHp) > 0) {
      const hp = num(w.hp);
      state.wild = { id: w.id, maxHp: w.maxHp, hp: hp > 0 ? Math.min(hp, w.maxHp) : w.maxHp };
    }

    state.lastSave = num(raw.lastSave, Date.now());
    state.createdAt = num(raw.createdAt, Date.now());
    return state;
  }

  function save() {
    Game.state.lastSave = Date.now();
    try {
      localStorage.setItem(GAME.SAVE_KEY, JSON.stringify(Game.state));
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ------------------------------------------------------------------ */
  /* Économie                                                            */
  /* ------------------------------------------------------------------ */

  function upgradeValue(id) {
    return UPGRADES_BY_ID[id].value(Game.state.upgrades[id]);
  }

  // Recalcule les valeurs dérivées après chaque achat.
  function recalc() {
    const s = Game.state;
    const d = Game.derived;
    d.damage = upgradeValue('damage');
    d.critChance = upgradeValue('crit');
    d.prodMult = upgradeValue('boost');
    d.pps = 0;
    for (const g of GENERATORS) {
      const prod = g.baseProd * s.generators[g.id] * d.prodMult;
      d.genProd[g.id] = prod;
      d.pps += prod;
    }
  }

  function addCoins(amount) {
    Game.state.coins += amount;
    Game.state.totalEarned += amount;
  }

  Game.zone = function () {
    return 1 + Math.floor(Game.state.totalCaught / GAME.CATCHES_PER_ZONE);
  };

  // Un générateur est visible si c'est le premier ou si le précédent a été acheté.
  Game.isGeneratorUnlocked = function (g) {
    const i = GENERATORS.indexOf(g);
    const s = Game.state;
    return i === 0 || s.generators[g.id] > 0 || s.generators[GENERATORS[i - 1].id] > 0;
  };

  // Coût de `qty` unités : somme géométrique base * r^owned * (r^qty - 1) / (r - 1)
  Game.generatorCost = function (g, qty) {
    const r = GAME.GENERATOR_COST_GROWTH;
    const owned = Game.state.generators[g.id];
    return Math.ceil(g.baseCost * Math.pow(r, owned) * (Math.pow(r, qty) - 1) / (r - 1));
  };

  Game.maxAffordable = function (g) {
    const r = GAME.GENERATOR_COST_GROWTH;
    const coins = Game.state.coins;
    const first = g.baseCost * Math.pow(r, Game.state.generators[g.id]);
    if (coins < first) return 0;
    let n = Math.floor(Math.log((coins * (r - 1)) / first + 1) / Math.log(r));
    while (n > 0 && Game.generatorCost(g, n) > coins) n--; // garde-fou flottants
    return n;
  };

  Game.buyQuantity = function (g) {
    if (Game.buyMode === 'max') return Math.max(1, Game.maxAffordable(g));
    return Game.buyMode;
  };

  Game.buyGenerator = function (id) {
    const g = GENERATORS.find((x) => x.id === id);
    if (!g || !Game.isGeneratorUnlocked(g)) return false;
    const qty = Game.buyQuantity(g);
    const cost = Game.generatorCost(g, qty);
    if (Game.state.coins < cost) return false;
    Game.state.coins -= cost;
    Game.state.generators[id] += qty;
    recalc();
    return true;
  };

  Game.isUpgradeMaxed = function (u) {
    return u.maxLevel != null && Game.state.upgrades[u.id] >= u.maxLevel;
  };

  Game.upgradeCost = function (u) {
    return Math.ceil(u.baseCost * Math.pow(u.costGrowth, Game.state.upgrades[u.id]));
  };

  Game.buyUpgrade = function (id) {
    const u = UPGRADES_BY_ID[id];
    if (!u || Game.isUpgradeMaxed(u)) return false;
    const cost = Game.upgradeCost(u);
    if (Game.state.coins < cost) return false;
    Game.state.coins -= cost;
    Game.state.upgrades[id] += 1;
    recalc();
    return true;
  };

  /* ------------------------------------------------------------------ */
  /* Pokémon sauvages & clic                                             */
  /* ------------------------------------------------------------------ */

  const RARITY_TOTAL = Object.values(RARITIES).reduce((sum, r) => sum + r.weight, 0);
  const POKEMON_BY_RARITY = {};
  for (const p of POKEMON) (POKEMON_BY_RARITY[p.rarity] = POKEMON_BY_RARITY[p.rarity] || []).push(p);

  function pickSpecies() {
    let roll = Math.random() * RARITY_TOTAL;
    let rarity = 'common';
    // Premier Pokémon toujours commun pour un départ en douceur
    if (Game.state.totalCaught === 0) roll = 0;
    for (const [key, r] of Object.entries(RARITIES)) {
      roll -= r.weight;
      if (roll < 0) {
        rarity = key;
        break;
      }
    }
    const pool = POKEMON_BY_RARITY[rarity];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function spawn() {
    const p = pickSpecies();
    const maxHp = Math.ceil(
      GAME.BASE_HP * RARITIES[p.rarity].hp * Math.pow(GAME.ZONE_HP_GROWTH, Game.zone() - 1)
    );
    Game.state.wild = { id: p.id, hp: maxHp, maxHp };
    UI.renderWild(true);
  }

  function catchReward(p) {
    const mult = RARITIES[p.rarity].reward;
    const base = GAME.BASE_REWARD * Math.pow(GAME.ZONE_REWARD_GROWTH, Game.zone() - 1);
    return (base + Game.derived.pps * GAME.CATCH_PROD_BONUS) * mult;
  }

  // x / y : coordonnées écran du clic (null pour le clavier)
  Game.attack = function (x, y) {
    const s = Game.state;
    if (Game.catching || !s.wild) return;
    const d = Game.derived;
    const crit = Math.random() < d.critChance;
    const dmg = d.damage * (crit ? GAME.CRIT_MULTIPLIER : 1);

    s.totalClicks++;
    if (crit) s.totalCrits++;
    s.totalDamage += dmg;
    s.wild.hp = Math.max(0, s.wild.hp - dmg);

    UI.showDamage(x, y, dmg, crit);
    UI.updateHp();
    if (s.wild.hp <= 0) catchWild();
    else UI.hitWild();
  };

  function catchWild() {
    const s = Game.state;
    const p = POKEMON_BY_ID[s.wild.id];
    const zoneBefore = Game.zone();
    const reward = catchReward(p);
    const isNew = !s.pokedex[p.id];

    Game.catching = true;
    s.pokedex[p.id] = (s.pokedex[p.id] || 0) + 1;
    s.totalCaught++;
    addCoins(reward);
    UI.playCatch(p, reward);

    if (isNew) UI.toast('Nouveau ! ' + p.name + ' ajouté au Pokédex', p.rarity === 'legendary' ? 'gold' : '');
    else if (p.rarity === 'legendary') UI.toast(p.name + ' légendaire attrapé !', 'gold');
    if (Game.zone() > zoneBefore) UI.toast('Zone ' + Game.zone() + ' atteinte ! Pokémon plus forts.', 'blue');

    setTimeout(() => {
      spawn();
      Game.catching = false;
    }, GAME.CATCH_ANIM_MS);
  }

  /* ------------------------------------------------------------------ */
  /* Game loop                                                           */
  /* ------------------------------------------------------------------ */

  let autosaveTimer = 0;
  let lastFrame = 0;

  function tick(dt) {
    const gain = Game.derived.pps * dt;
    if (gain > 0) addCoins(gain);
    // rAF est suspendu onglet caché : la production rattrape le retard,
    // mais on ne compte pas ce temps comme du temps de jeu.
    Game.state.playTime += Math.min(dt, 1);

    autosaveTimer += dt;
    if (autosaveTimer >= GAME.AUTOSAVE_INTERVAL) {
      autosaveTimer = 0;
      save();
    }
  }

  function frame(now) {
    const dt = lastFrame ? Math.min((now - lastFrame) / 1000, GAME.MAX_OFFLINE_SECONDS) : 0;
    lastFrame = now;
    tick(dt);
    UI.update(dt);
    requestAnimationFrame(frame);
  }

  function applyOfflineEarnings() {
    const elapsed = Math.min(
      Math.max(0, (Date.now() - Game.state.lastSave) / 1000),
      GAME.MAX_OFFLINE_SECONDS
    );
    const gain = Game.derived.pps * elapsed;
    if (elapsed > 10 && gain > 0) {
      addCoins(gain);
      UI.toast('Absent ' + UI.formatTime(elapsed) + ' : +' + UI.format(gain) + ' ₽', 'gold');
    }
  }

  /* ------------------------------------------------------------------ */
  /* API publique                                                        */
  /* ------------------------------------------------------------------ */

  Game.save = save;

  Game.reset = function () {
    try {
      localStorage.removeItem(GAME.SAVE_KEY);
    } catch (e) {
      /* stockage indisponible */
    }
    Game.state = defaultState();
    Game.catching = false;
    recalc();
    spawn();
    save();
    UI.refreshAll();
    UI.toast('Partie réinitialisée');
  };

  function init() {
    Game.state = load();
    recalc();
    UI.init(Game);
    if (Game.state.wild) UI.renderWild(false);
    else spawn();
    applyOfflineEarnings();
    save();

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') save();
    });
    window.addEventListener('pagehide', save);

    requestAnimationFrame(frame);
  }

  window.Game = Game;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
