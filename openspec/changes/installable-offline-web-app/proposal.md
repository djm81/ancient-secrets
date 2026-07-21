# Change: Installable offline-first web app shell

## Why

The game is static-first but not yet an installable web app: it has no manifest, icon set, service worker, or offline asset contract. An installed launch should feel like a small game app—open directly into the chronicle, resume quickly, and remain playable without a network—without pretending that browser-specific installation UX is uniform.

## What Changes

- Add a GitHub-Pages-safe web app manifest, local icons, standalone launch configuration, and browser-specific progressive install guidance.
- Register a versioned service worker that precaches the core game shell, local art, icons, and local fonts; it never caches POST requests, AI responses, secrets, or optional model assets.
- Self-host the game fonts so a cached game launch does not depend on Google Fonts.
- Add an explicit update handoff: a new service-worker version waits until the player restarts or accepts “restart with new version,” never interrupting an active chronicle.
- Add local save export/import recovery and truthful storage messaging; installation must not promise that browser and installed-app storage are shared.
- Let players optionally download future era packs for offline play, with a size disclosure and storage-estimate check. The base game remains small and available offline after its first successful launch.

## Capabilities

- **installable-web-app** — manifest, icons, standalone launch, and progressive install guidance.
- **offline-game-shell** — service-worker caching, offline launch, font locality, update handoff, and optional content packs.

## Impact

- Affected runtime: HTML heads, local font/icon assets, a root service worker, small app-lifecycle module, browser tests, README, and deployment notes.
- Supports the responsive surface and precedes Codex content implementation; no account, analytics, native wrapper, provider key, or required notification is introduced.
- The game stays fully usable in browsers that do not offer PWA installation.

## Constraints

- Manifest paths, `start_url`, scope, and service-worker scope work under the GitHub Pages project path, not just at a custom-domain root.
- The installed start route opens the game, not a marketing/portfolio page.
- Installation UI is progressive: a custom install button only appears when the browser exposes a usable prompt; iOS receives Add to Home Screen guidance instead.
- Cache integrity is versioned and recoverable; an update never reloads or drops a live chronicle.
- Offline caching excludes remote guidance, judge, model, and telemetry-like traffic. Authored guidance remains the offline path.

## Rollback

Unregister the service worker, remove manifest links and install controls, and retain the static browser game. Cached assets may remain until ordinary browser eviction or a documented clear-data action; game saves are untouched.

## Out of scope

- Native-app packaging, app-store submission, push notifications, background sync, forced fullscreen, forced orientation, accounts, cloud saves, or pre-downloading local AI models.
