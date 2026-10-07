/**
 * Pokémon Tycoon — rendu de l'interface et effets visuels.
 * Les listes sont construites une seule fois ; update() ne touche le DOM
 * que lorsque les valeurs affichées changent.
 */
(function () {
  'use strict';

  const { RARITIES, POKEMON, POKEMON_BY_ID, GENERATORS, UPGRADES } = window.CONFIG;

  /* ------------------------------------------------------------------ */
  /* Formatage                                                           */
  /* ------------------------------------------------------------------ */

  const SUFFIXES = ['', 'k', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

  function format(n) {
    if (!Number.isFinite(n)) return '∞';
    if (n < 0) return '-' + format(-n);
    if (n < 1000) {
      if (n < 10 && n % 1 !== 0) return (Math.floor(n * 10) / 10).toFixed(1);
      return String(Math.floor(n));
    }
    let tier = Math.floor(Math.log10(n) / 3);
    if (tier >= SUFFIXES.length) return n.toExponential(2).replace('+', '');
    let scaled = n / Math.pow(1000, tier);
    // 999.99k s'arrondirait en "1000k" : on passe au suffixe suivant
    if (scaled >= 999.5 && tier + 1 < SUFFIXES.length) {
      tier++;
      scaled /= 1000;
    }
    const decimals = scaled < 10 ? 2 : scaled < 100 ? 1 : 0;
    return scaled.toFixed(decimals) + SUFFIXES[tier];
  }

  function formatTime(seconds) {
    const total = Math.floor(seconds);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = (v) => String(v).padStart(2, '0');
    if (h) return h + 'h ' + pad(m) + 'm';
    if (m) return m + 'm ' + pad(s) + 's';
    return s + 's';
  }

  /* ------------------------------------------------------------------ */
  /* Helpers DOM                                                         */
  /* ------------------------------------------------------------------ */

  const $ = (id) => document.getElementById(id);

  function setText(node, value) {
    const text = String(value);
    if (node._text !== text) {
      node._text = text;
      node.textContent = text;
    }
  }

  // Relance une animation CSS même si la classe est déjà présente
  function restartAnim(node, cls) {
    node.classList.remove(cls);
    void node.offsetWidth;
    node.classList.add(cls);
  }

  function iconHtml(item) {
    if (item.ball) return '<span class="ball ball--' + item.ball + '" aria-hidden="true"></span>';
    return '<span class="emoji" aria-hidden="true">' + item.icon + '</span>';
  }

  /* ------------------------------------------------------------------ */
  /* État UI                                                             */
  /* ------------------------------------------------------------------ */

  const UI = { format, formatTime };
  const el = {};
  const genRows = {};
  const upRows = {};
  const statRows = [];
  const dexCells = {};
  let game = null;
  let activeTab = 'generators';
  let statsTimer = Infinity;
  let fps = 60;
  let fpsFrames = 0;
  let fpsTime = 0;

  const STATS = [
    ['Pokédollars', (s) => format(s.coins) + ' ₽'],
    ['Total gagné', (s) => format(s.totalEarned) + ' ₽'],
    ['Production', (s, d) => format(d.pps) + ' ₽/s'],
    ['Bonus prod.', (s, d) => 'x' + d.prodMult.toFixed(1)],
    ['Dégâts / clic', (s, d) => format(d.damage)],
    ['Chance crit.', (s, d) => Math.round(d.critChance * 100) + '%'],
    ['Zone', () => game.zone()],
    ['Attrapés', (s) => format(s.totalCaught)],
    ['Clics', (s) => format(s.totalClicks)],
    ['Critiques', (s) => format(s.totalCrits)],
    ['Dégâts infligés', (s) => format(s.totalDamage)],
    ['Générateurs', (s) => format(Object.values(s.generators).reduce((a, b) => a + b, 0))],
    ['Temps de jeu', (s) => formatTime(s.playTime)],
    ['FPS', () => fps],
  ];

  /* ------------------------------------------------------------------ */
  /* Construction                                                        */
  /* ------------------------------------------------------------------ */

  function buildCard(list, iconSource, onBuy) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'card';
    btn.innerHTML =
      '<span class="card-icon">' + iconHtml(iconSource) + '</span>' +
      '<span class="card-body">' +
        '<span class="card-title"><span class="card-name"></span><span class="badge"></span></span>' +
        '<span class="card-desc"></span>' +
        '<span class="card-sub"></span>' +
      '</span>' +
      '<span class="card-cost"><span class="qty"></span><span class="price"></span></span>';
    btn.addEventListener('click', () => restartAnim(btn, onBuy() ? 'bought' : 'denied'));
    list.appendChild(btn);
    return {
      btn,
      name: btn.querySelector('.card-name'),
      badge: btn.querySelector('.badge'),
      desc: btn.querySelector('.card-desc'),
      sub: btn.querySelector('.card-sub'),
      qty: btn.querySelector('.qty'),
      price: btn.querySelector('.price'),
    };
  }

  function buildLists() {
    el.genList.innerHTML = '';
    for (const g of GENERATORS) {
      genRows[g.id] = buildCard(el.genList, g, () => game.buyGenerator(g.id));
    }

    el.upList.innerHTML = '';
    for (const u of UPGRADES) {
      const row = buildCard(el.upList, u, () => game.buyUpgrade(u.id));
      setText(row.name, u.name);
      setText(row.desc, u.desc);
      upRows[u.id] = row;
    }

    el.statsList.innerHTML = '';
    for (const [label] of STATS) {
      const row = document.createElement('div');
      row.innerHTML = '<dt></dt><dd></dd>';
      row.firstChild.textContent = label;
      el.statsList.appendChild(row);
      statRows.push(row.lastChild);
    }

    el.dexGrid.innerHTML = '';
    for (const p of POKEMON) {
      const cell = document.createElement('div');
      cell.className = 'dex-cell';
      cell.dataset.rarity = p.rarity;
      cell.innerHTML = '<span></span>';
      cell.firstChild.textContent = p.emoji;
      el.dexGrid.appendChild(cell);
      dexCells[p.id] = cell;
    }
  }

  function bindEvents() {
    // pointerdown : réactif au tactile (pas de délai de clic) et multi-doigts
    el.pokeBtn.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      game.attack(e.clientX, e.clientY);
    });
    el.pokeBtn.addEventListener('keydown', (e) => {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
        e.preventDefault();
        game.attack(null, null);
      }
    });
    el.arena.addEventListener('contextmenu', (e) => e.preventDefault());

    document.querySelectorAll('.tab').forEach((tab) => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    el.buyMode.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        game.buyMode = mode === 'max' ? 'max' : Number(mode);
        el.buyMode.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b === btn));
      });
    });

    el.btnSave.addEventListener('click', () => {
      UI.toast(game.save() ? 'Partie sauvegardée !' : 'Sauvegarde impossible', 'blue');
    });
    el.btnReset.addEventListener('click', () => {
      if (window.confirm('Réinitialiser toute la progression ?')) game.reset();
    });
  }

  function switchTab(name) {
    activeTab = name;
    document.querySelectorAll('.tab').forEach((tab) => {
      const on = tab.dataset.tab === name;
      tab.classList.toggle('active', on);
      tab.setAttribute('aria-selected', on);
    });
    document.querySelectorAll('.panel').forEach((panel) => {
      panel.classList.toggle('active', panel.id === 'panel-' + name);
    });
    el.panels.scrollTop = 0;
    statsTimer = Infinity; // rafraîchit les stats immédiatement
  }

  UI.init = function (g) {
    game = g;
    Object.assign(el, {
      wallet: $('wallet'),
      coins: $('coins'),
      pps: $('pps'),
      zone: $('zone'),
      caughtCount: $('caught-count'),
      arena: $('arena'),
      pokeName: $('poke-name'),
      pokeRarity: $('poke-rarity'),
      pokeBtn: $('poke-btn'),
      pokeSprite: $('poke-sprite'),
      catchBall: $('catch-ball'),
      hpFill: $('hp-fill'),
      hpText: $('hp-text'),
      fxLayer: $('fx-layer'),
      panels: $('panels'),
      genList: $('gen-list'),
      upList: $('up-list'),
      buyMode: $('buy-mode'),
      statsList: $('stats-list'),
      dexGrid: $('dex-grid'),
      dexCount: $('dex-count'),
      btnSave: $('btn-save'),
      btnReset: $('btn-reset'),
      toasts: $('toasts'),
      tabGenerators: document.querySelector('.tab[data-tab="generators"]'),
      tabUpgrades: document.querySelector('.tab[data-tab="upgrades"]'),
    });
    buildLists();
    bindEvents();
  };

  UI.refreshAll = function () {
    UI.renderWild(true);
    statsTimer = Infinity;
    UI.update(0);
  };

  /* ------------------------------------------------------------------ */
  /* Pokémon sauvage                                                     */
  /* ------------------------------------------------------------------ */

  UI.renderWild = function (appear) {
    const p = POKEMON_BY_ID[game.state.wild.id];
    setText(el.pokeSprite, p.emoji);
    setText(el.pokeName, p.name.toUpperCase());
    setText(el.pokeRarity, RARITIES[p.rarity].label);
    el.arena.dataset.rarity = p.rarity;
    el.pokeBtn.setAttribute('aria-label', 'Attaquer ' + p.name);
    el.pokeSprite.classList.remove('caught', 'hit', 'appear');
    el.catchBall.classList.remove('show');
    if (appear) restartAnim(el.pokeSprite, 'appear');
    UI.updateHp();
  };

  UI.updateHp = function () {
    const w = game.state.wild;
    const ratio = w.hp / w.maxHp;
    el.hpFill.style.width = ratio * 100 + '%';
    el.hpFill.dataset.level = ratio > 0.5 ? 'high' : ratio > 0.2 ? 'mid' : 'low';
    setText(el.hpText, format(Math.ceil(w.hp)) + ' / ' + format(w.maxHp));
  };

  UI.hitWild = function () {
    el.pokeSprite.classList.remove('appear');
    restartAnim(el.pokeSprite, 'hit');
  };

  // Position (relative à l'arène) du centre du sprite
  function spriteCenter() {
    const a = el.arena.getBoundingClientRect();
    const r = el.pokeSprite.getBoundingClientRect();
    return { x: r.left + r.width / 2 - a.left, y: r.top + r.height / 2 - a.top };
  }

  function addFx(node) {
    node.addEventListener('animationend', () => node.remove(), { once: true });
    el.fxLayer.appendChild(node);
    while (el.fxLayer.childElementCount > 60) el.fxLayer.firstElementChild.remove();
  }

  function particles(x, y, count, color) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('i');
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const dist = 30 + Math.random() * 40;
      p.className = 'particle';
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
      p.style.setProperty('--c', color);
      addFx(p);
    }
  }

  UI.showDamage = function (clientX, clientY, dmg, crit) {
    let x;
    let y;
    if (clientX == null) {
      const c = spriteCenter();
      x = c.x;
      y = c.y - 30;
    } else {
      const a = el.arena.getBoundingClientRect();
      x = clientX - a.left;
      y = clientY - a.top - 10;
    }
    x += (Math.random() - 0.5) * 24;

    const n = document.createElement('span');
    n.className = 'dmg' + (crit ? ' crit' : '');
    n.textContent = (crit ? 'CRIT! -' : '-') + format(dmg);
    n.style.left = x + 'px';
    n.style.top = y + 'px';
    addFx(n);
    if (crit) particles(x, y, 6, 'var(--yellow)');
  };

  UI.playCatch = function (p, reward) {
    el.pokeSprite.classList.remove('hit', 'appear');
    el.pokeSprite.classList.add('caught');
    restartAnim(el.catchBall, 'show');

    const c = spriteCenter();
    const text = document.createElement('div');
    text.className = 'catch-text';
    text.innerHTML = 'ATTRAPÉ !<small></small>';
    text.lastChild.textContent = '+' + format(reward) + ' ₽';
    text.style.left = Math.min(c.x, el.arena.clientWidth - 90) + 'px';
    text.style.top = c.y - 40 + 'px';
    addFx(text);

    particles(c.x, c.y, p.rarity === 'legendary' ? 20 : 12, p.rarity === 'legendary' ? 'var(--yellow)' : '#fff');
    restartAnim(el.wallet, 'bump');
  };

  /* ------------------------------------------------------------------ */
  /* Mise à jour par frame                                               */
  /* ------------------------------------------------------------------ */

  function updateGenerators(s, d) {
    for (const g of GENERATORS) {
      const row = genRows[g.id];
      const unlocked = game.isGeneratorUnlocked(g);
      const qty = game.buyQuantity(g);
      const cost = game.generatorCost(g, qty);
      row.btn.classList.toggle('locked', !unlocked);
      row.btn.classList.toggle('cant-afford', !unlocked || s.coins < cost);
      setText(row.qty, 'x' + qty);
      setText(row.price, '₽ ' + format(cost));
      if (!unlocked) {
        setText(row.name, '???');
        setText(row.badge, 'x0');
        setText(row.desc, 'Achète le générateur précédent pour débloquer.');
        setText(row.sub, '');
        continue;
      }
      setText(row.name, g.name);
      setText(row.badge, 'x' + s.generators[g.id]);
      setText(row.desc, g.desc);
      setText(row.sub, '+' + format(g.baseProd * d.prodMult) + '/s chacun · ' + format(d.genProd[g.id]) + ' ₽/s');
    }
  }

  function updateUpgrades(s) {
    for (const u of UPGRADES) {
      const row = upRows[u.id];
      const lvl = s.upgrades[u.id];
      const maxed = game.isUpgradeMaxed(u);
      const cost = game.upgradeCost(u);
      row.btn.classList.toggle('maxed', maxed);
      row.btn.classList.toggle('cant-afford', !maxed && s.coins < cost);
      setText(row.badge, maxed ? 'MAX' : 'NV ' + lvl);
      setText(row.qty, maxed ? '' : 'NV ' + (lvl + 1));
      setText(row.price, maxed ? 'MAX' : '₽ ' + format(cost));
      setText(row.sub, maxed
        ? u.format(u.value(lvl))
        : u.format(u.value(lvl)) + ' > ' + u.format(u.value(lvl + 1)));
    }
  }

  function updateStats(s, d) {
    STATS.forEach(([, fn], i) => setText(statRows[i], fn(s, d)));
    let seen = 0;
    for (const p of POKEMON) {
      const caught = s.pokedex[p.id] || 0;
      if (caught) seen++;
      const cell = dexCells[p.id];
      cell.classList.toggle('seen', caught > 0);
      cell.title = caught ? p.name + ' ×' + caught : '???';
    }
    setText(el.dexCount, seen + '/' + POKEMON.length);
  }

  function anyGeneratorAffordable(s) {
    return GENERATORS.some((g) => game.isGeneratorUnlocked(g) && s.coins >= game.generatorCost(g, 1));
  }

  function anyUpgradeAffordable(s) {
    return UPGRADES.some((u) => !game.isUpgradeMaxed(u) && s.coins >= game.upgradeCost(u));
  }

  UI.update = function (dt) {
    const s = game.state;
    const d = game.derived;

    fpsFrames++;
    fpsTime += dt;
    if (fpsTime >= 1) {
      fps = Math.round(fpsFrames / fpsTime);
      fpsFrames = 0;
      fpsTime = 0;
    }

    setText(el.coins, format(s.coins));
    setText(el.pps, format(d.pps));
    setText(el.zone, game.zone());
    setText(el.caughtCount, format(s.totalCaught));

    el.tabGenerators.classList.toggle('has-dot', activeTab !== 'generators' && anyGeneratorAffordable(s));
    el.tabUpgrades.classList.toggle('has-dot', activeTab !== 'upgrades' && anyUpgradeAffordable(s));

    if (activeTab === 'generators') updateGenerators(s, d);
    else if (activeTab === 'upgrades') updateUpgrades(s);
    else {
      statsTimer += dt;
      if (statsTimer >= 0.25) {
        statsTimer = 0;
        updateStats(s, d);
      }
    }
  };

  /* ------------------------------------------------------------------ */
  /* Toasts                                                              */
  /* ------------------------------------------------------------------ */

  UI.toast = function (message, variant) {
    const t = document.createElement('div');
    t.className = 'toast' + (variant ? ' toast--' + variant : '');
    t.textContent = message;
    el.toasts.appendChild(t);
    while (el.toasts.childElementCount > 3) el.toasts.firstElementChild.remove();
    setTimeout(() => {
      t.classList.add('out');
      t.addEventListener('animationend', () => t.remove(), { once: true });
    }, 2600);
  };

  window.UI = UI;
})();
