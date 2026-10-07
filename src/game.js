/**
 * Pokémon Tycoon — logique du jeu : état, sauvegarde, économie, événements, game loop.
 */
(function () {
  'use strict';

  const {
    GAME, RARITIES, REGIONS, POKEMON, POKEMON_BY_ID, GENERATORS, GENERATORS_BY_ID,
    UPGRADES, UPGRADES_BY_ID, BUFFS, ROAMER,
  } = window.CONFIG;
  const UI = window.UI;

  const Game = {
    state: null,
    derived: {
      damage: 1, critChance: 0, prodMult: 1, dexMult: 1, clickPps: 0,
      basePps: 0, pps: 0, genMult: {}, genProd: {},
    },
    catching: false,
    roamer: null, // { timeLeft } quand Leveinard est à l'écran
    buyMode: 1,   // 1, 10 ou 'max'
  };

  /* ------------------------------------------------------------------ */
  /* État & sauvegarde                                                   */
  /* ------------------------------------------------------------------ */

  const randomBetween = ([min, max]) => min + Math.random() * (max - min);

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
      totalShinies: 0,
      roamersCaught: 0,
      playTime: 0,
      generators: Object.fromEntries(GENERATORS.map((g) => [g.id, 0])),
      upgrades: Object.fromEntries(UPGRADES.map((u) => [u.id, 0])),
      pokedex: {},   // numéro Pokédex -> nombre de captures
      shinydex: {},  // numéro Pokédex -> nombre de chromatiques capturés
      buffs: {},     // id de bonus -> secondes restantes
      roamerIn: randomBetween(ROAMER.firstDelay),
      wild: null,
      persistAsked: false,
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

  // Sauvegardes v1 : Pokédex de 24 espèces indexé par nom, Boost additif +10%/niveau
  const V1_SPECIES = {
    rattata: 19, roucool: 16, chenipan: 10, aspicot: 13, magicarpe: 129, nosferapti: 41,
    abo: 23, piafabec: 21, pikachu: 25, salameche: 4, carapuce: 7, bulbizarre: 1,
    psykokwak: 54, miaouss: 52, ponyta: 77, tentacool: 72, evoli: 133, ronflex: 143,
    lokhlass: 131, dracaufeu: 6, rondoudou: 39, artikodin: 144, electhor: 145, mewtwo: 150,
  };

  function migrate(raw) {
    if ((raw.version || 1) < 2) {
      const dex = {};
      for (const [slug, count] of Object.entries(raw.pokedex || {})) {
        if (V1_SPECIES[slug]) dex[V1_SPECIES[slug]] = count;
      }
      raw.pokedex = dex;
      raw.wild = null;
      const ups = raw.upgrades || {};
      const oldBoost = int(ups.boost);
      ups.boost = Math.round(Math.log(1 + 0.1 * oldBoost) / Math.log(1.25));
      raw.upgrades = ups;
    }
    return raw;
  }

  function parseDex(src) {
    const dex = {};
    if (src && typeof src === 'object') {
      for (const p of POKEMON) {
        const count = int(src[p.id]);
        if (count > 0) dex[p.id] = count;
      }
    }
    return dex;
  }

  // Construit un état valide à partir de n'importe quel objet (sauvegarde ou import)
  function parseState(raw) {
    const state = defaultState();
    if (!raw || typeof raw !== 'object') return state;
    raw = migrate(raw);

    for (const key of ['coins', 'totalEarned', 'totalDamage', 'playTime']) state[key] = num(raw[key]);
    for (const key of ['totalCaught', 'totalClicks', 'totalCrits', 'totalShinies', 'roamersCaught']) {
      state[key] = int(raw[key]);
    }

    const gens = raw.generators || {};
    for (const g of GENERATORS) state.generators[g.id] = int(gens[g.id]);

    const ups = raw.upgrades || {};
    for (const u of UPGRADES) {
      const lvl = int(ups[u.id]);
      state.upgrades[u.id] = u.maxLevel == null ? lvl : Math.min(lvl, u.maxLevel);
    }

    state.pokedex = parseDex(raw.pokedex);
    state.shinydex = parseDex(raw.shinydex);

    const buffs = raw.buffs || {};
    for (const id of Object.keys(BUFFS)) {
      const left = Math.min(num(buffs[id]), BUFFS[id].duration);
      if (left > 0) state.buffs[id] = left;
    }

    state.roamerIn = num(raw.roamerIn, state.roamerIn);
    state.persistAsked = raw.persistAsked === true;

    const w = raw.wild;
    if (w && POKEMON_BY_ID[w.id] && num(w.maxHp) > 0) {
      const hp = num(w.hp);
      state.wild = {
        id: w.id,
        maxHp: w.maxHp,
        hp: hp > 0 ? Math.min(hp, w.maxHp) : w.maxHp,
        shiny: w.shiny === true,
      };
    }

    state.lastSave = num(raw.lastSave, Date.now());
    state.createdAt = num(raw.createdAt, Date.now());
    return state;
  }

  function load() {
    let raw = null;
    try {
      raw = JSON.parse(localStorage.getItem(GAME.SAVE_KEY));
    } catch (e) {
      raw = null;
    }
    return parseState(raw);
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

  // Export / import en texte base64 (convention des idle games)
  function toBase64(text) {
    const bytes = new TextEncoder().encode(text);
    let bin = '';
    for (const b of bytes) bin += String.fromCharCode(b);
    return btoa(bin);
  }
  function fromBase64(b64) {
    const bin = atob(b64);
    return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
  }

  Game.exportSave = function () {
    save();
    return GAME.EXPORT_PREFIX + toBase64(JSON.stringify(Game.state));
  };

  Game.importSave = function (text) {
    let raw;
    try {
      const clean = String(text).trim().replace(/^PKTY\d+:/, '').replace(/\s+/g, '');
      raw = JSON.parse(fromBase64(clean));
    } catch (e) {
      return false;
    }
    if (!raw || typeof raw !== 'object' || !raw.generators) return false;
    Game.state = parseState(raw);
    Game.catching = false;
    hideRoamer();
    recalc();
    if (Game.state.wild) UI.renderWild(false);
    else spawn();
    save();
    UI.refreshAll();
    return true;
  };

  // Évite l'effacement automatique (Safari efface après 7 jours sans visite)
  function requestPersistence() {
    const s = Game.state;
    if (s.persistAsked || s.totalCaught < GAME.PERSIST_AFTER_CATCHES) return;
    s.persistAsked = true;
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
  }

  /* ------------------------------------------------------------------ */
  /* Économie                                                            */
  /* ------------------------------------------------------------------ */

  function upgradeValue(id) {
    return UPGRADES_BY_ID[id].value(Game.state.upgrades[id]);
  }

  Game.milestonesReached = function (g) {
    const owned = Game.state.generators[g.id];
    return GAME.GEN_MILESTONES.filter((t) => owned >= t).length;
  };

  Game.nextMilestone = function (g) {
    const owned = Game.state.generators[g.id];
    return GAME.GEN_MILESTONES.find((t) => owned < t) || null;
  };

  Game.buffActive = function (id) {
    return (Game.state.buffs[id] || 0) > 0;
  };

  // Recalcule les valeurs dérivées après chaque changement (achat, capture, bonus)
  function recalc() {
    const s = Game.state;
    const d = Game.derived;
    const species = Object.keys(s.pokedex).length;
    const shinySpecies = Object.keys(s.shinydex).length;

    d.critChance = upgradeValue('crit');
    d.prodMult = upgradeValue('boost');
    d.clickPps = upgradeValue('clickPps');
    d.dexMult = 1 + species * GAME.DEX_BONUS_PER_SPECIES + shinySpecies * GAME.DEX_BONUS_PER_SHINY;

    d.basePps = 0;
    for (const g of GENERATORS) {
      d.genMult[g.id] = Math.pow(2, Game.milestonesReached(g)) * d.prodMult * d.dexMult;
      d.genProd[g.id] = g.baseProd * s.generators[g.id] * d.genMult[g.id];
      d.basePps += d.genProd[g.id];
    }
    d.pps = d.basePps * (Game.buffActive('frenzy') ? BUFFS.frenzy.mult : 1);
    d.damage = upgradeValue('damage') + d.clickPps * d.pps;
  }

  function addCoins(amount) {
    Game.state.coins += amount;
    Game.state.totalEarned += amount;
  }

  Game.zone = function () {
    return 1 + Math.floor(Game.state.totalCaught / GAME.CATCHES_PER_ZONE);
  };

  // Dernière région débloquée (les Pokémon des régions précédentes restent présents)
  Game.region = function () {
    const zone = Game.zone();
    return REGIONS.filter((r) => r.zone <= zone).pop();
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
    const g = GENERATORS_BY_ID[id];
    if (!g || !Game.isGeneratorUnlocked(g)) return false;
    const qty = Game.buyQuantity(g);
    const cost = Game.generatorCost(g, qty);
    if (Game.state.coins < cost) return false;
    const before = Game.milestonesReached(g);
    Game.state.coins -= cost;
    Game.state.generators[id] += qty;
    recalc();
    const after = Game.milestonesReached(g);
    if (after > before) {
      const owned = GAME.GEN_MILESTONES[after - 1];
      UI.toast(g.name + ' : palier ' + owned + ' ! Production x' + Math.pow(2, after - before), 'gold');
    }
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

  function pickSpecies() {
    const zone = Game.zone();
    const pools = {};
    for (const p of POKEMON) {
      if (p.minZone <= zone) (pools[p.rarity] = pools[p.rarity] || []).push(p);
    }
    // Premier Pokémon toujours commun pour un départ en douceur
    const rarities = Game.state.totalCaught === 0
      ? ['common']
      : Object.keys(RARITIES).filter((r) => pools[r]);
    const total = rarities.reduce((sum, r) => sum + RARITIES[r].weight, 0);
    let roll = Math.random() * total;
    let rarity = rarities[0];
    for (const r of rarities) {
      roll -= RARITIES[r].weight;
      if (roll < 0) {
        rarity = r;
        break;
      }
    }
    const pool = pools[rarity];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function spawn() {
    const p = pickSpecies();
    const maxHp = Math.ceil(
      GAME.BASE_HP * RARITIES[p.rarity].hp * Math.pow(GAME.ZONE_HP_GROWTH, Game.zone() - 1)
    );
    const aura = Game.buffActive('shinyAura') ? BUFFS.shinyAura.mult : 1;
    const shiny = Math.random() < GAME.SHINY_CHANCE * aura;
    Game.state.wild = { id: p.id, hp: maxHp, maxHp, shiny };
    UI.renderWild(true);
    if (shiny) UI.toast('✨ Un ' + p.name + ' chromatique apparaît !', 'gold');
  }

  function zoneReward() {
    return GAME.BASE_REWARD * Math.pow(GAME.ZONE_REWARD_GROWTH, Game.zone() - 1);
  }

  function catchReward(p, shiny) {
    const d = Game.derived;
    const reward = zoneReward() * d.dexMult * RARITIES[p.rarity].reward + d.pps * GAME.CATCH_PROD_BONUS;
    return shiny ? reward * GAME.SHINY_REWARD_MULT : reward;
  }

  // x / y : coordonnées écran du clic (null pour le clavier)
  Game.attack = function (x, y) {
    const s = Game.state;
    if (Game.catching || !s.wild) return;
    const d = Game.derived;
    const crit = Math.random() < d.critChance;
    let dmg = d.damage * (crit ? GAME.CRIT_MULTIPLIER : 1);
    if (Game.buffActive('clickFrenzy')) dmg *= BUFFS.clickFrenzy.mult;

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
    const wild = s.wild;
    const p = POKEMON_BY_ID[wild.id];
    const zoneBefore = Game.zone();
    const reward = catchReward(p, wild.shiny);
    const isNew = !s.pokedex[p.id];
    const isNewShiny = wild.shiny && !s.shinydex[p.id];

    Game.catching = true;
    s.pokedex[p.id] = (s.pokedex[p.id] || 0) + 1;
    if (wild.shiny) {
      s.shinydex[p.id] = (s.shinydex[p.id] || 0) + 1;
      s.totalShinies++;
    }
    s.totalCaught++;
    addCoins(reward);
    recalc(); // le bonus Pokédex a pu changer
    UI.playCatch(p, reward, wild.shiny, isNew);

    if (isNewShiny) UI.toast('★ ' + p.name + ' chromatique ajouté au Pokédex !', 'gold');
    else if (p.rarity === 'legendary') UI.toast(p.name + ' légendaire attrapé !', 'gold');
    if (Game.zone() > zoneBefore) {
      const region = REGIONS.find((r) => r.zone === Game.zone());
      if (region) {
        const count = POKEMON.filter((x) => x.gen === region.gen).length;
        UI.toast('Nouvelle région : ' + region.name + ' ! ' + count + ' Pokémon à découvrir.', 'gold');
      } else {
        UI.toast('Zone ' + Game.zone() + ' atteinte ! Pokémon plus forts.', 'blue');
      }
    }
    requestPersistence();

    const delay = Game.buffActive('clickFrenzy') ? GAME.CATCH_ANIM_FAST_MS : GAME.CATCH_ANIM_MS;
    setTimeout(() => {
      spawn();
      Game.catching = false;
    }, delay);
  }

  /* ------------------------------------------------------------------ */
  /* Pokémon errant (Leveinard) & bonus temporaires                      */
  /* ------------------------------------------------------------------ */

  function pickEffect() {
    const total = ROAMER.effects.reduce((sum, e) => sum + e.weight, 0);
    let roll = Math.random() * total;
    for (const e of ROAMER.effects) {
      roll -= e.weight;
      if (roll < 0) return e.type;
    }
    return ROAMER.effects[0].type;
  }

  function showRoamer() {
    Game.roamer = { timeLeft: ROAMER.visible };
    UI.showRoamer(ROAMER.visible);
  }

  function hideRoamer() {
    Game.roamer = null;
    Game.state.roamerIn = randomBetween(ROAMER.delay);
    UI.hideRoamer();
  }

  Game.catchRoamer = function () {
    if (!Game.roamer) return;
    const s = Game.state;
    const type = pickEffect();
    s.roamersCaught++;
    hideRoamer();

    if (type === 'fortune') {
      const d = Game.derived;
      const gain = Math.min(s.coins * ROAMER.fortuneBankShare, d.basePps * ROAMER.fortuneProdSeconds) +
        zoneReward() * d.dexMult * ROAMER.fortuneMinCatches;
      addCoins(gain);
      UI.roamerEffect('FORTUNE !', '+' + UI.format(gain) + ' ₽');
    } else {
      const buff = BUFFS[type];
      s.buffs[type] = buff.duration; // rafraîchit la durée si déjà actif
      recalc();
      UI.roamerEffect(buff.label + ' !', buff.desc + ' pendant ' + buff.duration + ' s');
    }
  };

  function tickBuffs(dt) {
    const buffs = Game.state.buffs;
    let changed = false;
    for (const id of Object.keys(buffs)) {
      buffs[id] -= dt;
      if (buffs[id] <= 0) {
        delete buffs[id];
        changed = true;
      }
    }
    if (changed) recalc();
  }

  function tickRoamer(dt) {
    const s = Game.state;
    if (Game.roamer) {
      Game.roamer.timeLeft -= dt;
      if (Game.roamer.timeLeft <= 0) hideRoamer();
      return;
    }
    s.roamerIn -= dt;
    if (s.roamerIn <= 0) showRoamer();
  }

  /* ------------------------------------------------------------------ */
  /* Game loop                                                           */
  /* ------------------------------------------------------------------ */

  let autosaveTimer = 0;
  let lastFrame = 0;

  function tick(dt) {
    const d = Game.derived;
    // La Frénésie ne s'applique que sur la part de dt où elle était active
    // (rattrapage après un onglet en arrière-plan).
    const frenzyTime = Math.min(dt, Game.state.buffs.frenzy || 0);
    const gain = d.basePps * (dt + frenzyTime * (BUFFS.frenzy.mult - 1));
    if (gain > 0) addCoins(gain);

    // rAF est suspendu onglet caché : la production rattrape le retard,
    // mais on ne compte pas ce temps comme du temps de jeu actif.
    const activeDt = Math.min(dt, 1);
    Game.state.playTime += activeDt;
    tickBuffs(dt);
    tickRoamer(activeDt);

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
    // Les bonus temporaires sont mis en pause hors-ligne : production de base uniquement
    const gain = Game.derived.basePps * elapsed;
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
    hideRoamer();
    Game.state.roamerIn = randomBetween(ROAMER.firstDelay);
    recalc();
    spawn();
    save();
    UI.refreshAll();
    UI.toast('Partie réinitialisée');
  };

  function registerServiceWorker() {
    // Pas de service worker en file:// : le jeu reste jouable en ouvrant index.html
    if (!('serviceWorker' in navigator) || !location.protocol.startsWith('http')) return;
    navigator.serviceWorker.register('sw.js').catch(() => {});
    // Télécharge en arrière-plan les sprites pour pouvoir jouer hors ligne
    navigator.serviceWorker.ready.then((reg) => {
      if (reg.active) reg.active.postMessage({ type: 'warm', count: POKEMON.length });
    });
  }

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
    registerServiceWorker();

    requestAnimationFrame(frame);
  }

  window.Game = Game;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
