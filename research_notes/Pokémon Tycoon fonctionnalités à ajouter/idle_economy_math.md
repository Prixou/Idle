# Idle/Incremental Game Economy Math — Balancing Notes for "Pokémon Tycoon"

> Research method note: the session's egress proxy blocked direct fetches of gamedeveloper.com, blog.kongregate.com, www.kongregate.com, gameanalytics.com, sirpinski.com, *.fandom.com, cookieclicker.wiki.gg, blog.clickerheroes.com and web.archive.org. Facts below come from search-engine extracts of those pages (cited by the page URL the extract came from) and from GitHub pages that could be fetched. Items marked **[unverified recollection]** are from background knowledge and could NOT be confirmed this session — the report writer should present them as such or drop them. All numeric critiques of the current game are my own calculations (shown), not sourced facts.

## Q1. Kongregate "The Math of Idle Games" (Pecorella, Parts I–III): costs, production, bulk/max-buy, prestige

### Takeaway
Costs grow exponentially per unit (cost_n = b·rⁿ, r typically ~1.07–1.15) while each generator's production grows only linearly with count, so payback time per purchase rises exponentially; designers counter with multiplier milestones, more generator tiers, derivative (generator-of-generator) chains, and finally prestige, whose currency is a sub-linear (square or cube root) function of lifetime earnings — e.g. AdCap angels = 150·√(lifetime/1e15), Cookie Clicker chips = ⌊∛(lifetime/1e12)⌋.

### Cited Findings
- Series is a 3-part, in-depth series by Anthony Pecorella (producer of AdVenture Capitalist at Kongregate); Part I covers "core ideas of growth, cost, prestige, and generator balancing"; Part III "looking at prestige loops and patterns" — [Game Developer, Part III](https://www.gamedeveloper.com/design/the-math-of-idle-games-part-iii); [Part I](https://www.gamedeveloper.com/design/the-math-of-idle-games-part-i)
- Part I looks "primarily at the relationships between exponential and polynomial growth" (Cookie Clicker model) — [Game Developer, Part II](https://www.gamedeveloper.com/game-platforms/the-math-of-idle-games-part-ii)
- **Next-unit cost:** cost_next = b·r^k (b = base price, r = growth rate, k = owned) — [Kongregate blog Part I (amp)](https://blog.kongregate.com/the-math-of-idle-games-part-i/amp/); [Game Developer Part I](https://www.gamedeveloper.com/design/the-math-of-idle-games-part-i)
- **Bulk-buy cost of n units:** cost = b · r^k · (rⁿ − 1)/(r − 1) — same sources (search extract of Part I).
- **Max affordable with c currency:** max = ⌊ log_r( c·(r−1)/(b·r^k) + 1 ) ⌋ = ⌊ log( c(r−1)/(b r^k) + 1 ) / log r ⌋. These closed forms avoid "brute-forcing with lengthy for-loops" and only hold for simple exponential growth without shifting costs/exponents — [Kongregate blog Part I (amp)](https://blog.kongregate.com/the-math-of-idle-games-part-i/amp/)
- **Part II (derivative growth):** each generator produces the next-lower tier (a derivative chain); repeated integration gives 1, x, x²/2, x³/6, …, xⁿ/n!; with more tiers this approaches eˣ, but with finitely many tiers production stays polynomial, so exponential costs still eventually outpace it. Derivative Clicker is cited as an example/predecessor of Antimatter Dimensions — [Game Developer Part II](https://www.gamedeveloper.com/game-platforms/the-math-of-idle-games-part-ii) (search extract)
- **Part III (prestige):** AdVenture Capitalist uses p = 150·√(c_L / 10¹⁵) where c_L = lifetime earnings; "the amount of currency diminishes each time, which means players do need to be able to advance to make appreciable gains"; "to double prestige currency each run, you need to earn somewhere in the 3x–4x range more than the previous run"; unlike progress gates, "you can keep resetting at the same point and gain currency" — [Game Developer Part III](https://www.gamedeveloper.com/design/the-math-of-idle-games-part-iii); [Kongregate amp Part III](https://blog.kongregate.com/the-math-of-idle-games-part-iii/amp/)
- AdCap community formula: Total angels (current + claimable + sacrificed) = 150·√(LifetimeEarnings / 1e15) — [Steam guide "Angel Investors Explained"](https://steamcommunity.com/sharedfiles/filedetails/?id=420273770); [AdCap wiki Angel Investors](https://adventure-capitalist.fandom.com/wiki/Angel_Investors) (search extract)
- Cookie Clicker: prestige = ⌊ (total cookies baked all time / 10¹²)^(1/3) ⌋; new chips on ascend = that minus current prestige. 1e12 → 1 chip, 1e15 → 10, 1e18 → 100 — [Cookie Clicker Wikipedia](https://en.wikipedia.org/wiki/Cookie_Clicker); [cookieclickernew ascension guide](https://cookieclickernew.com/blog/cookie-clicker-ascension-guide/) (search extracts; secondary sources)
- Pecorella also gave a GDC Europe 2016 talk "Quest for Progress" on idle-game design — [SlideShare](https://www.slideshare.net/slideshow/quest-for-progress-gdc-europe-2016/65405507) (title only; content not retrieved)
- A Medium write-up "Math — the backbone of Idle Games" restates these formulas — [Medium](https://medvescekmurovec.medium.com/math-the-backbone-of-idle-games-part-1-f46b54706cf1) (not fetched)

### Inferences
- Square-root prestige ⇒ 4× lifetime earnings to double total prestige currency (cube root ⇒ 8×). Pecorella's "3x–4x" figure is consistent with √ (since already-owned currency is subtracted, the *new* gain doubles with somewhat less).
- Generic optimal-reset rule (standard rate optimization, not from the series): if G(t) is prestige currency gained by resetting at run time t, reset when G'(t) = G(t)/t, i.e. when the marginal rate of currency gain falls to the average rate of the run. A common player heuristic is "reset when pending gain ≥ current total" (doubling) — community lore, not sourced here.
- Production formula in Part I is (from memory) production_total = (base_production · owned) · multipliers **[unverified recollection]**.
- AdCap per-business growth rates spanning 1.07 (Lemonade Stand, Oil Co.) to 1.15 (Newspaper) and angel bonus +2% production per angel **[unverified recollection]** — consistent with the brief's "1.07–1.15" but not confirmed this session.

### Gaps
- Could not read the article bodies directly (blocked): Part I's time-to-next-purchase charts, milestone discussion, and the accompanying Google spreadsheets are unverified.
- Exact list of AdCap per-business rates and milestone thresholds not confirmed.

## Q2. Constants used by Cookie Clicker, AdCap, Clicker Heroes, Antimatter Dimensions

### Takeaway
Cookie Clicker: cost ×1.15 per building, base cost ratio ≈ ×7–11 per tier and CpS ratio ≈ ×5–8 per tier (payback grows slowly tier to tier). Clicker Heroes: hero cost ×1.07/level vs monster HP ×1.55/zone (later ×1.145), deliberately creating walls solved by hero milestones and prestige. Antimatter Dimensions: huge step costs (×1e3, ×1e4, ×1e5 per 10 bought) offset by ×2 power per 10 bought.

### Cited Findings
- **Cookie Clicker buildings** (base cost / base CpS): Cursor 15 / 0.1; Grandma 100 / 1; Farm 1,100 / 8; Mine 12,000 / 47; Factory 130,000 / 260; price scales ×1.15 per unit owned — [Cookie Clicker Wiki (wiki.gg) Buildings](https://cookieclicker.wiki.gg/wiki/Buildings); [cookieclickercalc buildings](https://cookieclickercalc.com/buildings) (search extracts)
- Cookie Clicker: each prestige level gives permanent +1% CpS; heavenly chips and prestige levels are earned 1:1 — [Cookie Clicker fandom Heavenly Chips](https://cookieclicker.fandom.com/wiki/Heavenly_Chips); [cookieclickernew prestige system](https://cookieclickernew.com/blog/cookie-clicker-prestige-system-explained-heavenly-chips-ascend-and-legacy-upgrades/) (search extracts)
- **Clicker Heroes monster HP:** levels 1–140: ⌈10·(L−1 + 1.55^(L−1)) · [isBoss·10]⌉; levels 141–500: ⌈10·(139 + 1.55^139 · 1.145^(L−140)) · [isBoss·10]⌉ — [Clicker Heroes wiki, Formulas](https://clickerheroes.fandom.com/wiki/Formulas) (search extract)
- **Clicker Heroes gold:** for level > 139 base gold uses 4.717e28 · 1.15^(L−140), with further multipliers — [Clicker Heroes wiki, Formulas](https://clickerheroes.fandom.com/wiki/Formulas) (search extract)
- **Clicker Heroes hero level cost:** ⌊BaseCost · 1.07^CurrentLevel⌋ — "a near doubling of cost for every 10 levels" — [Clicker Heroes wiki, Heroes](https://clickerheroes.fandom.com/wiki/Heroes) (search extract)
- **Antimatter Dimensions:** 1st dimension base cost 10, cost ×1e3; 2nd base 100, ×1e4; 3rd base 1e4, ×1e5; each group of 10 purchases multiplies that dimension's power ×2 — [AD wiki (miraheze)](https://antimatterdimensions.miraheze.org/wiki/Antimatter_Dimensions); [AD fandom Dimensions](https://antimatter-dimensions.fandom.com/wiki/Dimensions) (search extracts)

### Inferences
- Cookie Clicker payback (cost/CpS) at 0 owned: Cursor 150 s, Grandma 100 s, Farm 137.5 s, Mine 255 s, Factory 500 s — base payback roughly doubles every ~2 tiers. Pokémon Tycoon's tiers (15/0.2, 100/1, 1100/8, 12000/47) give 75/100/137.5/255 s, i.e. Cookie Clicker's first four with the Cursor doubled.
- Further CC buildings **[unverified recollection]**: Bank 1.4e6/1,400; Temple 2e7/7,800; Wizard Tower 3.3e8/44,000; Shipment 5.1e9/260,000; Alchemy Lab 7.5e10/1.6e6; Portal 1e12/1e7; Time Machine 1.4e13/6.5e7.
- Clicker Heroes structure: HP ×1.55/zone vs hero cost ×1.07/level means one zone of HP ≈ 6.5 hero levels of cost (ln1.55/ln1.07 ≈ 6.5); DPS milestones per hero level (e.g. ×4 at certain levels) **[unverified recollection]** are what keep that from being a hard wall.
- CH monster gold ≈ HP/15 at early zones **[unverified recollection]** — i.e., gold tied directly to HP so kill value scales with difficulty.

### Gaps
- AdCap full business table (costs, revenue, times, rates) and milestone list (×2/×3 at 25/50/100/… units) not retrieved.
- No source fetched for Antimatter Dimensions cost-scaling beyond ~1.8e308 ("post-infinity" increase).

## Q3. Click vs idle balance — how games keep clicking relevant; critique of current Pokémon Tycoon formulas

### Takeaway
Successful games tie click value to idle production (Cookie Clicker "+1% of CpS per click" mouse upgrades; Clicker Heroes click damage scaling with DPS) so clicks never fall behind. In Pokémon Tycoon, click damage scales ~e^(0.04·zone) when funded by catch rewards while HP scales e^(0.166·zone), so clicking hits a wall around zone 35–50; the four flat generators without multipliers cause an idle wall at roughly 40–50 of each generator (≈4–12 h of play), and the additive +10% boost dies after ~13 levels.

### Cited Findings
- Cookie Clicker clicking is boosted by prestige via the general +1% CpS per prestige level — [Heavenly Chips (fandom)](https://cookieclicker.fandom.com/wiki/Heavenly_Chips) (search extract).
- Clicker Heroes hero cost ×1.07 per level vs HP ×1.55 per zone (see Q2) — [Formulas](https://clickerheroes.fandom.com/wiki/Formulas); [Heroes](https://clickerheroes.fandom.com/wiki/Heroes)

### Inferences — critique of the current formulas (my calculations)
Reference values: 1.15^10=4.05, ^20=16.4, ^30=66.2, ^40=268, ^50=1084, ^60=4384. ln1.15=0.1398, ln1.18=0.1655, ln1.2=0.1823, ln1.9=0.6419, ln2.2=0.7885.

**(a) Generators — the idle wall.**
- Each generator's next-unit payback = basePayback·1.15^owned (75/100/137.5/255 s base). Production per unit is constant, so payback grows exponentially; nothing (no milestones, no per-building multipliers) offsets it.
- A greedy "cheapest payback first" player keeps counts offset by ln(B_i/B_mine)/ln1.15 ≈ (+8.8, +6.7, +4.4, 0) relative to Mines (m). Then pps ≈ 56.2·m + 44 and one "round" (one of each) takes ≈ 255·1.15^m / m seconds; cumulative time ≈ 7.7× the last round.
  - m=30: round ≈ 9 min, cumulative ≈ 1.2 h, pps ≈ 1.7k
  - m=40: round ≈ 28 min, cumulative ≈ 3.6 h, pps ≈ 2.3k
  - m=50: round ≈ 1.5 h, cumulative ≈ 12 h, pps ≈ 2.9k
  - m=60: round ≈ 5 h, cumulative ≈ 2 days, pps ≈ 3.4k
  - (Divide times by the boost factor ≤ ~2.3 and add catch income; order of magnitude unchanged.)
- ⇒ pps grows ~logarithmically with time (pps ≈ 56·ln(t)/0.14). The wall is ~m=40–50 (4–12 h): each round adds only ~2% production. Lifetime money spent by m=40 ≈ 2.5e7 (Mine 2.1e7 + Farm 3.6e6 + Grandma 4.6e5 + Cursor 9e4) — the game never gets near 1e36, so suffixes beyond T/Qa are unused without new growth sources.

**(b) Production boost +10%/level additive, cost 500·2.2^L.**
- Relative gain of level L+1 = 0.1/(1+0.1L) (4.5% at L=12, 3.3% at L=20) while cost ×2.2 per level. Payback at pps≈2.8k: L=12 → cost 6.35e6, gain ≈127 pps, payback ≈14 h; L=15 → cost 6.8e7, payback ≈170 h. Additive stacking + steep cost = doubly diminishing; it stops mattering around L≈13, total effect capped near ×2.3.
- Additive bonuses only scale if they are a *small* part of a multiplicative chain; as the sole multiplier they cannot carry long-term growth.

**(c) Click damage floor((1+L)·1.15^L), cost 25·1.9^L vs HP 10·rarity·1.18^(z−1).**
- Damage: L10=44, L20=343, L25=855, L30=2,052. Cost: L10=1.5e4, L20=9.4e6, L25≈2.3e8, L30≈5.8e9.
- HP (rarity 1): z20=232, z30=1,215, z40=6,360, z50=33,300, z75≈2.1e6, z100≈1.3e8.
- Damage per unit of log-cost: ln(1.15)/ln(1.9)=0.22 → damage ≈ cost^0.22 (plus the (1+L) factor). If spending tracks catch reward (×1.2/zone), damage grows ≈ e^(0.04·z)·0.28z vs HP e^(0.166·z): clicks per catch grow ~e^(0.126 z)/z.
- Concretely: zone 50 common needs 39 clicks at L25 or 16 at L30 (5.8e9 = ~23 days of pps at the idle wall). With rarityMult >1, rare Pokémon hit the wall earlier. Since zone = 1+⌊caught/15⌋, zone 50 = 735 catches — the click wall arrives at roughly zone 35–50.
- Reward/HP ratio = 0.5·(1.2/1.18)^(z−1): 0.5 at z1, 1.14 at z50, 2.6 at z100 — rewards are fine; damage is the bottleneck.
- The pps·2 reward term makes a catch worth 2 s of idle income; once a catch takes > ~2 s of clicking (~12+ clicks at 6 cps), active play yields less than idling for that term — clicking becomes irrelevant except for the zone term.
- Crit +10%/lvl max 5 (cost 150·4^L) is a capped, one-off +50% chance; fine as a minor upgrade but doesn't fix scaling.

**(d) When does the player hit a wall?** Idle wall ≈ 4–12 h (m≈40–50); click wall ≈ zone 35–50 (≈500–750 catches). With no prestige there is no exit from either wall.

### Gaps
- Exact text of Cookie Clicker mouse upgrades ("Clicking gains +1% of your CpS", Plastic mouse → Iron mouse → …) could not be confirmed this session **[unverified recollection]**; likewise Clicker Heroes upgrades that add "% of DPS" to click damage **[unverified recollection]**.
- Crit damage multiplier and rarityMult values for Pokémon Tycoon were not given; computations assume rarity 1.

## Q4. Big numbers in JS and number formatting

### Takeaway
JS Number tops out at ~1.8e308 (precision ~15–16 significant digits); with the current formulas Pokémon Tycoon would only overflow at zone ≈4,300 (1.18^z), so plain Numbers suffice unless prestige makes growth exponential-on-exponential. break_infinity.js (to 1e9e15, several times faster than decimal.js) is the standard drop-in if needed; break_eternity.js goes to 10↑↑1e308.

### Cited Findings
- break_infinity.js: "faster alternative to decimal.js for incremental games", prioritizes speed over precision; handles magnitudes beyond 1e308 "up to as much as 1e(9e15)"; benchmarks vs decimal.js: constructor 2.8×, add 2.5×, mul 2.9×, log 121×, exp 401×, pow 442× faster; Antimatter Dimensions saw a 4.5× script speed-up after migrating; not recommended where accuracy is the priority (use decimal.js) — [Patashu/break_infinity.js (GitHub)](https://github.com/Patashu/break_infinity.js)
- break_eternity.js (Patashu, since March 2019) represents numbers up to 10↑↑1e308, designed for incremental games — [break_eternity.js docs](https://multivberse.github.io/break_eternity.js/index.html); [npm](https://www.npmjs.com/package/break_eternity.js/v/1.1.1); [Googology wiki](https://googology.fandom.com/wiki/Break_eternity.js_limit) (search extracts)
- Notation libraries exist for these types, e.g. "Eternal Notations" — [npm eternal_notations](https://www.npmjs.com/package/eternal_notations); [demo](https://mathcookie17.github.io/Eternal-Notations/)
- Engineering notation: like scientific but exponent always a multiple of 3 (mantissa 1–1000) — [Wikipedia, Engineering notation](https://en.wikipedia.org/wiki/Engineering_notation)
- Number.MAX_VALUE ≈ 1.7976931348623157e308; MAX_SAFE_INTEGER = 2^53−1 — [MDN Number.MAX_VALUE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_VALUE) (standard fact; page not fetched this session)

### Inferences
- Overflow points with current formulas: HP 1.18^(z−1) overflows at z ≈ 709.8/0.1655 ≈ 4,290 (~64k catches); reward 1.2^(z−1) at z ≈ 3,890; generator cost 1.15^n at n ≈ 5,080. None reachable without prestige. Recommendation: stay on Number; compute costs in log space only if needed; add `isFinite` guards and cap displays.
- Suffix list for the existing formatter (short scale): k 1e3, M 1e6, B 1e9, T 1e12, Qa 1e15, Qi 1e18, Sx 1e21, Sp 1e24, Oc 1e27, No 1e30, Dc 1e33, Ud 1e36 → then scientific "1.23e39". Offer a setting (suffix / scientific / engineering), as many incrementals do.
- break_infinity.js exposes helpers for bulk buying (affordGeometricSeries / sumGeometricSeries / affordArithmeticSeries / efficiencyOfPurchase) **[unverified recollection — README fetch did not show signatures]**.

### Gaps
- ExpantaNum.js not researched (blocked/time). No survey data on player preference between suffixes and scientific notation was found; only anecdotal community preference exists.
- No numeric benchmark for plain Number vs break_infinity found (only break_infinity vs decimal.js).

## Q5. Offline progress design

### Takeaway
Most idle games compute offline gains in closed form (rate × elapsed time) with a cap (commonly a few hours to 24 h) and sometimes an efficiency factor; heavier games (Melvor Idle) re-simulate the absence. The UI should report time away, earnings, and whether a cap/efficiency applied.

### Cited Findings
- Typical approach: on return apply a cap (often 2–24 h) to accumulated production; uncapped offline gains would remove the reason to reopen; the game should explain time away, earnings and any cap/efficiency rule — [onirealms "Idle games explained"](https://onirealms.com/guides/idle-games-explained/); [tideward offline progression](https://tideward.app/offline-progression/) (search extracts; low-authority secondary sources)
- Melvor Idle simulates the time away (including combat, food, death risk), capped at 24 h at 100% rate — [tideward](https://tideward.app/offline-progression/) (search extract); a Steam thread title suggests an 18 h cap at some point — [Steam discussion](https://steamcommunity.com/app/1267910/discussions/0/4665175132461478006/) — **conflicting/possibly version-dependent**.
- Separating game logic from rendering lets logic run thousands of ticks per second for catch-up simulation — (search extract, same result set as above)

### Inferences — recommendation for Pokémon Tycoon
- Closed form is exact while nothing is bought offline: `gain = pps * Math.min(dt, cap) * eff`, with `dt = Math.max(0, (Date.now() - lastSave)/1000)` (guard against clock rollback). Suggested start: cap 8 h, eff 50%, both upgradable (cap → 24 h, eff → 100%) — creates a good prestige/meta upgrade sink.
- Offline catches: either none, or an "auto-catch" rate computed per zone in a loop (≤ a few hundred iterations: catches per zone = 15, time per catch = HP(z)/autoDps), not tick simulation.
- If auto-buyers are added later, simulate in coarse steps (e.g. 60 s, max ~1,000 steps) rather than per-frame.

### Gaps
- No primary source for Cookie Clicker / AdCap offline rules was retrieved (Clicker Heroes blog post on offline progression was blocked).

## Q6. Simulation/tooling and recommended formulas for Pokémon Tycoon

### Takeaway
Designers model curves in spreadsheets (Pecorella's series ships spreadsheets) and simple bots; for this game, a headless Node/JS greedy-payback simulator measuring time-between-purchases, clicks-per-catch per zone, and time-to-first-prestige is enough. Recommended changes: add tiers + ×2 milestones, make the boost multiplicative, re-tune click scaling to HP growth (plus a %-of-pps click component), add √-based prestige, and capped offline gains.

### Cited Findings
- Closed-form bulk/max formulas (above) are recommended over loops — [Kongregate Part I (amp)](https://blog.kongregate.com/the-math-of-idle-games-part-i/amp/)
- AD's ×2 per 10 purchased and CH's ×1.07 hero cost / ×1.55 HP show the "milestone multiplier vs exponential cost" pattern — [AD wiki](https://antimatterdimensions.miraheze.org/wiki/Antimatter_Dimensions); [CH Formulas](https://clickerheroes.fandom.com/wiki/Formulas)
- Prestige √ (AdCap) and ∛ (Cookie Clicker) formulas and +1%/level CC bonus — see Q1/Q2 citations.

### Inferences — concrete recommended formulas (vanilla JS)

**1. Bulk buy / max affordable (Pecorella Part I):**
```js
const bulkCost = (b, r, k, n) => b * Math.pow(r, k) * (Math.pow(r, n) - 1) / (r - 1);
const maxAffordable = (b, r, k, c) =>
  Math.floor(Math.log(c * (r - 1) / (b * Math.pow(r, k)) + 1) / Math.log(r));
```

**2. Generators:** keep r = 1.15 (or vary 1.12–1.15 per tier, higher tiers slightly lower r, AdCap-style) and extend to 6–8 tiers following CC ratios (cost ×~10–12, production ×~5–6 per tier, base payback 75 → ~500+ s). Add per-generator milestones: `mult_i = 2 ** milestonesReached(owned_i)` at owned ∈ {10, 25, 50, 100, 150, 200, 250, 300, …}. Effect: with ×2 per 25 units, effective payback growth per unit falls from 1.15 to 1.15/2^(1/25) ≈ 1.119; with ×2 per 10 (AD) to ≈ 1.073. This turns the log-growth wall into a soft slope and makes "reach 25/50/100" goals visible.
```js
pps = Σ_i base_i * owned_i * 2**milestones(owned_i) * boostMult * prestigeMult * dexMult
```

**3. Production boost:** switch from additive to multiplicative: `boostMult = 1.25 ** L`, `cost = 1000 * 4 ** L` (constant +25% per level; ln1.25/ln4 = 0.16). Alternatively keep additive only as an inner term inside a multiplicative chain. Tune by sim so its payback stays comparable to generator payback.

**4. Click damage — keep clicking relevant.** Two-part damage:
```js
clickDmg = (flatDmg(L) + pctOfPps * pps) * (isCrit ? critMult : 1)
flatDmg(L) = Math.floor((1 + L) * 1.7 ** L)   // cost 25 * 1.9 ** L
pctOfPps   = 0.01 * mouseLevel                 // CC-style "+1% of pps per click" upgrades
```
Rule used for flatDmg: to keep clicks-per-catch roughly constant when upgrades are funded by catch rewards, need ln(v) ≥ (ln hpGrowth / ln rewardGrowth) · ln(costGrowth) = (0.1655/0.1823)·ln 1.9 ≈ 0.58 → v ≈ 1.79 per level. With v = 1.7 and the (1+L) factor this roughly holds: L20 → ~8.5e5 dmg at cost 9.4e6, which one-shots-in-~10-clicks a zone ≈55 common (HP ≈ 8.5e4), whose reward (≈9.4e4) means L20 ≈ 100 catches of income. Alternatively keep 1.15 damage growth but lower cost growth to ≈1.17. Note the pps-percentage term only stays aligned with HP if pps also grows exponentially (milestones/prestige) — validate with sim. Also allow returning to a lower zone (CH-style farming) so a click wall is soft, and make reward `= (5*1.2**(z-1) + pps*k) * rarity` with k scaled to expected catch duration (e.g. k = 5–10 s) so an active catch beats idling.

**5. Prestige ("Ligue"/badges — naming to choose):** AdCap-style √ on all-time lifetime earnings, computed as total minus already earned:
```js
totalPrestige = Math.floor(10 * Math.sqrt(lifetimeMoney / 1e6));
gainOnReset  = Math.max(0, totalPrestige - prestigeEarnedSoFar);
prestigeMult = 1 + 0.02 * prestigePoints;   // AdCap uses +2%/angel [unverified], CC +1%/level
```
Calibration: lifetime ≈ 2.5e7 at the current ~4 h wall ⇒ ~50 points ⇒ ×2 production on run 2 — first reset worth doing before the wall. √ means 4× more lifetime to double points ("3x–4x", Part III). Use cube root (`Math.cbrt(lifetime/E0)`) if runs snowball too fast. Optional: spend points on permanent upgrades (offline cap/efficiency, starting money, click %), like CC heavenly upgrades.

**6. Long-term milestones:** Pokédex collection bonus `dexMult = 1 + 0.01 * speciesCaught` (or ×1.05 per 10 species), achievements +1% each — multiplicative layers that grow with content rather than time.

**7. Simulation tooling:** headless JS script (Node) reusing the game formulas; bot = buy the option with lowest payback (cost / Δpps) each step, plus a click model (e.g. 6 clicks/s while active). Log: time between purchases, pps(t), zone(t), clicks per catch per zone, lifetime money and prestige points at 1/2/4/8 h. Iterate constants until targets hold (designer-chosen targets, e.g. purchases every ≤60 s in the first hour, first worthwhile prestige at ~2–4 h — these targets are suggestions, not sourced benchmarks).

### Gaps
- No sourced industry benchmarks for "time to first prestige" or ideal time-between-purchases were found (Part I's time-to-purchase analysis was not readable this session).
- Pecorella's spreadsheets and GDC talk content were not retrieved.
- All recommended constants (1.7, 1.25, 4, 10·√(L/1e6), etc.) are design proposals derived from the calculations above and must be validated by simulation.
