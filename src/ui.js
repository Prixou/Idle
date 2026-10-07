/**
 * Pokémon Tycoon — rendu de l'interface et effets visuels.
 * Les listes sont construites une seule fois ; update() ne touche le DOM
 * que lorsque les valeurs affichées changent.
 */
(function () {
  'use strict';

  const { GAME, RARITIES, REGIONS, POKEMON, POKEMON_BY_ID, GENERATORS, UPGRADES, BUFFS } = window.CONFIG;

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

  function formatMult(v) {
    return 'x' + (v < 10 ? v.toFixed(2) : format(v));
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

  function setWidth(node, ratio) {
    const width = Math.round(Math.min(1, Math.max(0, ratio)) * 1000) / 10 + '%';
    if (node._width !== width) {
      node._width = width;
      node.style.width = width;
    }
  }

  // Relance une animation CSS même si la classe est déjà présente
  function restartAnim(node, cls) {
    node.classList.remove(cls);
    void node.offsetWidth;
    node.classList.add(cls);
  }

  function iconHtml(item) {
    if (item.sprite) return '<img class="item-sprite" src="' + item.sprite + '" alt="" draggable="false">';
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
  const regionChips = {};
  let dexGen = 1; // région affichée dans le Pokédex
  const buffChips = {};
  let game = null;
  let activeTab = 'generators';
  let statsTimer = Infinity;
  let dexDirty = true;
  let installPrompt = null;
  let modalAction = null;
  let fps = 60;
  let fpsFrames = 0;
  let fpsTime = 0;

  const STATS = [
    ['Pokédollars', (s) => format(s.coins) + ' ₽'],
    ['Total gagné', (s) => format(s.totalEarned) + ' ₽'],
    ['Production', (s, d) => format(d.pps) + ' ₽/s'],
    ['Boost Génération', (s, d) => formatMult(d.prodMult)],
    ['Bonus Pokédex', (s, d) => formatMult(d.dexMult)],
    ['Dégâts / clic', (s, d) => format(d.damage)],
    ['Chance crit.', (s, d) => Math.round(d.critChance * 100) + '%'],
    ['Zone', () => game.zone()],
    ['Attrapés', (s) => format(s.totalCaught)],
    ['Chromatiques', (s) => format(s.totalShinies)],
    ['Leveinard attrapés', (s) => format(s.roamersCaught)],
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
        '<span class="card-title"><span class="card-name"></span><span class="badge"></span>' +
          '<span class="badge badge--mult"></span></span>' +
        '<span class="card-desc"></span>' +
        '<span class="card-sub"></span>' +
      '</span>' +
      '<span class="card-cost"><span class="qty"></span><span class="price"></span></span>' +
      '<span class="card-progress"><i></i></span>';
    btn.addEventListener('click', () => restartAnim(btn, onBuy() ? 'bought' : 'denied'));
    list.appendChild(btn);
    return {
      btn,
      name: btn.querySelector('.card-name'),
      badge: btn.querySelector('.badge'),
      mult: btn.querySelector('.badge--mult'),
      desc: btn.querySelector('.card-desc'),
      sub: btn.querySelector('.card-sub'),
      qty: btn.querySelector('.qty'),
      price: btn.querySelector('.price'),
      progress: btn.querySelector('.card-progress i'),
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
      row.btn.classList.add('no-progress');
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

    el.dexRegions.innerHTML = '';
    for (const r of REGIONS) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'region-chip';
      chip.innerHTML = '<b></b><span></span>';
      chip.firstChild.textContent = r.name.toUpperCase();
      chip.addEventListener('click', () => showDexRegion(r.gen));
      el.dexRegions.appendChild(chip);
      regionChips[r.gen] = chip;
    }
    showDexRegion(dexGen);
  }

  // Les cases d'une région ne sont créées qu'à sa première ouverture (1025 espèces au total)
  function showDexRegion(gen) {
    dexGen = gen;
    for (const r of REGIONS) regionChips[r.gen].classList.toggle('active', r.gen === gen);
    el.dexGrid.innerHTML = '';
    for (const p of POKEMON) {
      if (p.gen !== gen) continue;
      let cell = dexCells[p.id];
      if (!cell) {
        cell = dexCells[p.id] = document.createElement('div');
        cell.className = 'dex-cell';
        cell.dataset.rarity = p.rarity;
        cell.innerHTML = '<img alt="" loading="lazy" draggable="false"><span class="dex-num"></span>';
        cell.firstChild.src = p.sprite;
        cell.lastChild.textContent = p.id;
      }
      el.dexGrid.appendChild(cell);
    }
    dexDirty = true;
    if (game) statsTimer = Infinity;
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
    el.roamer.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      game.catchRoamer();
    });
    el.roamer.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        game.catchRoamer();
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
    el.btnExport.addEventListener('click', openExport);
    el.btnImport.addEventListener('click', openImport);
    el.btnReset.addEventListener('click', () => {
      if (window.confirm('Réinitialiser toute la progression ?')) game.reset();
    });

    el.modalClose.addEventListener('click', closeModal);
    el.modal.addEventListener('click', (e) => {
      if (e.target === el.modal) closeModal();
    });
    el.modalOk.addEventListener('click', () => modalAction && modalAction());

    // Bouton « Installer » (Chrome / Android uniquement)
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      installPrompt = e;
      el.btnInstall.hidden = false;
    });
    el.btnInstall.addEventListener('click', () => {
      if (!installPrompt) return;
      installPrompt.prompt();
      installPrompt = null;
      el.btnInstall.hidden = true;
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
      region: $('region'),
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
      roamer: $('roamer'),
      buffs: $('buffs'),
      panels: $('panels'),
      genList: $('gen-list'),
      upList: $('up-list'),
      buyMode: $('buy-mode'),
      statsList: $('stats-list'),
      dexGrid: $('dex-grid'),
      dexRegions: $('dex-regions'),
      dexCount: $('dex-count'),
      dexBonus: $('dex-bonus'),
      btnSave: $('btn-save'),
      btnExport: $('btn-export'),
      btnImport: $('btn-import'),
      btnReset: $('btn-reset'),
      btnInstall: $('btn-install'),
      modal: $('modal'),
      modalTitle: $('modal-title'),
      modalText: $('modal-text'),
      modalInput: $('modal-input'),
      modalOk: $('modal-ok'),
      modalClose: $('modal-close'),
      toasts: $('toasts'),
      tabGenerators: document.querySelector('.tab[data-tab="generators"]'),
      tabUpgrades: document.querySelector('.tab[data-tab="upgrades"]'),
    });
    el.roamer.querySelector('img').src = window.CONFIG.roamerSprite;
    buildLists();
    bindEvents();
  };

  UI.refreshAll = function () {
    UI.renderWild(true);
    statsTimer = Infinity;
    dexDirty = true;
    UI.update(0);
  };

  /* ------------------------------------------------------------------ */
  /* Pokémon sauvage                                                     */
  /* ------------------------------------------------------------------ */

  UI.renderWild = function (appear) {
    const w = game.state.wild;
    const p = POKEMON_BY_ID[w.id];
    el.pokeSprite.src = w.shiny ? p.shinySprite : p.sprite;
    el.pokeSprite.alt = p.name;
    setText(el.pokeName, p.name.toUpperCase());
    setText(el.pokeRarity, w.shiny ? 'CHROMA' : RARITIES[p.rarity].label);
    el.arena.dataset.rarity = p.rarity;
    el.arena.dataset.shiny = w.shiny;
    el.pokeBtn.setAttribute('aria-label', 'Attaquer ' + p.name);
    el.pokeSprite.classList.remove('caught', 'hit', 'appear');
    el.catchBall.classList.remove('show');
    if (appear) restartAnim(el.pokeSprite, 'appear');
    UI.updateHp();
  };

  UI.updateHp = function () {
    const w = game.state.wild;
    const ratio = w.hp / w.maxHp;
    setWidth(el.hpFill, ratio);
    el.hpFill.dataset.level = ratio > 0.5 ? 'high' : ratio > 0.2 ? 'mid' : 'low';
    setText(el.hpText, format(Math.ceil(w.hp)) + ' / ' + format(w.maxHp));
  };

  UI.hitWild = function () {
    el.pokeSprite.classList.remove('appear');
    restartAnim(el.pokeSprite, 'hit');
  };

  // Position (relative à l'arène) du centre d'un élément
  function centerOf(node) {
    const a = el.arena.getBoundingClientRect();
    const r = node.getBoundingClientRect();
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

  function floatingText(x, y, title, sub, extra) {
    const text = document.createElement('div');
    text.className = 'catch-text';
    text.innerHTML = '<span></span><small></small>';
    text.firstChild.textContent = title;
    text.lastChild.textContent = sub;
    if (extra) {
      const badge = document.createElement('em');
      badge.textContent = extra;
      text.appendChild(badge);
    }
    const w = el.arena.clientWidth;
    text.style.left = Math.min(Math.max(x, 100), w - 100) + 'px';
    text.style.top = y + 'px';
    addFx(text);
  }

  UI.showDamage = function (clientX, clientY, dmg, crit) {
    let x;
    let y;
    if (clientX == null) {
      const c = centerOf(el.pokeSprite);
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

  UI.playCatch = function (p, reward, shiny, isNew) {
    el.pokeSprite.classList.remove('hit', 'appear');
    el.pokeSprite.classList.add('caught');
    restartAnim(el.catchBall, 'show');

    const c = centerOf(el.pokeSprite);
    floatingText(c.x, c.y - 40, shiny ? '★ ATTRAPÉ ! ★' : 'ATTRAPÉ !', '+' + format(reward) + ' ₽',
      isNew ? 'NOUVEAU ! Pokédex +' + Math.round(GAME.DEX_BONUS_PER_SPECIES * 100) + '%' : '');
    const big = shiny || p.rarity === 'legendary';
    particles(c.x, c.y, big ? 20 : 12, big ? 'var(--yellow)' : '#fff');
    restartAnim(el.wallet, 'bump');
    dexDirty = true;
  };

  /* ------------------------------------------------------------------ */
  /* Pokémon errant                                                      */
  /* ------------------------------------------------------------------ */

  UI.showRoamer = function (duration) {
    el.roamer.style.animationDuration = duration + 's';
    el.roamer.hidden = false;
    restartAnim(el.roamer, 'show');
  };

  UI.hideRoamer = function () {
    el.roamer.classList.remove('show');
    el.roamer.hidden = true;
  };

  UI.roamerEffect = function (title, sub) {
    const c = { x: el.arena.clientWidth / 2, y: el.arena.clientHeight / 2 };
    floatingText(c.x, c.y, title, sub);
    particles(c.x, c.y, 24, 'var(--yellow)');
    UI.toast('Leveinard : ' + title + ' ' + sub, 'gold');
  };

  /* ------------------------------------------------------------------ */
  /* Mise à jour par frame                                               */
  /* ------------------------------------------------------------------ */

  function updateGenerators(s, d) {
    for (const g of GENERATORS) {
      const row = genRows[g.id];
      const unlocked = game.isGeneratorUnlocked(g);
      const owned = s.generators[g.id];
      const qty = game.buyQuantity(g);
      const cost = game.generatorCost(g, qty);
      row.btn.classList.toggle('locked', !unlocked);
      row.btn.classList.toggle('cant-afford', !unlocked || s.coins < cost);
      setText(row.qty, 'x' + qty);
      setText(row.price, '₽ ' + format(cost));
      if (!unlocked) {
        setText(row.name, '???');
        setText(row.badge, 'x0');
        setText(row.mult, '');
        setText(row.desc, 'Achète le générateur précédent pour débloquer.');
        setText(row.sub, '');
        setWidth(row.progress, 0);
        continue;
      }
      const reached = game.milestonesReached(g);
      const next = game.nextMilestone(g);
      const prev = reached ? GAME.GEN_MILESTONES[reached - 1] : 0;
      setText(row.name, g.name);
      setText(row.badge, 'x' + owned);
      setText(row.mult, reached ? '×' + Math.pow(2, reached) : '');
      setText(row.desc, next
        ? 'Palier ' + next + ' : ' + owned + '/' + next + ' → prod x2'
        : 'Tous les paliers atteints !');
      setText(row.sub, '+' + format(g.baseProd * d.genMult[g.id]) + '/s chacun · ' + format(d.genProd[g.id]) + ' ₽/s');
      setWidth(row.progress, next ? (owned - prev) / (next - prev) : 1);
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

  function updateDex(s, d) {
    let seen = 0;
    let shinies = 0;
    const perRegion = {};
    for (const r of REGIONS) perRegion[r.gen] = { seen: 0, total: 0 };
    for (const p of POKEMON) {
      const caught = s.pokedex[p.id] || 0;
      const shiny = s.shinydex[p.id] || 0;
      if (caught) seen++;
      if (shiny) shinies++;
      perRegion[p.gen].total++;
      if (caught) perRegion[p.gen].seen++;
      if (p.gen !== dexGen) continue;
      const cell = dexCells[p.id];
      cell.classList.toggle('seen', caught > 0);
      cell.classList.toggle('shiny', shiny > 0);
      const src = shiny ? p.shinySprite : p.sprite;
      if (!cell.firstChild.src.endsWith(src)) cell.firstChild.src = src;
      cell.title = caught ? '#' + p.id + ' ' + p.name + ' ×' + caught + (shiny ? ' (★' + shiny + ')' : '') : '#' + p.id + ' ???';
    }
    const zone = game.zone();
    for (const r of REGIONS) {
      const chip = regionChips[r.gen];
      const count = perRegion[r.gen];
      chip.classList.toggle('locked', zone < r.zone);
      chip.classList.toggle('complete', count.seen === count.total);
      setText(chip.lastChild, zone < r.zone ? 'ZONE ' + r.zone : count.seen + '/' + count.total);
    }
    setText(el.dexCount, seen + '/' + POKEMON.length + (shinies ? ' · ★' + shinies : ''));
    setText(el.dexBonus, 'Bonus : ' + formatMult(d.dexMult) + ' production et récompenses (+' +
      Math.round(GAME.DEX_BONUS_PER_SPECIES * 100) + '% par espèce, +' +
      Math.round(GAME.DEX_BONUS_PER_SHINY * 100) + '% par chromatique)');
  }

  function updateStats(s, d) {
    STATS.forEach(([, fn], i) => setText(statRows[i], fn(s, d)));
    if (dexDirty) {
      dexDirty = false;
      updateDex(s, d);
    }
  }

  function updateBuffs(s) {
    let any = false;
    for (const id of Object.keys(BUFFS)) {
      const left = s.buffs[id] || 0;
      let chip = buffChips[id];
      if (left > 0) {
        any = true;
        if (!chip) {
          chip = buffChips[id] = document.createElement('div');
          chip.className = 'buff buff--' + id;
          el.buffs.appendChild(chip);
        }
        setText(chip, BUFFS[id].label + ' ' + Math.ceil(left) + 's');
      } else if (chip) {
        chip.remove();
        delete buffChips[id];
      }
    }
    el.arena.classList.toggle('has-buffs', any);
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
    el.wallet.classList.toggle('frenzy', game.buffActive('frenzy'));
    setText(el.zone, game.zone());
    setText(el.region, game.region().name.toUpperCase());
    setText(el.caughtCount, format(s.totalCaught));
    updateBuffs(s);

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
  /* Export / import                                                     */
  /* ------------------------------------------------------------------ */

  function openModal(title, text, value, okLabel, action) {
    setText(el.modalTitle, title);
    setText(el.modalText, text);
    el.modalInput.value = value;
    el.modalInput.readOnly = !!value;
    setText(el.modalOk, okLabel);
    modalAction = action;
    el.modal.hidden = false;
    if (value) el.modalInput.select();
    else el.modalInput.focus();
  }

  function closeModal() {
    el.modal.hidden = true;
    modalAction = null;
  }

  function openExport() {
    openModal('EXPORTER', 'Garde ce texte en lieu sûr : il contient toute ta progression.',
      game.exportSave(), 'COPIER', () => {
        el.modalInput.select();
        const done = () => UI.toast('Sauvegarde copiée !', 'blue');
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(el.modalInput.value).then(done, () => {
            if (document.execCommand('copy')) done();
          });
        } else if (document.execCommand('copy')) {
          done();
        }
      });
  }

  function openImport() {
    openModal('IMPORTER', 'Colle une sauvegarde exportée. Ta progression actuelle sera remplacée.',
      '', 'IMPORTER', () => {
        const text = el.modalInput.value;
        if (!text.trim()) return;
        if (game.importSave(text)) {
          closeModal();
          UI.toast('Sauvegarde importée !', 'gold');
        } else {
          UI.toast('Sauvegarde invalide');
        }
      });
  }

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
