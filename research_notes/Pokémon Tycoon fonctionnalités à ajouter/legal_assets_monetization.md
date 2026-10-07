# Pokémon Tycoon — Legal/IP risk, legal pixel-art sources, browser idle-game monetization

> Research notes (English) for a French final report. Not legal advice. Date of research: 2026-10-07.
> Network note: many primary sites were blocked by the proxy (Wikipedia, docs.crazygames.com, kenney.nl, opengameart.org, pokeclicker.com, automaton-media.com, videogameschronicle.com, Polygon, The Verge, Eurogamer, GamesIndustry.biz). Facts from those sites come from search-result snippets or secondary sources and are marked as such.

## 1. How do Nintendo / The Pokémon Company (TPC) actually enforce against fan games, and what is the latest on Palworld and PokéClicker?

### Takeaway
Enforcement is selective but real. Big DMCA waves hit fan games that were popular, got press, used official assets, or tried to make money. Small non-commercial browser projects such as PokéClicker have stayed online for years. The Palworld patent suit (Japan) has shrunk to pre-patch versions and small damages, but it shows TPC will also use patents against commercial monster-catchers.

### Cited Findings
**Fan-game takedown history**
- Pokémon Uranium was in development for 9 years and released on 6 Aug 2016. It was downloaded 1.5 million times in its first week, then received a Nintendo DMCA request that removed all download links — [Wikipedia: Pokémon Uranium (search snippet)](https://en.wikipedia.org/wiki/Pok%C3%A9mon_Uranium); [TheWrap](https://www.thewrap.com/pokemon-uranium-nintendo-go/)
- Pokémon Prism (a ROM hack) got a cease and desist in Dec 2016, just before release, and later leaked online anyway. The Uranium and Prism takedowns made many fan devs "more cautious about the release and marketing of their own projects" — [Nintendo Life](https://nintendolife.com/news/2016/12/fan-made_pokemon_prism_game_leaks_online_after_nintendo_shutdown_notice); [Wikipedia: Pokémon Prism (snippet)](https://en.wikipedia.org/wiki/Pok%C3%A9mon_Prism)
- On 2 Sep 2018, Nintendo of America sent a DMCA notice covering 562 fan games on Game Jolt (Mario, Zelda, Pokémon, etc.). Game Jolt locked the pages so only the developer could see them, and published the notices on GitHub — [GamesBeat](https://gamesbeat.com/nintendo-allegedly-files-dmca-takedown-notice-over-more-than-550-fans-games/); [BGR](https://www.bgr.com/entertainment/nintendo-dmca-fan-games-game-jolt/); [TechRaptor](https://techraptor.net/content/nintendo-game-jolt-dmca)
- In March 2024, a DMCA takedown sent to Relic Castle, a forum for Pokémon fan games, led its owner to shut the whole site down. Pixelmon and Brick Bronze (a Roblox Pokémon game) were also taken down. Battle simulators such as Pokémon Showdown, and NetBattle before it, have gone untouched for decades — [PokéBase community Q&A (low-authority source)](https://pokemondb.net/pokebase/310338/will-pokemon-showdown-get-taken-down); [Axios, 2022](https://www.axios.com/2022/01/24/fan-made-game-escapes-nintendo)
- PokeMMO has run since 2012 in a grey zone: users must supply their own Pokémon Fire Red ROM, so the client does not ship Nintendo assets — [Sportskeeda](https://www.sportskeeda.com/pokemon/is-pokemmo-worth-playing-2024); [Tom's Guide](https://tomsguide.com/us/gaming-pokemon-classic-mmorpg,news-16114.html)

**What TPC's former lawyer says (key quote for the report)**
- Don McGowan, former chief legal officer of TPC, told Aftermath (2024) that the company usually learns about fan projects through press coverage: "the worst thing on earth is when your 'fan' project gets press, because now I know about you." Press alone is not usually enough for a takedown. Action comes when developers try to make money: "You wait to see if they get funded (for a Kickstarter or similar) – if they get funded then that's when you engage." He also said "no one likes suing fans" — [Aftermath](https://aftermath.site/pokemon-lawyer-cease-desist-fan-project-pikachu-movie); [VGC summary](https://videogameschronicle.com/news/former-pokemon-lawyer-says-fundraising-and-press-coverage-lead-to-fan-project-takedowns); [LevelUp](https://www.levelup.com/en/news/lawyer-reveals-how-the-pokemon-company-discovers-and-cancels-fan-projects)

**PokéClicker (closest comparable: a Pokémon browser idle game)**
- PokéClicker describes itself as "A game about catching Pokémon, defeating gym leaders, and watching numbers get bigger." It is playable at pokeclicker.com, its README says "PokéClicker is still in development!", and it is open source on GitHub with a Discord community — [GitHub README (raw, fetched)](https://raw.githubusercontent.com/pokeclicker/pokeclicker/develop/README.md)
- It is still actively developed: release v0.10.26 is on GitHub, and the repo has about 5,750 commits on develop, about 376 open issues and about 113 open PRs — [GitHub release v0.10.26](https://github.com/pokeclicker/pokeclicker/releases/tag/v0.10.26); [GitHub repo](https://github.com/pokeclicker/pokeclicker)
- A third-party desktop (Electron) wrapper, "Pokeclicker-desktop" by RedSparr0w, exists on GitHub — [GitHub releases](https://github.com/RedSparr0w/Pokeclicker-desktop/releases)
- I found no source saying PokéClicker has had a takedown, has been renamed, or is on Steam — [search result summary of pokeclicker sources](https://www.pocketgamer.com/pokemon-sun-pokemon-moon/nintendo-moves-to-shut-down-pokemon-fan-game-creator/) (no mention found)

**Palworld lawsuit (Nintendo + TPC v. Pocketpair)**
- The suit was filed in Tokyo District Court in Sept 2024 over 3 patents tied to monster-catching gameplay. Damages sought are ¥5M each for Nintendo and TPC (¥10M total, about US$66k) plus late-payment interest — [PC Gamer](https://www.pcgamer.com/games/survival-crafting/palworld-developer-reports-nintendos-suing-over-3-pokemon-patents-for-only-usd66-000-in-damages-but-a-videogame-ip-lawyer-says-fighting-the-lawsuit-could-mean-burning-millions-of-dollars/); [GameFile](https://www.gamefile.news/p/nintendo-pokemon-palworld-pocketpair-lawsuit)
- Pocketpair patched the game in "preventive" updates, for example removing the ability to summon Pals by throwing Pal Spheres and changing gliding. Nintendo/TPC then narrowed the claims to pre-patch versions sold in Japan only (reported Nov 2025) — [Automaton West (search snippet)](https://automaton-media.com/en/news/nintendo-and-the-pokemon-company-have-reportedly-narrowed-palworld-lawsuit-to-older-versions-of-the-game-only-likely-thanks-to-preventive-updates-by-pocketpair/)
- The Japan Patent Office kept a Nintendo patent central to the case rejected, in an "unusually sharp-tongued notice" — [Automaton West (snippet)](https://automaton-media.com/en/news/nintendo-patent-central-to-palworld-lawsuit-stays-rejected-as-jpo-shuts-down-objections-in-unusually-sharp-tongued-notice/)
- 2026 coverage: VGC reports the "lawsuit nears end with Nintendo reportedly poised to gain almost nothing". An expert quoted by PC Gamer and GamesRadar says Nintendo has "zero chance" at more than "chump change" (about ¥5M, roughly US$30k), against a reported US$40M loss from patent litigation in Nintendo's last business year. Pocketpair's John Buckley says the case "impacted morale" and development — [VGC](https://www.videogameschronicle.com/news/palworld-lawsuit-nears-end-with-nintendo-reportedly-poised-to-gain-almost-nothing/); [PC Gamer](https://www.pcgamer.com/games/survival-crafting/nintendos-legal-battle-with-palworld-looks-shakier-than-ever-it-may-only-get-usd30-000-chump-change-if-it-wins-at-all/); [GamesRadar](https://www.gamesradar.com/games/survival/nintendo-palworld-lawsuit-has-zero-chance-at-more-than-chump-change-expert-says-but-pocketpair-lead-says-it-has-impacted-morale-and-development/)
- Secondary or low-authority sites claim three things: evidence presentation on 1 Oct 2026 with an opinion on 9 Nov 2026; the USPTO rejecting all 26 claims of Nintendo's US "summoning" patent as obvious; and Palworld 1.0 releasing on 10 July 2026. None of these is confirmed by a primary source here — [OpenClassActions](https://openclassactions.com/news/palworld-nintendo-patent-lawsuit-update-july-2026.php); [Lawfold](https://lawfold.com/nintendo-palworld-patent-lawsuit/); [The Lawyer World](https://thelawyerworld.com/blog/nintendo-palworld-lawsuit-update-the-patent-fight-heads-to-its-october-reckoning/)
- In Jan 2024, McGowan said he was surprised Palworld "got this far" — [Nintendo Life](https://ds.nintendolife.com/news/2024/01/pokemons-former-chief-legal-officer-surprised-palworld-got-this-far)

### Inferences
- The pattern behind enforcement is a mix of visibility (press, virality, big download numbers), money (crowdfunding, sales, ads), and official assets (ROM hacks, ripped sprites). Uranium (1.5M downloads plus press), Prism (press before launch) and Game Jolt (bulk sweep of a hosting platform) all fit. A small hobby browser idle game with emojis and no monetization is low risk today. Risk rises sharply if it uses ripped sprites, goes viral, appears on portals, or is monetized.
- The usual first step is a DMCA notice or cease and desist to the host (GitHub, itch.io, Game Jolt, a domain host), not a lawsuit against an individual fan. The realistic worst case for a hobby project is losing the hosting and the work invested in Pokémon-branded content. Damages are a remote risk unless money is involved.
- PokéClicker's survival is not a licence. It shows tolerance, not permission, and could change at any time.
- Palworld shows that even an original-art game can be sued over patents once it is a huge commercial hit. That matters very little for a tiny idle clicker (no throwing or summoning mechanics, and not in Japan's market at scale), but it confirms TPC is litigious against commercial competitors.

### Gaps
- No official TPC/Nintendo policy page on fan games was found. Nintendo has a "Game Content Guidelines for Online Video & Image Sharing Platforms", but it covers videos, not games, and I could not fetch it.
- The exact Palworld court dates in Oct/Nov 2026 and any final judgment are not confirmed by primary or major-press sources (VGC and Automaton pages were blocked; only snippets seen).
- I could not confirm whether PokéClicker carries a disclaimer, accepts donations, or has ever had a C&D (pokeclicker.com blocked). I found no evidence of a Steam release.

## 2. What exactly is protected (trademark, copyright, patents), and are game mechanics or names alone protectable? (EU/France angle)

### Takeaway
Three layers matter. Copyright covers sprites, artwork, designs, music and code, and is the highest risk if copied. Trademarks cover "Pokémon", "Poké Ball", "Pokédex", logos and likely many species names; using them in a title, branding or commerce is risky. Patents cover specific technical implementations, mostly in Japan. Abstract game mechanics (catch, collect, click, idle) are not protected by copyright in the EU, but the fictional characters and their names/designs are.

### Cited Findings
- EU law (Software Directive, CJEU *SAS Institute v World Programming*, 2012) protects the expression of a program (source and object code) but "not … ideas or principles underlying the software". The functionality of a program cannot be protected by copyright — [Fieldfisher](https://www.fieldfisher.com/en/insights/cjeu-rules-on-the-scope-of-copyright-protection-for-computer-programs); [Business Insurance](https://www.businessinsurance.com/eu-court-limits-copyright-protection-for-software/); [opensource.com](https://opensource.com/law/12/5/sas-v-wpl)
- Patents, unlike copyright, can cover specific gameplay implementations. Nintendo's Palworld suit is based on 3 Japanese patents on monster-capture and summoning features. Pocketpair avoided them by changing those mechanics in patches — [PC Gamer](https://www.pcgamer.com/games/survival-crafting/palworld-developer-reports-nintendos-suing-over-3-pokemon-patents-for-only-usd66-000-in-damages-but-a-videogame-ip-lawyer-says-fighting-the-lawsuit-could-mean-burning-millions-of-dollars/); [Automaton West (snippet)](https://automaton-media.com/en/news/nintendo-and-the-pokemon-company-have-reportedly-narrowed-palworld-lawsuit-to-older-versions-of-the-game-only-likely-thanks-to-preventive-updates-by-pocketpair/)
- Sprites, even in community datasets, remain TPC copyright. The PokeAPI sprites LICENCE file says: "All image contents within are Copyright The Pokémon Company." The CC0 licence of that repo applies only "to the extent that [the affirmer] is an owner" of the rights, so it cannot pass on TPC's rights — [PokeAPI/sprites LICENCE.txt (fetched)](https://raw.githubusercontent.com/PokeAPI/sprites/master/LICENCE.txt)
- Sprites on The Spriters Resource are ripped from copyrighted games, and the copyright "most likely" belongs to the developer. Users "don't technically have the rights to" them, and using them "for monetary gain" isn't okay — [Spriters Resource FAQ (search snippet; page blocked)](https://spriters-resource.com/page/faq); [itch.io forum discussion](https://itch.io/post/6153373)
- Tom's Guide on the 2018 sweep: "Nintendo Has Every Right to Destroy Your Fan Games" (fan games built on its characters infringe its IP) — [Tom's Guide](https://www.tomsguide.com/us/nintendo-dmca-takedown,news-23372.html)

### Inferences
- Current Pokémon Tycoon elements ranked by risk (my assessment):
  - Lowest: the mechanics (idle clicking, catching, collecting, upgrades, rarity tiers). Not protected by copyright in the EU, and Nintendo's patents target specific real-time throw/summon implementations, not an idle clicker.
  - Medium: species names (Pikachu, Mewtwo, Dracaufeu…), item names (Poké Ball, Super Ball, Hyper/Ultra Ball) and "Pokédex". These are trademarks and character names. Using them non-commercially in a fan game is tolerated in practice, but they become the hook for a takedown once the game is public or visible.
  - High: "Pokémon" in the game's title ("Pokémon Tycoon"). It is the brand itself and makes the project easy to find in searches and DMCA sweeps.
  - Highest: real Pokémon sprites or artwork (ripped or redrawn), official music, or logos. This is direct copyright infringement, and DMCA notices typically target it.
  - Monetization of any of the above changes the analysis completely.
- Emojis as placeholders are fine. Emoji fonts are licensed by their vendors (Apple, Google Noto, Twemoji CC-BY), and generic animal emojis are not Pokémon.
- French and EU law have no broad US-style "fair use". France has narrow exceptions (parody/pastiche/caricature, short quotation), and a full playable game built on someone's characters would not obviously fit them. A disclaimer ("not affiliated with Nintendo") does not create a legal right. It only signals good faith and reduces confusion about who made the game.

### Gaps
- I did not retrieve EUIPO/INPI registration records for "Pokémon", "Poké Ball" or "Pokédex", or for French species names. Registration is very likely but not verified here.
- I found no primary source on French case law about fan games. The CPI (Code de la propriété intellectuelle) parody exception (art. L122-5) is mentioned from general knowledge, not a fetched source.
- I found no source evaluating whether short species names alone, without art, are protectable as copyright under French law.

## 3. Safe paths: fan-game best practices, original creature roster, generic terms, successful original-IP monster collectors

### Takeaway
The safest route is to keep the genre and drop the IP: an original creature roster with original names and art, generic item and menu terms, and a title without "Poké". The genre is crowded with successful original-IP games (Palworld, Temtem, Cassette Beasts, Coromon), which shows that "monster collecting" itself is free to use. If the developer keeps Pokémon content, the defensive posture is non-commercial, low-profile, original art only, and a disclaimer.

### Cited Findings
- Cassette Beasts (Bytten Studio) uses original monsters recorded onto cassette tapes, with a fusion system and over 100 forms. A sequel, "Cassette Beasts 2002" with over 250 beasts and online multiplayer, was announced in 2026. Temtem is an online creature-collection game with a spin-off, Temtem: Pioneers. Coromon (TRAGsoft, 2022) got "Coromon Remastered" in 2026 and sticks closely to the creature-catching RPG formula — [Gfinity Esports](https://www.gfinityesports.com/article/best-games-like-pokmon-that-arent-made-by-nintendo); [KeenGamer](https://www.keengamer.com/articles/lists/10-best-monster-tamer-rpgs-ranked/)
- Even Palworld, with original art, faced a patent suit, not a copyright one. Pocketpair responded by changing specific mechanics rather than its creatures — [Automaton West (snippet)](https://automaton-media.com/en/news/nintendo-and-the-pokemon-company-have-reportedly-narrowed-palworld-lawsuit-to-older-versions-of-the-game-only-likely-thanks-to-preventive-updates-by-pocketpair/); [GamesRadar](https://www.gamesradar.com/games/survival/nintendos-palworld-lawsuit-came-as-a-shock-to-pocketpair-because-patent-infringement-was-something-that-no-one-even-considered/)
- After Uranium and Prism, fan devs became "more cautious about the release and marketing" of projects. Low visibility and no crowdfunding are the levers McGowan named — [Wikipedia snippet via search](https://en.wikipedia.org/wiki/Pok%C3%A9mon_Prism); [Aftermath](https://aftermath.site/pokemon-lawyer-cease-desist-fan-project-pikachu-movie)
- Monster-tamer devs Temtem and Cassette Beasts have spoken about how they distinguish themselves from Pokémon (feature: "Monsters Outside Of Your Pocket") — [Halftone Mag](https://halftonemag.com/games/monsters-outside-of-your-pocket/) (not fetched; title only)

### Inferences
- A practical de-risking checklist (my synthesis):
  1. Rename the game: no "Poké", no "-mon" suffix that imitates the brand, no "Pikachu"-like puns.
  2. Rename items to generic terms. "Capture orb / Sphère / Filet", or tiered names like "Basic / Great / Master capsule", avoid "Poké Ball / Super Ball / Hyper Ball / Master Ball". "Bestiaire", "Codex" or "Encyclopédie" avoid "Pokédex".
  3. Build an original roster of creatures. Using real animals plus elements (fire, water…) is fine, since types and elemental rock-paper-scissors are generic. Avoid one-to-one silhouettes and colour schemes of famous Pokémon, such as a yellow electric mouse with red cheeks.
  4. Use original or properly licensed art only.
  5. Avoid the throw-to-capture and summon-from-ball mechanics in the Palworld patents. These matter mostly for Japan and are unlikely to matter for an idle clicker.
- If the developer insists on keeping Pokémon content as a private or friends-only hobby: no ads, no donations tied to the game, no crowdfunding, no portal submission, no press/Reddit marketing, no ripped sprites, and a clear "unofficial fan project, not affiliated with Nintendo/Game Freak/The Pokémon Company; Pokémon © its owners" disclaimer. The disclaimer helps against consumer confusion but does not legalise use of the IP.
- A practical hybrid: put the creature data (names, art paths) in a data file so a "Pokémon" fan skin and an original skin can be swapped. Publish only the original skin publicly.

### Gaps
- I found no study quantifying how often non-monetized browser Pokémon fan games get C&Ds. The evidence is anecdotal.
- I found no lawyer-authored source on how close creature designs can be before "substantial similarity" applies in French/EU law.

## 4. Where can the developer get legally usable pixel art (and why ripped sprites are unsafe)?

### Takeaway
Use CC0 first (Kenney, CC0 packs on OpenGameArt and itch.io), then CC-BY with attribution. Read every itch.io pack's actual licence text, because tags and descriptions can conflict. Commissioned art and self-made art (Aseprite, LibreSprite, Piskel) give the cleanest ownership. Ripped sprites (Spriters Resource, PokeAPI) remain TPC copyright whatever the repo's licence says. AI-generated sprites are usually not copyrightable in the US and carry reputational risk.

### Cited Findings
**Free/licensed asset sources**
- Kenney: "All game assets on Kenney's asset pages are public domain licensed (CC0), and you're free to use them, even in commercial projects." Attribution is not required (crediting "Kenney" is optional). There are over 40,000 assets in 270+ packs — [Kenney support page (search snippet; site blocked)](https://kenney.nl/support); [Cinevva guide to free 2D sprites (2026)](https://app.cinevva.com/guides/free-2d-sprites-tilesets)
- On itch.io, CC0 assets can be used commercially. A pack's description can conflict with its tag (for example, "attribution not mandatory" but tagged CC-BY 4.0). Vague "free for commercial use" wording isn't a real licence, and invented "CC-" licences (e.g. "CC-NR") aren't Creative Commons — [itch.io forum](https://itch.io/post/245672); [itch.io forum](https://itch.io/post/13394689)
- OpenGameArt hosts assets under CC0, CC-BY, CC-BY-SA, GPL and OGA-BY. I could not fetch the FAQ, so licence descriptions here come from general knowledge: CC-BY requires credit; CC-BY-SA requires sharing derivative art under the same licence. Example of a Kenney pack mirrored there: [OpenGameArt "Emotes pack"](https://opengameart.org/content/emotes-pack)

**Ripped sprites**
- PokeAPI sprites: "All image contents within are Copyright The Pokémon Company." The repo's CC0 dedication does not and cannot cover TPC's images — [PokeAPI/sprites LICENCE.txt](https://raw.githubusercontent.com/PokeAPI/sprites/master/LICENCE.txt)
- Spriters Resource sprites are ripped from copyrighted games. Users don't have rights to them, and the site's FAQ (per snippet) discourages using them for monetary gain — [Spriters Resource FAQ (snippet)](https://spriters-resource.com/page/faq)

**AI-generated sprites**
- The US Copyright Office's Report Part 2 (29 Jan 2025) says AI outputs are protectable "only where a human author has determined sufficient expressive elements". Prompts alone are not enough — [Promise Legal blog](https://blog.promise.legal/ai-generated-game-assets-copyright/)
- In *Thaler v. Perlmutter*, the D.C. Circuit affirmed on 18 Mar 2025 that a machine can't be an author. The US Supreme Court denied certiorari on 2 Mar 2026 — [Bloomberg Gov](https://news.bgov.com/daily-labor-report/d-c-circuit-declines-to-rehear-ai-art-copyrightability-case); [News Tribune (AP)](https://www.newstribune.com/news/2026/mar/04/supreme-court-declines-to-hear-dispute-over/)
- On Steam, generative-AI disclosures were up about 800% in 2025. A little under 20% of 2025 releases disclose GenAI, and about 7,818 titles (about 7% of the library) carry the label. Player backlash can be strong: Jurassic World Evolution 3 removed GenAI portraits after outcry ("lazy", "an insult to artists"). Valve has since relaxed some disclosure rules, and Tim Sweeney has criticised the labels — [ScreenHub](https://www.screenhub.com.au/news/games/steam-generative-ai-games-2673234/); [TechRadar](https://www.techradar.com/ai-platforms-assistants/steam-requires-ai-game-disclosures-epics-ceo-says-theyre-meaningless); [Hitmarker](https://hitmarker.net/news/valve-has-relaxed-its-rules-for-disclosing-generative-ai-use-in-steam-games-1623888)

**Commissioning**
- Indicative pixel-art commission prices:
  - Characters: from about $10–25 depending on size; about $15 for 32×32 or smaller.
  - Detailed static sprites: about $35.
  - Animated walk cycles: +$15 per character.
  - Complex animations: about $70.
  - Tilesets: from about $40.
  - Some budget artists: about $2 per 16×32 sprite or $1 per 16×16 tile.
  - Artists add a commercial-use multiplier and charge for revisions.
  — [Aseprite community pricing thread](https://community.aseprite.org/t/a-simple-pricing-sanity-check-for-pixel-art-commissions/28697); [GDevelop forum for-hire post](https://forum.gdevelop.io/t/for-hire-pixel-artist-affordable-rates-tilesets-characters-backgrounds-ui-animation-more/74739)

### Inferences
- Rough budget for an original roster of about 30–50 static 32×32 creatures at $15–35 each: about $450–1,750 (my calculation from the ranges above). Animations multiply this. Getting the contract to state a commercial licence or copyright assignment is essential.
- DIY tools: Aseprite (paid, about $20 on Steam/itch; source-available), LibreSprite (free fork of an old Aseprite version), and Piskel (free, browser-based). Lospec hosts curated palettes and tutorials, which help keep a coherent style. These are from general knowledge; I could not fetch their sites.
- Monster-sprite packs on itch.io: many "monster/creature pixel pack" assets exist. Each must be checked for redistribution and commercial terms, and for packs that are themselves Pokémon recolours ("fakemon" packs that trace official art carry the same risk).
- AI sprites: in the EU/France, copyright also requires human "intellectual creation", so pure AI output is likely unprotected (inference, no EU source fetched). The developer may not be able to stop copying, and could face community backlash on itch.io or Steam. Training-data lawsuits add uncertainty. Using AI only for drafts or ideas, then redrawing by hand, reduces both problems.

### Gaps
- I could not verify the current OpenGameArt, itch.io or Kenney licence pages directly (proxy-blocked). The Kenney CC0 claim comes from search snippets of kenney.nl/support and a third-party guide.
- I found no EU-specific ruling on AI-generated image copyrightability.
- Lospec, Aseprite and LibreSprite details are from general knowledge, not fetched.

## 5. How do browser idle games make money in 2026, and what does that mean for a Pokémon-IP game?

### Takeaway
Realistic channels are web portals with rewarded/interstitial ads (Poki, CrazyGames), Google's H5 Games Ads on your own domain, itch.io pay-what-you-want or donations, and a Steam wrapper ($100 recoupable fee). Typical casual-game earnings are modest, roughly $200–2,000 per month for a well-performing portal game. Every monetization channel requires owning or licensing the IP, and monetization is exactly what McGowan named as the takedown trigger. A Pokémon-named version should not be monetized.

### Cited Findings
**Poki**
- Curated, human-reviewed submission through Poki for Developers. There is no open upload, and submission is free.
- Revenue: 100% of ad revenue from traffic you bring yourself, 50/50 on traffic Poki brings.
- Technical: initial download under 8 MB, a 16:9 canvas that scales to desktop and mobile, and the Poki SDK integrated. Games pass a staged funnel (Player Fit Test, Web Fit Test, final review).
- Poki asks for web exclusivity, but Steam and mobile app stores remain allowed.
— [Cinevva guide (2026)](https://app.cinevva.com/guides/publish-game-poki); [Poki SDK](https://sdk.poki.com/); [Playgama comparison](https://playgama.com/blog/?p=14181)

**CrazyGames**
- No fee and no exclusivity to publish.
- For revenue share: the game must not have been published on another portal first, must not carry another platform's branding, and non-original assets must be no more than 50% of the game.
- Payment is a share of SDK ads (video and banner), plus in-game purchases via Xsolla for invited games. Monthly payouts via Tipalti above €100. The exact split isn't published, though a 2026 jam's terms listed 60% of ad revenue and 70% of IAP revenue for developers.
— [Cinevva CrazyGames guide (2026)](https://app.cinevva.com/guides/publish-game-crazygames); [CrazyGames docs (requirements, blocked; snippet)](https://docs.crazygames.com/requirements/intro/); [CrazyGames portal launch](https://start-it-x.prezly.com/crazygames-launches-new-developer-portal-with-revenue-share-options); [Cinevva web-monetization guide](https://app.cinevva.com/guides/web-game-monetization)

**Google H5 Games Ads (AdSense Ad Placement API)**
- Formats: interstitials at natural breaks, and rewarded ads.
- Rewarded ads may only be served after the user explicitly chooses to view them. Rewards must not have value outside the game and must not be saleable or exchangeable.
- Access requires applying and being approved ("subject to partner eligibility").
— [Google Ad Placement API docs](https://developers.google.com/ad-placement/apis); [H5 Games Ads](https://adsense.google.com/start/h5-games-ads/); [Google signup](https://developers.google.com/ad-placement/docs/signup); [Google publisher policy for rewarded ads](https://support.google.com/adsense/answer/9955214)

**Steam**
- The Steam Direct fee is $100 per game, non-refundable, and recouped once the product reaches $1,000 adjusted gross revenue — [Steamworks docs](https://partner.steamgames.com/doc/gettingstarted/appfee); [Destructoid](https://destructoid.com/?p=200010)

**Kongregate**
- Kongregate stopped accepting new games on 1 July 2020 (tied to the end of Flash) and laid off staff. Its 128,000-game library stayed accessible. I found no 2026 source showing it reopened to new submissions — [Windows Central](https://windowscentral.com/kongregate-no-longer-accepting-new-titles-shutting-down-services); [PCGamesInsider](https://www.pcgamesinsider.biz/news/71325/kongregate-is-no-longer-accepting-new-games-makes-layoffs/); [PocketGamer.biz](https://www.pocketgamer.biz/kongregate-layoffs-no-new-game-submissions)

**Revenue benchmarks (secondary, vendor or guide sources — treat as rough)**
- 2026 web/HTML5 rewarded eCPMs (gross): Tier-1 (US/UK/CA/JP) $6–15, Tier-2 (most of the EU) $5–9, Tier-3 $1–4. A "headline $20 eCPM" often nets about $4–8 on web after splits — [Cinevva web monetization guide](https://app.cinevva.com/guides/web-game-monetization); [AppLixir blog](https://www.applixir.com/?p=2293)
- "A well-performing casual game on a major portal lands somewhere in the $200 to $2,000 a month middle", while Poki's best studios make up to about €1M per year — [Cinevva web monetization guide](https://app.cinevva.com/guides/web-game-monetization)
- Rewarded video is claimed to make up about 62% of gaming ad revenue in 2026, with 45–60% engagement (vendor claim) — [Cinevva/AppLixir via search](https://www.applixir.com/?p=4354)
- CrazyGames publishes an official ad-monetization guide (blocked here) — [CrazyGames monetization guide](https://docs.crazygames.com/resources/ad-monetization-guide/)

### Inferences
- Pokémon IP and portals don't mix. Poki curates every game and CrazyGames reviews submissions and limits non-original assets. Both are commercial platforms that must honour DMCA notices, and a game titled "Pokémon Tycoon" is very unlikely to be accepted or to stay listed (my inference; I found no explicit fan-game clause because the docs were blocked). Google AdSense policies likewise forbid ads on infringing content. Steam requires the developer to have rights to all content, and Valve removes games after DMCA notices.
- Idle games suit rewarded ads well: "watch an ad for 2× income for 4 h" or "instant offline earnings". Ethical design means ads are opt-in, there is no pay-to-win pressure, no loot boxes or gacha with real money, and nothing is aimed at children. EU/France consumer rules on loot boxes and on minors make paid randomized rewards risky. Pokémon's audience skews young, which makes children-directed ad rules (COPPA/GDPR-K) relevant (general knowledge, not sourced here).
- Low-effort, low-risk options once the IP is original:
  - itch.io pay-what-you-want or a donation link (itch lets creators set the revenue share).
  - Ko-fi.
  - A CrazyGames or Poki submission.
  - A later Steam release via an Electron/Tauri wrapper (PokéClicker's community has an Electron desktop wrapper, [RedSparr0w/Pokeclicker-desktop](https://github.com/RedSparr0w/Pokeclicker-desktop/releases)).
- With realistic hobby traffic (say 1,000 daily players, about 1–2 rewarded views per session, about $5 net eCPM), revenue would be a few dollars a day at most. This is an illustrative calculation, not a sourced figure. Monetizing would not pay for the legal exposure that comes with Pokémon IP.

### Gaps
- I could not access the CrazyGames or Poki official docs to check for an explicit clause banning third-party IP or fan games. Accepting them is unlikely but unverified.
- I found no independent (non-vendor) eCPM study for HTML5 games in 2026. The figures come from monetization-vendor or guide blogs with an interest in the topic.
- itch.io's default revenue share (adjustable, default 10%) is from general knowledge, not fetched.
