# Idle / incremental game retention and progression mechanics (for "Pokémon Tycoon")

Research note, written October 2026. **Method caveat:** the egress proxy blocked direct page fetches from every primary source tried (cookieclicker.fandom.com, cookieclicker.wiki.gg, blog.kongregate.com, gamedeveloper.com, par.nsf.gov, en.wikipedia.org, reddit.com, dev.to). All findings below come from **web-search result summaries** that point to those pages. Where a figure appears in several sources (for example the Cookie Clicker golden cookie numbers or the AdCap angel formula), it is reliable. Single-source figures from low-authority SEO or agency blogs are marked **[low-authority]**. Wiki numbers can change between game versions.

## 1. Prestige / ascension / rebirth: how the reference games build it, when the first prestige should happen, and how many layers to have

### Takeaway
Every major idle game has a reset that turns lifetime progress into a permanent multiplier currency. The gain uses a **sub-linear root of lifetime earnings** (cube root in Cookie Clicker, square root in AdCap), so each new prestige needs much more progress than the last. Prestige becomes rewarding when the next run is visibly faster. Common guidance targets a first prestige window of about 30–120 min and a 2–4x speed-up on run 2. A small game needs 1 layer, or 2 at most. Antimatter Dimensions-style stacked layers are a mid- or late-game feature.

### Cited Findings
**Cookie Clicker (heavenly chips / prestige levels)**
- Prestige formula: `floor((all-time cookies / 1e12)^(1/3))`. 1 trillion cookies gives 1 chip, 1 quadrillion gives 10, 1 quintillion gives 100. Doubling prestige needs 8x the cookies — [PocketGamer heavenly chips guide](https://www.pocketgamer.com/cookie-clicker/heavenly-chips-guide/); [Cookie Clicker wiki, Ascension guide](https://cookieclicker.wiki.gg/wiki/Ascension_guide); [Fandom: Heavenly Chips](https://cookieclicker.fandom.com/wiki/Heavenly_Chips)
- Each prestige level gives a permanent +1% CpS once activated via the Heavenly Upgrade tree. Chips are also spent in that tree (the "legacy upgrades") — same sources; [cookieclickernew.com prestige explainer](https://cookieclickernew.com/blog/cookie-clicker-prestige-system-explained-heavenly-chips-ascend-and-legacy-upgrades/) [low-authority]

**AdVenture Capitalist (angel investors)**
- Angels = `150 * sqrt(lifetime earnings / 1e15)`. The first angel arrives at about $44.444 billion lifetime earnings, 47 angels at $100 trillion, and 150 angels at $1 quadrillion — [Steam guide "Angel Investors Explained"](https://steamcommunity.com/sharedfiles/filedetails/?id=420273770); [AdCap wiki: Angel Investors](https://adventure-capitalist.fandom.com/wiki/Angel_Investors); [Steam discussion "Real formula for Angel Investors?"](https://steamcommunity.com/app/346900/discussions/0/620712999971234569/)
- Each angel gives +2% profit, so 50 angels give +100% (x2) — same sources.
- Angels can also be **sacrificed** to buy angel upgrades. The formula counts all angels ever earned (current + unclaimed + sacrificed), so spending them is a real trade-off between a permanent multiplier and an immediate upgrade — [AdCap wiki: Angel Investors](https://adventure-capitalist.fandom.com/wiki/Angel_Investors)

**Clicker Heroes (hero souls, ancients, transcendence)**
- 1 hero soul per 2,000 combined hero levels. **Primal bosses** appear every 10 zones from zone 100 and always drop souls. Each hero soul held gives +10% DPS (classic version) — [Clicker Heroes official blog: Hero Souls guide](https://blog.clickerheroes.com/clicker-heroes-hero-souls-complete-guide-to-power-up/); [Clicker Heroes blog: Ascension guide](https://blog.clickerheroes.com/ascension-in-clicker-heroes-the-ultimate-guide/); [Fandom: Ascension](https://clickerheroes.fandom.com/wiki/Ascension)
- Players often treat zone 100 as the natural first ascension point because primal bosses start there — [Clicker Heroes blog: Ascension guide](https://blog.clickerheroes.com/ascension-in-clicker-heroes-the-ultimate-guide/)
- Souls buy **Ancients**, permanent upgrades with distinct playstyle roles. Siyalatas boosts DPS while idling. Argaiv boosts gilded heroes by +2% DPS per level. Guides advise levelling similarly priced ancients together (Argaiv, Siyalatas, Libertas, Mammon) — [Clicker Heroes blog: Ancients guide](https://blog.clickerheroes.com/clicker-heroes-ancients-the-essential-guide/); [Fandom: Ancients](https://clickerheroes.fandom.com/wiki/Ancients)
- **Transcendence** is the second layer. It resets ancients, gilds and hero souls in exchange for Ancient Souls, which are spent on "Outsiders" that strengthen ancients — same sources.

**Realm Grinder (abdication / reincarnation / factions)**
- **Abdication** resets buildings, upgrades and coins but keeps trophies, and pays out gems. Each gem gives +3% gold production — [Realm Grinder wiki: Abdication](https://realm-grinder.fandom.com/wiki/Abdication)
- **Reincarnation** (second layer) unlocks at 1e27 gems. It gives about +25% production per reincarnation and +500% offline production per reincarnation, and gradually unlocks new factions and content — [Realm Grinder wiki: Abdication](https://realm-grinder.fandom.com/wiki/Abdication); [PC Gamer Realm Grinder guide](https://www.pcgamer.com/realm-grinder-guide/)
- Player rule of thumb: abdicate when the pending gem reward equals about 2x the gems already owned (that is, when the next run will be about 3x stronger) — [Steam discussion "When i should use abdication"](https://steamcommunity.com/app/610080/discussions/0/2333276539605213303/)
- Each run makes the player choose a **faction** (Good, Evil or Neutral), which gives a strategic choice inside the prestige loop — [PC Gamer guide](https://www.pcgamer.com/realm-grinder-guide/) (summary; detailed faction numbers not retrieved)

**Egg, Inc. (soul eggs / eggs of prophecy)**
- Soul eggs come mainly from prestige and give +10% earnings each. Each Egg of Prophecy raises soul egg effectiveness by +5–10% and stacks multiplicatively. This is a **second, rarer currency that multiplies the first** — [Egg Inc wiki: Earnings Bonus/Soul Eggs](https://egg-inc.fandom.com/wiki/Earnings_Bonus/Soul_Eggs); [jzr.uz math explainer](https://jzr.uz/blog/egg-inc-mystical-eggs-math) [low-authority]

**NGU Idle (rebirth)**
- Early-game advice is about 30-minute rebirths. The rebirth reward gets big boosts at fixed elapsed-time marks (3, 5, 10, 30 and 60 min). Each rebirth also permanently lowers some training costs (up to a cap) — [Steam: "should i try the 30 min to 1 hour rebirth strategy?"](https://steamcommunity.com/app/1147690/discussions/0/3419934180314275606/); [NGU Idle wiki: Rebirths](https://ngu-idle.fandom.com/wiki/Rebirths)

**Antimatter Dimensions (layered resets)**
- Small resets come before the true prestige layers. **Dimension Boosts** reset dimensions and tickspeed to unlock new dimensions or boost all dimensions. **Antimatter Galaxies** reset everything Dimension Boosts reset, in exchange for stronger tickspeed upgrades — [AD wiki.gg: Prestige](https://antimatterdimensions.wiki.gg/wiki/Prestige); [AD wiki.gg: Dimension Boosts](https://antimatterdimensions.wiki.gg/wiki/Dimension_Boosts)
- **Infinity** (Big Crunch, at about 1.8e308 antimatter) is the first prestige layer and pays Infinity Points. **Eternity** (second layer) requires 1.798e308 IP and the 8th Infinity Dimension, adds Eternity Points, Time Dimensions and Time Studies, and keeps "milestones" that automate earlier layers — [AD Fandom: Eternity](https://antimatter-dimensions.fandom.com/wiki/Eternity); [AD wiki.gg: Prestige](https://antimatterdimensions.wiki.gg/wiki/Prestige)

**General prestige guidance**
- Pecorella (Kongregate) defines prestige as resetting most elements (generators, multipliers) for a prestige currency and/or persistent multipliers that speed up the next run, "similar to a New Game+". His "Math of Idle Games" part III covers prestige cycle balance — [Game Developer: The Math of Idle Games, Part I](https://www.gamedeveloper.com/design/the-math-of-idle-games-part-i); [Part III](https://www.gamedeveloper.com/design/the-math-of-idle-games-part-iii) (originally on Kongregate's dev blog, about 2016; full text not retrievable)
- "Well-tuned prestige triggers around a 2x to 4x speedup on the second run"; "set a first prestige window around 30–120 minutes"; "When a player resets, their next run should be visibly faster within the first 30 seconds… Prestige must feel like acceleration, not punishment" — [dev.to "I Built 7 Idle Games in 30 Days"](https://dev.to/aguier/i-built-7-idle-games-in-30-days-what-i-learned-about-incremental-design-5d3f) and [GridInc idle best practices](https://gridinc.co.za/blog/idle-games-best-practices) [low-authority; the search summary blended these two pages, so the exact attribution of each quote is uncertain]

### Inferences
- The two big franchises use similar maths. Cookie Clicker uses a cube root with +1% per chip. AdCap uses a square root with +2% per angel, and Realm Grinder pays +3% per gem. Root-based gain combined with a flat percentage per unit naturally creates diminishing returns, which pushes players to prestige again and again rather than once. For Pokémon Tycoon, a natural design is something like `prestigeTokens = floor(sqrt(lifetimeCatches / K))` or a formula based on lifetime money, at +2–10% each.
- Pokémon Tycoon's "zone level" (every 15 catches) maps closely onto Clicker Heroes zones. A Clicker Heroes-style "primal boss" (a guaranteed legendary every 10 zones from zone X that pays prestige currency) would fit the theme. Theme ideas: "Champion League / Hall of Fame" for the reset and "Badges" or "Master Balls" for the currency.
- Make prestige currency spendable, not only passive. Clicker Heroes ancients, Cookie Clicker heavenly upgrades and AdCap angel sacrifice all give a decision on top of the passive bonus. Keep the decision small for a solo developer: 5–8 permanent upgrades.
- For the number of layers, the small-game evidence points to **one prestige layer at launch**. A second layer (Transcendence / Reincarnation / Eternity) only arrives once the first is "solved" and often automated. Antimatter Dimensions' "milestones that automate earlier layers" is the model for adding a second layer later.
- Show a "next prestige gain" preview live, with a "x? faster" estimate. The Realm Grinder 2x rule shows that players work out timing themselves, so displaying it lowers friction.
- Everything above is client-side and feasible in vanilla JS with localStorage. No backend is needed.

### Gaps
- Could not read Pecorella's Part III text, so his exact recommended prestige cadence (for example "first prestige after X hours") is not verified.
- Cookie Clicker's typical real-time to first ascension (often said to be "a few hours to a day") is not sourced.
- The AdCap typical time to first reset is not sourced.
- Realm Grinder faction specifics were not retrieved.

## 2. Milestones / unlock multipliers, synergies, achievements with bonuses, collection bonuses

### Takeaway
Ownership milestones such as AdCap's 25/50/100/200/300/400 create short-term goals ("buy 7 more to hit 25") and break up the smooth x1.15 cost curve with visible jumps. Cookie Clicker turns achievements into power through milk and kitten upgrades, so collecting pays off mechanically. Both fit a Pokédex directly.

### Cited Findings
- **AdCap per-business milestones:** owning 25, 50, 100, 200, 300 and 400 of a business halves its time-to-profit (doubles speed). "Capitalist/Everything" unlocks are awarded when every business reaches a count; owning 25 of everything gives x2 speed to all businesses — [AdCap wiki: Unlocks (Earth)](https://adventure-capitalist.fandom.com/wiki/Unlocks_(Earth)); [AdCap wiki: Businesses](https://adventure-capitalist.fandom.com/wiki/Businesses)
- Higher AdCap milestones switch from speed to profit multipliers (for example the Bank unlock "It Prints Money" at 500 units gives x2 profit, and later unlocks give x3 and more) — [AdCap wiki: Unlocks (Earth)](https://adventure-capitalist.fandom.com/wiki/Unlocks_(Earth)) (via search summary)
- Pecorella's Part I covers how generator cost growth (typically 1.07–1.15) interacts with multiplier bumps — [Game Developer: Math of Idle Games I](https://www.gamedeveloper.com/design/the-math-of-idle-games-part-i) (text not retrieved; exact numbers not verified here)
- **Cookie Clicker milk:** each normal (non-shadow) achievement gives 4% milk. With 622 milk-counting achievements, the maximum base milk is 2,488%. **Kitten upgrades** unlock at milk thresholds and multiply CpS in proportion to milk, and they stack multiplicatively — [Cookie Clicker wiki: Milk](https://cookieclicker.wiki.gg/wiki/Milk); [cookieclickercalc kitten guide](https://cookieclickercalc.com/articles/kitten-upgrades-guide) [low-authority]; [Fandom: Upgrades](https://cookieclicker.fandom.com/wiki/Upgrades)
- Cookie Clicker also has a separate achievement family for golden cookies (clicking N golden cookies), which ties the active mechanic into collection — [Cookie Clicker wiki: Golden Cookie Achievements](https://cookieclicker.wiki.gg/wiki/Golden_Cookie_Achievements)
- Pecorella's GDC 2015 talk lists "goals/achievements" alongside rapid cost/reward curves and prestige as key idle mechanics — [GDC Vault: Idle Games: The Mechanics and Monetization of Self-Playing Games (2015)](https://www.gdcvault.com/play/1022065/Idle-Games-The-Mechanics-and); [Internet Archive copy](https://archive.org/details/GDC2015Pecorella)
- One designer heuristic orders upgrade value as: global multipliers first, then unlock gates (new features), then efficiency, then QoL/automation — [GridInc best practices](https://gridinc.co.za/blog/idle-games-best-practices) [low-authority]

### Inferences
- **Generator milestones:** apply AdCap's thresholds to the 4 generators, for example 10/25/50/100/200 owned giving x2 production for that generator, plus an "all generators at 25" bonus. This fits the existing buy-x10/MAX buttons, which already make it easy to reach thresholds.
- **Pokédex as milk:** each species caught or "completed" (for example 10 catches of it) gives +X% to all production or click damage. Completion bonuses could cover a whole rarity tier or the whole 24-species dex. This is the Cookie Clicker milk-to-kitten pattern applied to the existing collection, and it makes rare Pokémon worth hunting.
- **Achievements:** 20–40 achievements (catches, money, zone, crits, generators owned, prestige count) at +1–4% each, applied multiplicatively or additively. Each one gives a small dopamine hit and fills the gaps between bigger unlocks.
- **Synergy upgrades** (for example "Generator B +1% per Generator A owned", common in Cookie Clicker's later building upgrades from background knowledge, not verified here) cost little to implement and create purchase-order decisions.
- All of this is client-side.

### Gaps
- The exact multiplier table for all AdCap unlocks (which counts give x3, x5 and so on) was not retrieved.
- Cookie Clicker's kitten multiplier coefficients (for example Kitten helpers at 0.1 x milk) were not verified.

## 3. Random and active events: golden cookies, frenzies, timed boosts, active vs idle balance, combos

### Takeaway
Cookie Clicker's golden cookie is the canonical design: a clickable that spawns at a random time every 5–15 min and is short-lived. Its effects are an instant payout (Lucky), a long production multiplier (Frenzy x7 / 77 s) and a rare huge click multiplier (Click Frenzy x777 / 13 s). Upgrades shorten spawn time, which enables effects to overlap ("combos"). This rewards attention without punishing idle players, because the payouts are capped relative to production.

### Cited Findings
- **Spawn timing:** the time between golden cookies always falls between T_min and T_max, which start at 300 s and 900 s (5–15 min). Upgrades and prestige can bring the interval under 2 min. With all 3 golden-cookie upgrades, T_min is quartered to 75 s — [Cookie Clicker wiki: Golden Cookie](https://cookieclicker.wiki.gg/wiki/Golden_Cookie); [Fandom: Golden Cookie](https://cookieclicker.fandom.com/wiki/Golden_Cookie); [gameplayask spawn guide](https://gameplayask.blog/golden-cookie-spawn-times) [low-authority]
- **Effects:**
  - Lucky! (about 40%): gain the lesser of 15% of banked cookies + 13 and 15 min of CpS (CpS x 900) + 13.
  - Frenzy (about 40%): x7 CpS for 77 s.
  - Click Frenzy (about 3%): x777 click power for 13 s.
  - Building special (about 8%).
  - Blab (about 0.003%).
  - [Cookie Clicker wiki: Golden Cookie](https://cookieclicker.wiki.gg/wiki/Golden_Cookie); [Fandom: Golden Cookie](https://cookieclicker.fandom.com/wiki/Golden_Cookie); [cookieclickernew combos explainer](https://cookieclickernew.com/blog/golden-cookie-combos-frenzy-click-frenzy-devastation/) [low-authority]
- **Combos:** a full Frenzy + Click Frenzy overlap needs Click Frenzy to start within 64 s of Frenzy (128 s with upgrades), which is impossible at base T_min = 300 s and possible but not guaranteed at 75 s. Combos are therefore a mid-game, upgrade-unlocked skill expression — [Cookie Clicker wiki: Golden Cookie](https://cookieclicker.wiki.gg/wiki/Golden_Cookie)
- **Wrath cookies** (the risky variant, which appears more often in the Grandmapocalypse) add a gamble: they can give penalties or bigger rewards — [Cookie Clicker wiki: Wrath Cookie](https://cookieclicker.wiki.gg/wiki/Wrath_Cookie) (effect details not retrieved)
- **Active/idle split:** one recommendation is roughly "60% of progress from idle mechanics, 40% from active engagement". Early hours should be more active to teach the loop before automation takes over — [GridInc best practices](https://gridinc.co.za/blog/idle-games-best-practices) [low-authority, unsourced ratio; treat as heuristic]
- **Idle vs active as player identity:** Clicker Heroes' Siyalatas (idle DPS ancient) versus click-oriented ancients let players pick a build — [Clicker Heroes blog: Ancients guide](https://blog.clickerheroes.com/clicker-heroes-ancients-the-essential-guide/). Realm Grinder offers a similar choice through factions — [PC Gamer guide](https://www.pcgamer.com/realm-grinder-guide/)
- **Criticism:** a Hacker News commenter lists "massively increased rewards due to active gameplay" among idle-game dark patterns, alongside paid resources, daily gambling rewards and reset-based systems — [HN comment thread (2021)](https://news.ycombinator.com/item?id=29635166) (anecdotal opinion)

### Inferences
- **Pokémon-themed golden cookie:** a "Shiny Pokémon" or "Wandering Legendary" that appears every 3–10 min, stays about 13–15 s, and on click gives a random effect:
  - "Lucky" money: min(15% bank, 15 min of production).
  - "Frenzy": x7 production for 77 s, or a thematic x5 / 60 s.
  - Rare "Click Frenzy": x50–x777 click damage for 10–13 s, which suits the existing click/HP catch loop well.
  - "Catch burst": next N catches are instant.

  This is about 50–100 lines of vanilla JS: a timer, an absolutely positioned sprite, and an effect table with weights.
- Cap active payouts relative to production, as Lucky does (min of a bank share and a time share), so active play speeds things up without invalidating idle play or the 8h offline earnings.
- Add upgrades that shorten the spawn interval or extend effect duration (like Lucky day / Serendipity / Get lucky) as a mid-game sink. They also make combos possible later.
- Click combo: Pokémon Tycoon already has crits (x3). A short "combo meter" (consecutive clicks within N ms build a stacking +x% that decays) would reward active play during click frenzies. This is an inference, not sourced from a specific game.

### Gaps
- Exact chances for the rarer golden cookie effects (Cookie chain, Cookie storm, Dragonflight, Elder frenzy) were not retrieved.
- No primary-source figure was found for how much retention golden cookies add.

## 4. Daily and session hooks: daily rewards, quests, streaks, timed events, and dark-pattern criticism

### Takeaway
Daily login rewards and streaks are standard in mobile F2P idle games, but they are the most criticised retention tool. Streaks that reset on a missed day turn play into obligation ("brushing their teeth"). A solo web idle game benefits more from **non-punitive** session hooks: offline earnings (already present), short optional quests, and a daily bonus that does not reset a streak.

### Cited Findings
- Pecorella (GDC 2015) argued that idle games "allow progress without interaction, rewarding players for returning after periods of idleness." Idle games had "some of the best retention rates" and were among the most played games on Kongregate in 2015. The talk listed monetisation via cash infusions, boost multipliers and protective purchases — [GDC Vault (2015)](https://www.gdcvault.com/play/1022065/Idle-Games-The-Mechanics-and); [Kongregate blog summary](https://blog.kongregate.com/idle-games-mechanics-and-monetization-of-self-playing-games/); [Game Developer video post](https://www.gamedeveloper.com/business/video-the-mechanics-and-monetization-of-self-playing-games)
- Criticism of daily rewards: streaks that reset when you miss a day are described as "the ultimate example" of FOMO manipulation. Players log in "not because they're excited to play, but because it feels like brushing their teeth" — [ScreenWise "The Secret Science of the Streak"](https://screenwiseapp.com/guides/game-reward-systems-and-the-psychology-of-daily-challenges) [popular/advocacy source]; [Rafael Lima, "habit formation in games" (Substack)](https://limarafael.substack.com/p/habit-formation-in-games)
- Academic framing: dark patterns "leverage… fear of missing out (FOMO) and loss aversion" and are especially concerning for youth — [ScienceDirect systematic review on dark patterns and youth (2026)](https://www.sciencedirect.com/science/article/pii/S1875952126000443); [arXiv 2207.09928 on protecting children from manipulative game design](https://arxiv.org/pdf/2207.09928)
- A journal article explicitly titled "Idle Games: A Cozy Genre Turned Exploitative" (Replay journal, University of Łódź) exists — [Replay article page](https://www.czasopisma.uni.lodz.pl/Replay/article/view/23588) (content not retrieved)
- Path of Exile co-creator Chris Wilson's widely shared critique of manipulative live-service tricks (2025/2026 coverage) — [GamesRadar](https://www.gamesradar.com/games/when-i-was-growing-up-games-were-designed-to-be-fun-not-manipulative-path-of-exile-co-creator-shines-a-blacklight-on-the-bulls-t-design-tricks-infesting-all-my-live-service-games/)
- **"Quest for Progress"**, Pecorella's GDC Europe 2016 talk on goals and quests in idle games — [SlideShare deck](https://www.slideshare.net/slideshow/quest-for-progress-gdc-europe-2016/65405507) (slides not retrieved)

### Inferences
- **Recommended for Pokémon Tycoon:**
  - A once-per-day "Professor's gift" (for example 30 min of production or a free temporary boost), with no streak reset. If a streak is used, make it cumulative (total days), not consecutive.
  - 3 rotating "missions" (catch 20 Pokémon, land 50 crits, buy 10 generators), regenerated on completion or daily by local clock, paying boosts or prestige-adjacent currency.
  - Seasonal or timed events (for example a Halloween Ghost-type spawn rate) driven by `new Date()`. These need no backend, but local clocks can be cheated, which is harmless in a single-player game.
- Leaderboards, cloud saves, server-validated daily rewards and real-money purchases **require a backend**. Flag these as out of scope for vanilla JS + localStorage.
- Avoid loss-aversion mechanics (expiring rewards, streak resets, "come back or lose it") and paid boosts. They are the specific items design critics target, and with no monetisation they bring no benefit.

### Gaps
- No quantitative data was found on how much D1/D7 retention daily rewards add in idle games specifically.
- The content of Pecorella's "Quest for Progress" deck was not retrieved.

## 5. Pacing: unlock cadence, first 5/30/60 minutes, mid-game walls, late-game automation

### Takeaway
Repeated advice (mostly from practitioner blogs; primary Kongregate texts were inaccessible):
- Show passive growth within the first minute.
- Introduce a new mechanic or "phase transition" every few minutes early on, roughly 3–5 min per phase.
- Deliver a first automation, a first big multiplier and a first offline return in session 1.
- Place the first prestige at about 30–120 min.
- Turn tedious repetitive actions into automation later (auto-buyers, autoclickers), as Antimatter Dimensions does with milestones that automate earlier layers.

### Cited Findings
- "Within the first minute the game must show numbers going up without input." Each phase transition should take 3–5 minutes of active play, with first growth in 2–5 min and "three feedback loops in 10 minutes" — [dev.to "I Built 7 Idle Games in 30 Days"](https://dev.to/aguier/i-built-7-idle-games-in-30-days-what-i-learned-about-incremental-design-5d3f) / [GridInc](https://gridinc.co.za/blog/idle-games-best-practices) [low-authority, blended summary]
- The first session should deliver three "aha" moments: first automation, first big multiplier, first offline check-in. "The best upgrades create phase transitions — the player goes from active clicking to passive income… Too fast and the player burns through content. Too slow and they leave." — same sources [low-authority]
- First prestige window about 30–120 min, with a 2–4x speed-up on run 2 — same sources [low-authority]
- NGU Idle players settle on about 30-min early rebirths, and the game rewards specific run lengths (3/5/10/30/60 min marks) — [Steam NGU discussion](https://steamcommunity.com/app/1147690/discussions/0/6306822998896734569/); [NGU wiki: Rebirths](https://ngu-idle.fandom.com/wiki/Rebirths)
- **Automation as reward:** Antimatter Dimensions keeps "Eternity Milestones" through resets, which automate earlier-layer actions — [AD Fandom: Eternity](https://antimatter-dimensions.fandom.com/wiki/Eternity). Some games add an upgradable auto-action tool that eventually beats manual clicking, and click cooldowns that prevent nonstop clicking from dominating — [GridInc](https://gridinc.co.za/blog/idle-games-best-practices) [low-authority]
- **Taxonomy:** Alharthi, Alsaedi, Toups Dugas, Tanenbaum & Hammer, "Playing to Wait: A Taxonomy of Idle Games", CHI 2018. They analysed 66 idle games (plus 10 non-idle controls) with grounded theory across play, mechanics, rewards, interactivity, progress rate and UI. Key claim: idle games "move players from playing to planning" and make unusual use of player attention and computer cycles — [Monash research portal](https://research.monash.edu/en/publications/playing-to-wait-a-taxonomy-of-idle-games/); [NSF PAR copy](https://par.nsf.gov/biblio/10061230)

### Inferences
Proposed cadence for Pokémon Tycoon (inferred from the sources above, to be tuned with playtesting):
- **0–1 min:** first catch, first generator. Passive money is visible.
- **1–5 min:** second generator, first upgrade, first rarity. The zone 2 level-up at 15 catches is already in this window.
- **5–15 min:** first milestone bonus (for example 10 or 25 of generator 1), first achievements, first "shiny" random event, missions unlocked.
- **15–45 min:** all 4 generators, Pokédex bonus visible, an auto-catch / auto-click upgrade (the "first automation" moment).
- **30–120 min:** prestige unlocks with a preview of gain. The second run should be 2–4x faster and visibly so within 30 s (for example by starting with a free generator or keeping some upgrades).
- **Later:** auto-buyers for generators and upgrades, bought with prestige currency, so repeated runs do not become tedious re-clicking.

Additional points:
- With only 4 generators and 3 upgrades, the current game probably runs out of new content within the first 15–30 min. That is exactly where milestones, achievements, events and prestige need to fill the gap.
- Auto-click or auto-catch fits the existing click-to-damage mechanic as a purchasable "Pokémon helper" that deals X% of click damage per second.

### Gaps
- Primary Kongregate/Pecorella pacing numbers (for example cost growth bases and recommended time-to-first-prestige in AdCap) could not be verified because those pages were blocked.
- No measured data was found on session length or retention by minute for any specific idle game.

## 6. Why players quit idle games, and what design writing says

### Takeaway
Players quit most often at **walls**, where progress becomes so slow that a prestige takes days ("outpaced by snails"). They also quit when content runs out too fast, or when there are no meaningful choices so the game turns into waiting. Critics add that manipulative retention (FOMO streaks, active-play penalties) creates resentment. The fixes in the literature are: prestige as acceleration, frequent small goals, choices in prestige spending, and automation of chores.

### Cited Findings
- Player complaints on itch.io and Steam describe progression becoming "outpaced by snails" after balance changes, and prestiges "taking days" while still requiring daily adjustments. Players contrast the steady progress of Cookie Clicker and Clicker Heroes with games where they get stuck — search summary of [itch.io comment](https://itch.io/post/8871150), [itch.io comment](https://itch.io/post/10685174), [Steam: Nomad Idle discussion](https://steamcommunity.com/app/3042190/discussions/0/601900862720228255/?ctp=2) (anecdotal)
- "Too fast and the player burns through content. Too slow and they leave." — [dev.to / GridInc](https://gridinc.co.za/blog/idle-games-best-practices) [low-authority]
- "If they don't feel the difference immediately, the prestige system has failed." — same [low-authority]
- Hacker News critique of idle-game dark patterns: paid resources, much higher rewards for active play, daily gambling rewards, reset systems — [HN (2021)](https://news.ycombinator.com/item?id=29635166)
- Alharthi et al. (CHI 2018) frame the core idle experience as planning rather than playing — [Monash portal](https://research.monash.edu/en/publications/playing-to-wait-a-taxonomy-of-idle-games/). Inference: when nothing is left to plan, the player is only waiting.
- Pecorella GDC 2015: the compelling loop is "rapid cost/reward growth curves that create a satisfying sense of progress, goals/achievements, and prestiging" — [GDC Vault](https://www.gdcvault.com/play/1022065/Idle-Games-The-Mechanics-and)

### Inferences
Risks and mitigations for Pokémon Tycoon:
- **Wall risk:** x1.15 cost growth with only +10%/level production upgrades means growth will hit a wall. Milestone multipliers (x2 at thresholds) and prestige are the standard ways to restore exponential pace.
- **No-choice risk:** the 3 upgrades are linear. Adding prestige-tree choices or idle-vs-click specialisation (Clicker Heroes ancients / Realm Grinder factions) creates planning.
- **Too-fast risk:** 24 species and 4 generators run out quickly. Gating Pokédex completion behind zones or rarity and adding prestige-only species (for example legendaries after the first prestige) extends the content.
- **Avoid:** streak penalties, expiring rewards, and making active play mandatory (keep golden-cookie-style payouts capped).

### Gaps
- Could not access r/incremental_games threads or wiki (reddit fetch blocked), so there are no highly upvoted community quotes.
- Sebastian Deterding's "Progress Wars" and the Eric Guan and Ryan Seal design posts named in the brief were not found or accessed.
- No GDC or Game Developer article with quantitative churn data for idle games was retrieved.
