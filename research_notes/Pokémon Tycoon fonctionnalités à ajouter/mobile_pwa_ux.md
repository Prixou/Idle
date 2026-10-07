# Mobile web / PWA technology & UX best practices for a vanilla-JS idle clicker (as of Oct 2026)

Research context: "Pokémon Tycoon" — vanilla HTML/CSS/JS, classic scripts, works from file://, 400px layout, Press Start 2P, rAF loop, localStorage save every 5s + visibilitychange/pagehide, 8h offline earnings, pointerdown taps, no sound/manifest/SW.

Method note: the network proxy blocked webkit.org, developer.chrome.com, web.dev, caniuse.com, developer.mozilla.org (HTML), azukiazusa.dev and mobiloud.com. Browser-support data was therefore read directly from MDN's **browser-compat-data** (BCD) and **mdn/content** repos on GitHub (raw files, main branch, fetched 2026-10-07) — these are the sources behind MDN/caniuse tables. URLs below point to the human-readable MDN page for the same data. WebKit/Chrome blog facts come from search-result snippets (flagged where not fetched in full).

## 1. PWA installability in 2026 (manifest, service worker, iOS, EU, install prompt, HTTPS & hosting)

### Takeaway
A manifest + HTTPS is the core requirement; a cache-first service worker with a versioned cache gives offline play. Android Chrome supports a custom install button via `beforeinstallprompt`; iOS/Safari never does — on iOS 26 every Home-Screen-added site opens as a standalone web app (no installability criteria), so an in-game "Share → Add to Home Screen" instruction card is the iOS path. file:// cannot be installed or run a SW, so the game needs real HTTPS hosting (GitHub Pages / Netlify / Cloudflare Pages); itch.io's iframe is a poor fit for saves.

### Cited Findings
**Manifest / Chromium criteria**
- Chromium browsers (Chrome, Samsung Internet, Edge) require manifest members: `name` or `short_name`; `icons` containing a 192px and a 512px icon; `start_url`; `display` and/or `display_override`; `prefer_related_applications` false or absent. Manifest linked with `<link rel="manifest">` on every page — [MDN: Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable) (mdn/content main, read 2026-10)
- MDN now states: "While not a requirement for a PWA to be installable, many PWAs use service workers to provide an offline experience." — [MDN: Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
- Chrome's "Revisiting Chrome's installability criteria" post: Chrome is experimenting with simplifying install criteria and removing some manifest-field requirements; per search snippet, the install-prompt algorithm "still requires the presence of a fetch() handler" while Chrome works on new signals — [Chrome for Developers blog](https://developer.chrome.com/blog/update-install-criteria) (snippet only; page blocked). **Conflict/flag:** MDN (more recent) treats SW as not required; to be safe, ship a SW with a real fetch handler anyway (needed for offline regardless).
- Chrome desktop/Android, Safari desktop and Edge desktop let users install any website as an app even without a manifest; a manifest is what makes the browser actively promote installation — [MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
- On Android only Chrome (with Google Mobile Services) and Samsung Internet install real WebAPKs (launcher + app switcher entry); Firefox, Edge, Opera etc. add a browser-badged shortcut — [MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)

**HTTPS / file://**
- Installation requires `https`, or `localhost`/`127.0.0.1`; "This is a more stringent requirement than secure context, which considers resources loaded from `file://` URLs to be secure." — [MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)

**Install prompt**
- `beforeinstallprompt`: Chrome 44+/Chrome Android, Samsung Internet 5.0+; **Safari (macOS & iOS): not supported; Firefox: not supported**; flagged experimental/non-standard — [MDN BCD: BeforeInstallPromptEvent](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent)
- Pattern: listen for `beforeinstallprompt`, `preventDefault()`, store event, call `prompt()` from your own "Install" button. "This is not supported on iOS." — [MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
- `navigator.getInstalledRelatedApps`: Chrome 85 / Chrome Android 84 only; no Safari/Firefox — [MDN BCD](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getInstalledRelatedApps)

**iOS / Safari**
- iOS 16.4+: PWAs can be added from the Share menu in Safari, Chrome, Edge, Firefox and Orion (before 16.3: Safari only) — [MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
- iOS/iPadOS 26 (Safari 26, WWDC25): by default every website added to the Home Screen opens as a web app; "zero requirements for installability" in Safari; users can untoggle "Open as Web App" to make a plain bookmark — [WebKit: News from WWDC25 / Safari 26 beta](https://webkit.org/blog/16993/news-from-wwdc25-web-technology-coming-this-fall-in-safari-26-beta/) (via search snippet; page blocked) ; [WebKit Features in Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/)
- Safari 26 supports SVG icons everywhere icons appear, including favicons; Safari 26.0 = 75 new features — same WebKit sources (snippet)
- Still no Web Bluetooth/USB/NFC; reliable background sync/long-running background tasks remain weak vs native — [MobiLoud: PWAs on iOS 2026 guide](https://www.mobiloud.com/blog/progressive-web-apps-ios) (snippet; secondary source)

**EU situation**
- Feb 2024 Apple planned to remove Home Screen web apps in the EU under the DMA (citing security of alt-engine web apps and "very low adoption"), then reversed: Home Screen web apps "built directly on WebKit and its security architecture" continue in the EU — [Tom's Guide](https://tomsguide.com/phones/iphones/apples-backtracking-on-plans-to-kill-iphone-home-screen-web-apps-in-the-eu-heres-why); [Notebookcheck](https://www.notebookcheck.net/Apple-backpedals-on-decision-to-kill-Home-Screen-web-apps-in-EU.809180.0.html)
- In the EU (iOS 17.4+) alternative browser engines are permitted, and those browsers' own storage policies apply instead of WebKit's — [MDN: Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)

**Service worker caching strategies (static game)**
- Precache app-shell resources in the SW `install` handler with `cache.addAll()` inside `event.waitUntil()` (install fails if any file fails); serve them "cache first" in `fetch` with network fallback (cache can be cleared by browser/user) — [MDN: PWA Caching guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching)
- Drawback of cache-first: a cached response is never refreshed until a new SW version is installed → version the cache name and delete old caches on `activate`; alternative "cache first with cache refresh" (stale-while-revalidate) or "network first" — [MDN: Caching](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching)
- SW `install` happens on first visit even if the user never installs the PWA — [MDN: Caching](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching)

**Hosting**
- itch.io HTML5 embeds run in a cross-origin iframe: storage may be treated as third-party and wiped; preview vs public page may be different origins; updates are served from a new CDN address so "all the data is lost"; Safari iPad's "Prevent cross-site tracking" breaks localStorage in itch embeds — [itch.io forum: localStorage lost at every update](https://itch.io/t/2346400/html5-local-storage-is-lost-at-every-update); [itch.io forum: iPad localStorage](https://itch.io/t/2636350/localstorage-doesnt-work-for-html5-games-on-ipad-by-default); [bugnet.io](https://bugnet.io/blog/how-to-fix-construct3-localstorage-save-lost-in-itch-io-iframe)
- Recommended mitigation: run as top-level page / itch fullscreen-redirect, and add a copy/download save-string button — [bugnet.io](https://bugnet.io/blog/how-to-fix-construct3-localstorage-save-lost-in-itch-io-iframe)

### Inferences
- Concrete plan (no build step): add `manifest.webmanifest` (`name`, `short_name`, `start_url: "./"`, `scope: "./"`, `display: "standalone"` or `"fullscreen"`, `orientation: "portrait"`, `background_color`/`theme_color` matching the game, icons 192/512 PNG + a `"purpose": "maskable"` variant), `<link rel="apple-touch-icon" href="icon-180.png">`, `<meta name="theme-color">`, `<meta name="viewport" content="..., viewport-fit=cover">` and `env(safe-area-inset-*)` padding. Register SW only when `location.protocol === 'https:'` (or localhost) so file:// still works: `if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js')`. Classic script SW is fine (no modules needed).
- SW: `const CACHE='tycoon-v12'` + list of files (HTML, CSS, JS, sprites, font files). **Self-host Press Start 2P** (download woff2) instead of Google Fonts so offline works and no cross-origin caching issues (also a GDPR plus for EU users).
- Update UX: new SW waits; page listens for `registration.waiting`/`updatefound` and shows a "Nouvelle version — Recharger" toast; on click post `SKIP_WAITING`, then reload on `controllerchange`. Always save the game before reload. Avoid `skipWaiting()` silently mid-session (old JS + new assets mismatch).
- Install UX: Android → custom "Installer" button in settings shown after `beforeinstallprompt` (and only after some engagement, e.g. 3rd session); iOS → detect `navigator.standalone`/`matchMedia('(display-mode: standalone)')` false + iOS UA and show a one-time illustrated hint "Partager → Sur l'écran d'accueil". Hide once installed.
- Hosting: GitHub Pages / Cloudflare Pages / Netlify all provide free HTTPS static hosting (general knowledge, not re-verified this session); prefer them over itch.io as primary; if on itch, link to the standalone URL for installation and keep export/import.

### Gaps
- Could not fetch the full Chrome install-criteria blog or WebKit Safari 26 posts (proxy-blocked): exact current Chrome rule on whether a SW fetch handler is still required for the automatic install prompt in late 2026 is unconfirmed (MDN says not required; Chrome blog snippet says still required at time of writing).
- No primary source fetched on iOS 26.x changes after 26.0 regarding manifest `id`, `orientation`, or splash screens.
- Hosting HTTPS details (GitHub Pages enforce-HTTPS, Netlify/Cloudflare free tiers) not re-verified this session.

## 2. Storage robustness (localStorage limits, Safari eviction, persist(), IndexedDB, export/import, cloud saves)

### Takeaway
localStorage (5 MiB/origin) is fine for an idle save, but in Safari any script-written storage is wiped after 7 days of Safari use without interaction on the site (Home Screen web apps have their own counter, so installing protects saves). Add `navigator.storage.persist()`, a base64 export/import string (genre convention), and optionally a file download — cloud save needs a backend.

### Cited Findings
- Web Storage: up to 5 MiB localStorage + 5 MiB sessionStorage per origin (10 MiB max total); over-limit throws `QuotaExceededError` → wrap `setItem` in try/catch — [MDN: Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- Storage is "best-effort" by default; persistent storage via `navigator.storage.persist()` is only evicted by the user. Safari and Chromium auto-approve/deny based on interaction history with no prompt; Firefox shows a permission popup — [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- `StorageManager.persist()` support: Chrome 55, Safari 15.2 (incl. iOS), Firefox 57; `estimate()`: Chrome 61, Safari 17, Firefox 57 — [MDN BCD: StorageManager](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist)
- Safari "proactively evicts data when cross-site tracking prevention is turned on. If an origin has no user interaction, such as click or tap, in the last seven days of browser use, its data created from script will be deleted." Eviction deletes all of an origin's data at once (IndexedDB + Cache + …) — [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- Affected: IndexedDB, LocalStorage, Media keys, SessionStorage, Service Worker registrations. Home Screen web apps "are not part of Safari and thus have their own counter of days of use", so HTML storage isn't deleted for their main domain while the app is used — WebKit clarification (2020) via [Search Engine Land](https://searchengineland.com/what-safaris-7-day-cap-on-script-writeable-storage-means-for-pwa-developers-332519), [mjtsai.com](https://mjtsai.com/blog/2020/03/26/safari-13-1-third-party-cookie-blocking-and-7-day-script-writeable-storage/). **Flag: policy dates from 2020 (Safari 13.1); MDN 2026 still documents the 7-day rule.**
- Since iOS 17/macOS 14, WebKit browser apps allow ~60% of disk per origin; Home Screen web apps get the same ~60% quota; earlier Safari had a 1 GiB initial quota — [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- Chrome research: browser-initiated deletion is very rare; regular visitors' best-effort data is very unlikely to be evicted — [MDN citing web.dev persistent-storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- Private browsing: different quotas, data usually deleted at end of session — [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- Idle-game convention: Cookie Clicker saves are a base64 string (copy/paste export/import, plus file export); Antimatter Dimensions copies a 6kB+ save string to clipboard for its import window — [Cookie Clicker Wiki: Save](https://cookieclicker.wiki.gg/wiki/Save); [TV Tropes: Export Save](https://tvtropes.org/pmwiki/pmwiki.php/Main/ExportSave)
- Async Clipboard API: Chrome 66, Safari 13.1, Firefox 63; Web Share API: Chrome Android 61, Safari 12.1, Firefox 71 (desktop Chrome 128) — [MDN BCD: Navigator.clipboard](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard), [Navigator.share](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)

### Inferences
- Keep localStorage (simple, synchronous, survives file://); IndexedDB adds no eviction protection (same origin bucket) and isn't needed at this save size. Write a rolling backup key (`save`, `save_bak`) and validate JSON + version before overwriting to avoid corruption.
- Export: `btoa(unescape(encodeURIComponent(JSON.stringify(state))))` (or `TextEncoder` + base64) with a prefix/version tag ("PKTY1:...") and optional checksum; buttons "Copier" (clipboard), "Télécharger .txt" (Blob + `<a download>`), "Partager" (navigator.share on mobile). Import: textarea + validate + confirm.
- Call `navigator.storage.persist()` after meaningful engagement (e.g. first prestige or when installed); show "save may be cleared" warning in Safari tab mode suggesting installation or export.
- Cloud save requires a backend (Firebase/Supabase/PlayFab, etc.) — out of scope for "no backend"; a zero-backend alternative is the share-string (user can paste it into notes/Drive).
- Offline-earnings anti-cheat: device clock changes can grant earnings; clamp negative deltas and cap at 8h (already done).

### Gaps
- No 2025–2026 primary WebKit source confirming the Home-Screen 7-day exemption is unchanged in iOS 26 (blog fetch blocked).
- r/incremental_games save-export threads not reachable; convention supported by Cookie Clicker/AD examples only.

## 3. Notifications (Web Push on iOS, Notification Triggers, serverless "offline earnings full")

### Takeaway
Scheduled local notifications ("ton Ranch est plein !") are **not feasible without a server** in 2026: Notification Triggers never shipped, and Web Push (incl. iOS 16.4+ Home Screen apps and Declarative Web Push on 18.4+) always needs a push server to send at the right time.

### Cited Findings
- Push API on iOS: Safari iOS 16.4+, "Notifications are supported in web apps saved to the home screen" (not in Safari tabs); macOS Safari 16+ (Ventura+); Chrome 42; Firefox 44 — [MDN BCD: PushManager](https://developer.mozilla.org/en-US/docs/Web/API/PushManager)
- Declarative Web Push (Safari 18.4, March 2025): push subscription + visible notifications without requiring a service worker; OS displays the notification from the JSON payload; only in Home Screen web apps on iOS/iPadOS 18.4+ — [WebKit: Meet Declarative Web Push](https://webkit.org/?p=16535) (snippet), [WebKit Features in Safari 18.4](https://webkit.org/blog/16574/digital-credentials-api/), [Pushpad blog](https://pushpad.xyz/blog/declarative-web-push)
- Notification Triggers API (schedule local notifications by timestamp): Chrome docs status — explainer complete, spec draft not started, origin trial completed, **launch not started** — [Chrome for Developers: Notification Triggers](https://developer.chrome.com/docs/web-platform/notification-triggers) (snippet)
- App badging `navigator.setAppBadge()`: Safari iOS 16.4+ for Home Screen web apps, macOS Safari 17 installed apps, Chrome 81 desktop (Win/macOS), **not Chrome Android**, not Firefox; `setAppBadge(0)` clears — [MDN BCD: setAppBadge](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/setAppBadge)

### Inferences
- Serverless options: (a) set an app-icon badge (e.g. "!" or count of ready upgrades) when the app is backgrounded on iOS PWA/desktop — it is static and won't update over time without push, but works without server; (b) show in-game "Bon retour ! +X ¥ (8h max)" modal; (c) tell players the offline cap so they return.
- With a minimal server (e.g. Cloudflare Worker + cron + VAPID keys), the client could send "full at T" to the server, which pushes at T — flag: needs backend, user permission requested from a user gesture, and on iOS only after install.
- Don't request notification permission on first load; ask contextually (e.g. after first offline-earnings modal).

### Gaps
- Could not verify whether Chrome has officially abandoned Notification Triggers or whether any browser added scheduled notifications in 2026.
- Periodic Background Sync (Chromium-only, installed apps) not researched in depth; it cannot guarantee timing anyway.

## 4. Haptics (Vibration API, iOS switch trick)

### Takeaway
`navigator.vibrate()` works on Android Chrome/Samsung (needs user gesture) but never on iOS Safari, and Firefox Android 79+ disables it. The iOS `<input type="checkbox" switch>` haptic trick worked for programmatic triggers on iOS 17.4–26.4 but Apple patched it in iOS 26.5; current libraries now only fire on a real user tap via an overlaid label.

### Cited Findings
- `Navigator.vibrate`: Chrome/Chrome Android 32+; since Chrome 60 requires a user gesture (otherwise returns false); not in cross-origin iframes since Chrome 55; **Safari / Safari iOS: not supported**; Firefox desktop removed in 129; Firefox Android 79+: "Vibration is disabled… returns true, but no vibration takes place" — [MDN BCD: Navigator.vibrate](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate)
- `<input type="checkbox" switch>` was introduced in Safari 17.4; toggling it fires the system haptic. Hidden switch + label clicked programmatically triggers the Taptic Engine; "Programmatic iOS haptics work on iOS 17.4 to 26.4. Apple patched the underlying behavior in iOS 26.5" — [azukiazusa.dev: iOS Safari web haptics](https://azukiazusa.dev/en/blog/ios-safari-web-haptics) (snippet); [unpkg ios-haptics README](https://unpkg.com/ios-haptics@3.1.1/README.md); [rapidtoolset iOS Haptics Tester](https://rapidtoolset.com/en/tool/ios-haptics-tester)
- `ios-haptics` (v3.x, June–Sept 2026, latest 3.2.0 on 2026-09-22): `hapticTrigger(element)` renders a transparent `<label>` over the element wired to a hidden switch; "when the user taps the element, the label forwards the tap to the switch as a trusted click" — i.e. only on genuine taps, not timed patterns — [ios-haptics on GitHub](https://github.com/tijnjh/ios-haptics) / [npm](https://npmjs.com/package/ios-haptics) (README + npm registry timestamps fetched)
- `web-haptics` npm (March 2026): presets `success`, `nudge`, `error`, `buzz`, pattern arrays; vanilla `new WebHaptics().trigger('success')` — [npm: web-haptics](https://www.npmjs.com/package/web-haptics) (README via npm registry)

### Inferences
- Implementation: `const canVibrate = 'vibrate' in navigator;` → on Android vibrate 8–15 ms on tap, 30–40 ms on purchase, `[30,40,60]` on evolution/level-up; never continuous. Respect a "Vibrations" toggle (default on where supported, hidden where not).
- iOS: optionally put a real `<label>` wrapping a hidden `<input type="checkbox" switch>` over the main tap button (vanilla re-implementation of the ios-haptics technique, ~20 lines, no build). Expect it to work only for the direct tap, possibly with toggle-rate limits; treat as fragile/undocumented and feature-flag it. Note it may interfere with `pointerdown` handling (label click fires on `click`, after pointerup).
- Because libraries are ESM/npm, for a no-build project copy the small logic inline rather than importing.

### Gaps
- Could not confirm exactly what iOS 26.5 changed (whether label-tap trusted clicks still trigger haptics in all cases); based on library's design shift, likely only user-initiated toggles.

## 5. Audio (Web Audio, autoplay unlock, ZzFX/jsfxr/ZzFXM, mute, iOS silent switch, latency)

### Takeaway
Use one `AudioContext` created/resumed on the first `pointerdown`, procedurally generated 8-bit SFX via ZzFX (<1 KB, built-in random pitch) and optionally ZzFXM for chiptune music; add a mute toggle persisted in the save, and on iOS set `navigator.audioSession.type`.

### Cited Findings
- Web Audio `AudioContext`: Chrome 35, Safari 14.1 (unprefixed; incl. iOS), Firefox 25 — [MDN BCD: AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext)
- Starting audio outside a user-input handler is subject to autoplay rules; contexts may only play after **sticky activation** — [MDN: Autoplay guide for media and Web Audio APIs](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)
- ZzFX: "Less than 1 kilobyte when compressed", 20 parameters, no deps, MIT, can precache generated sounds; usable by pasting `ZzFXMicro.min.js` (no module needed) and calling `zzfx(...[,,925,.04,.3,.6,1,.3,,6.27,-184,.09,.17])`; online designer at killedbyapixel.github.io/ZzFX; default `randomness` param (.05) varies pitch per play; global `zzfxV` volume and `zzfxX = new AudioContext` — [GitHub: KilledByAPixel/ZzFX](https://github.com/KilledByAPixel/ZzFX)
- ZzFXM: tiny MOD-like music generator using ZzFX instruments; `<script src="zzfx.js">` + `zzfxm.min.js`, `zzfxP(...zzfxM(...song))` returns an AudioBufferSourceNode (`.stop()`); online tracker; MOD → ZzFXM converter — [GitHub: keithclark/ZzFXM](https://github.com/keithclark/ZzFXM)
- jsfxr: sfxr port, presets `pickupCoin`, `laserShoot`, `explosion`, `powerUp`, `hitHurt`, `jump`, `blipSelect`, `synth`, `tone`, `click`, `random`; browser use via `riffwave.js` + `sfxr.js` script tags; designer at sfxr.me — [GitHub: chr15m/jsfxr](https://github.com/chr15m/jsfxr)
- Audio Session API `navigator.audioSession`: Safari 16.4 (incl. iOS), not Chrome, Firefox preview — [MDN BCD: Navigator.audioSession](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/audioSession)
- Tabs playing audio are considered foreground and are not timer-throttled — [MDN: Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)

### Inferences
- Unlock: in the first `pointerdown` handler, `zzfxX.resume()` (create context lazily there to avoid the "AudioContext was not allowed to start" warning). Re-`resume()` on `visibilitychange` → visible (iOS suspends contexts when backgrounded).
- Pre-render frequent SFX (tap, coin, buy, level-up, evolve) into AudioBuffers once (ZzFX `zzfxG` builds samples) to minimise per-tap CPU; cap concurrent tap sounds (e.g. max 4 voices / 40 ms min interval) so fast tapping doesn't distort.
- Pitch variation: rely on ZzFX randomness or set `playbackRate` 0.9–1.1; for combos, raise pitch progressively (classic juice trick).
- iOS: Web Audio is muted by the hardware silent switch under the default "ambient"-like behavior; `navigator.audioSession.type = 'ambient'` keeps it polite (mixes with user's music, obeys silent switch) — recommended for a casual game; `'playback'` would ignore the switch (avoid for SFX). (Behavioral detail from general knowledge, not re-verified this session.)
- Mute conventions: two separate toggles (Sons / Musique) + master volume, persisted; speaker icon reachable from main screen; pause music on `visibilitychange` hidden (also prevents the tab being exempted from throttling/battery drain); default music off or low.
- Latency: Web Audio buffer playback is the lowest-latency web option; HTMLAudioElement is not suited to rapid SFX (general knowledge).

### Gaps
- No 2025–2026 measurement of Web Audio output latency on iOS vs Android found.
- iOS silent-switch interaction with `audioSession.type` values not verified from primary source in this session.

## 6. Performance / battery (loop throttling, layout thrash, DOM vs canvas, background tabs, Page Lifecycle)

### Takeaway
rAF already stops in hidden tabs and timers are budget-throttled, so offline earnings must be computed from timestamps on resume (already done). For battery, decouple simulation from rendering: tick economy at a low fixed rate (e.g. 10 Hz or on rAF with dt), update DOM text only when values change, and drop to low FPS when nothing animates. DOM is fine for a clicker; use canvas only for particle-heavy effects.

### Cited Findings
- Most browsers stop rAF callbacks in background tabs/hidden iframes; timers are throttled; budget-based throttling kicks in after 30 s hidden (10 s in Chrome); audio-playing tabs, WebSocket/WebRTC and IndexedDB are exempt — [MDN: Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
- Chrome: background timers run at most once per second; use Page Visibility to suspend unnecessary work — [Chrome blog: Background tabs in Chrome 57](https://developer.chrome.com/blog/background_tabs) (snippet; older 2017 source)
- `visibilitychange` → hidden "is the last event that's reliably observable by the page" — treat it as session end (use it, not `beforeunload`/`unload`) — [MDN: visibilitychange](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event)
- `pagehide` supported everywhere (Chrome 3, Safari 5, Firefox 6) — [MDN BCD: Window pagehide](https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event)
- Screen Wake Lock API: Chrome 84, Safari 16.4 macOS, **Safari iOS 18.4**, Firefox 126 — [MDN BCD: Navigator.wakeLock](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/wakeLock); Safari 18.4 release added Screen Wake Lock (for web apps) — [WebKit Features in Safari 18.4](https://webkit.org/blog/16574/digital-credentials-api/) (snippet)

### Inferences
- Current save-on-visibilitychange+pagehide is correct; also save on `freeze` (Chromium Page Lifecycle) is harmless. Don't use `unload` (breaks bfcache).
- Loop: keep rAF for visuals but (1) compute economy with `dt = min(now-last, 1000)` and catch-up via timestamp delta on resume; (2) batch DOM writes: cache element refs, compare `textContent` before writing, avoid reading layout (`offsetWidth`, `getBoundingClientRect`) in the loop; (3) animate only `transform`/`opacity`; (4) format big numbers once per frame max, and update shop affordability classes at ~4–10 Hz rather than 60 Hz.
- Idle-on-screen battery saver: if no input for N seconds and no active particles, render at ~10–15 fps (skip frames) or switch to `setTimeout(…,250)`; resume 60 fps on pointerdown.
- Floating "+N" numbers and particles: pool DOM nodes (reuse ~20 elements) or use a single overlay `<canvas>`; cap simultaneous items.
- Wake Lock is not desirable for an idle game (drains battery); offline earnings already cover "screen off".

### Gaps
- No 2025–2026 source on Chrome "intensive throttling" (1/min after 5 min hidden) re-verified; Page Lifecycle API (`freeze`/`resume`) Safari support not checked.

## 7. Game feel ("juice") for clickers

### Takeaway
The canonical references are Jonasson & Purho's "Juice it or lose it" (2012) and Jan Willem Nijman's "The Art of Screenshake" (2013): layer tweening/easing, squash & stretch, particles, sound, and (sparingly) screen shake/hit-stop onto every player action — and make all of it respect `prefers-reduced-motion` and a settings toggle.

### Cited Findings
- "Juice it or lose it" — Martin "Grapefrukt" Jonasson & Petri Purho, Nordic Game Jam, May 2012: live-demonstrated adding juicy effects to a Breakout prototype; a year later Jan Willem Nijman (Vlambeer) gave "The Art of Screenshake" — [RPG Playground: Making a 'juicy' game](https://rpgplayground.com/research-making-a-juicy-game/)
- Techniques listed: color, tweening/easing, squeeze & stretch for impact, sound, music, particles (smoke, shattering, trails), screenshake for impact, faces/eyes on elements, elements reacting to environment/music — [RPG Playground](https://rpgplayground.com/research-making-a-juicy-game/)
- Screenshake = offsetting camera x/y for a short duration; effective "when used judiciously" — [GameMaker: Coffee-Break Tutorials: Juicy Screenshake](https://gamemaker.io/en/blog/coffee-break-tutorials-juicy-screenshake-gml)
- ZzFX default per-play pitch randomness supports sound variation — [GitHub: ZzFX](https://github.com/KilledByAPixel/ZzFX)

### Inferences (concrete clicker recipe)
- Tap target: on `pointerdown` scale to 0.92 then spring back with overshoot (CSS `transform` + `cubic-bezier(.34,1.56,.64,1)`, ~120 ms); slight random rotation ±3°.
- Number pop: "+N" spawns at the touch point, rises 40–60 px with ease-out and fades, random x jitter; crits in bigger/colored text. Pool nodes.
- Particles: 4–8 coin/sparkle sprites per tap (more on milestones), gravity arc; cap total.
- Screen shake: only on big events (evolution, prestige, rare catch): 150–300 ms, amplitude 2–6 px decaying, applied to a game container `transform: translate()`; never on every tap.
- Hit-stop: 40–80 ms freeze of the tap animation + flash on crits/big purchases.
- Counter juice: currency counter tweens/rolls up rather than jumping; brief scale pulse on the counter when income arrives.
- Sound: tap pitch rises with combo streak, resets after pause; distinct "buy" vs "can't afford" (soft buzz + horizontal head-shake of the button).
- All motion gated by `matchMedia('(prefers-reduced-motion: reduce)')` and a manual "Réduire les animations" toggle (disable shake/flash, keep subtle fades).

### Gaps
- Could not access original talk videos/transcripts (YouTube/GDC Vault) — specifics of Nijman's 30 tricks (e.g. hit-stop "sleep", permanence, kickback) cited from memory are not included as sourced facts.

## 8. Mobile UX conventions for idle games (+ accessibility)

### Takeaway
Keep the primary tap area and navigation in the lower thumb-reachable half, use a bottom tab bar, provide buy-quantity toggles (x1/x10/x100/Max), hold-to-repeat buying, badges for affordable upgrades, a short progressive tutorial and a settings screen (sound, music, vibration, notation, reduced motion, save export/import). Press Start 2P needs larger sizes and strong contrast to stay readable.

### Cited Findings
- Idle games need clean, simple UI with a gentle learning curve for short sessions; avoid overflowing menus; main screen must stay interesting to watch — [Mind Studios: Idle clicker game design](https://themindstudios.com/blog/idle-clicker-game-design-and-monetization)
- When granting rewards, congratulate and highlight the resource total — [Mind Studios](https://themindstudios.com/blog/idle-clicker-game-design-and-monetization)
- `navigator.setAppBadge` available for iOS Home Screen apps (16.4+) → can mirror in-game badge on the app icon — [MDN BCD](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/setAppBadge)

### Inferences (general mobile/idle conventions; not individually sourced in this session — flag for writer)
- Thumb zone: main tap target centered in lower-middle; bottom nav (4–5 tabs: Ferme/Pokémon, Améliorations, Pokédex/Succès, Boutique/Prestige, Réglages) with ≥44–48 px touch targets (Apple HIG 44 pt / Material 48 dp — general knowledge). Pad with `env(safe-area-inset-bottom)` for the home indicator.
- Buy mode toggle: segmented control x1 / x10 / x100 / MAX near the shop list header; show cost for chosen quantity; "MAX" computed via geometric-series formula.
- Long-press to buy repeatedly: on `pointerdown` start timer (e.g. 400 ms delay, then repeat every 100 ms accelerating to 30 ms), stop on `pointerup`/`pointercancel`/`pointerleave`; use `setPointerCapture`; add `touch-action: manipulation` and `user-select:none; -webkit-touch-callout:none` to prevent zoom/callout; small haptic per purchase on Android.
- Prevent accidental double-tap zoom & pull-to-refresh: `touch-action: manipulation`, `overscroll-behavior: none` on body.
- Badges: red dot / count on nav tabs when an upgrade becomes affordable or an achievement is unclaimed; don't over-badge.
- Onboarding: 3–5 contextual steps (tap here → buy first Pokémon → see passive income → offline earnings explanation), skippable, triggered by state not time.
- Settings: Sons, Musique, Vibrations, Notation (courte 1,2 M / scientifique 1.2e6 / ingénierie), Réduire les animations, Afficher les nombres flottants, Exporter/Importer/Réinitialiser la sauvegarde, Installer l'app, Crédits/version.
- Accessibility: Press Start 2P is a wide, all-caps-looking bitmap-style font; use it for headings/numbers at ≥12–16 px and consider a readable fallback (system UI or a pixel font with lowercase) for long text/descriptions; line-height ≥1.4; WCAG AA contrast 4.5:1 for body text (general knowledge); never convey affordability by color alone (add icon/opacity + text); honor `prefers-reduced-motion`; support `prefers-color-scheme` optional; `aria-live="polite"` for currency is too chatty — announce milestones only.
- French number formatting: `Intl.NumberFormat('fr-FR', {notation:'compact'})` gives "1,2 M" (built-in, no lib).

### Gaps
- No primary 2024–2026 source fetched for thumb-zone research (Hoober), Apple HIG/Material target sizes, WCAG contrast, or Press Start 2P legibility guidance; r/incremental_games UX threads unreachable. These are well-established but unverified in this session.
- No source found specifically on buy-multiplier/hold-to-buy patterns (search returned only generic idle design articles).

## 9. Privacy-friendly analytics without a backend

### Takeaway
GoatCounter (free for non-commercial, cookieless, one script tag, works on github.io) or Cloudflare Web Analytics (free, cookieless, best with own domain) give page-level stats without consent banners; gameplay event analytics would need custom endpoints (backend) — keep it minimal or skip.

### Cited Findings
- GoatCounter: open source, free for non-commercial use, no cookies, no PII, GDPR-friendly, suited to static/GitHub Pages sites — [GoatCounter README (jsDelivr mirror)](https://cdn.jsdelivr.net/gh/zgoat/goatcounter@main/README.md); [DEV: Why I chose GoatCounter for GitHub Pages](https://dev.to/iam_pbk/why-i-chose-goatcounter-for-my-github-pages-site-7k8)
- Cloudflare Web Analytics: free, cookieless, one-line script, no consent banner needed; but with a github.io subdomain you can't proxy DNS through Cloudflare (JS-snippet mode still possible) — [DEV article](https://dev.to/iam_pbk/why-i-chose-goatcounter-for-my-github-pages-site-7k8)
- `visibilitychange`→hidden is the right moment to `navigator.sendBeacon` analytics — [MDN: visibilitychange](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event)

### Inferences
- GoatCounter supports custom "events" via `goatcounter.count({path:'evt-prestige', event:true})` (general knowledge) — could track funnel milestones (first buy, first prestige, install) without a backend of your own. Must be loaded only over https and should fail silently offline/file://.
- A local-only "Statistiques" screen (total taps, time played, best income) gives players value without any tracking.

### Gaps
- Pricing/terms of GoatCounter/Cloudflare in 2026 and GoatCounter event API not re-verified from primary docs.
