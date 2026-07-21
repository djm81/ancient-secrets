# Design: Installable offline-first web app shell

## Manifest and launch

`manifest.webmanifest` uses relative project-safe URLs, a stable `id`, `display: "standalone"`, `start_url` pointing directly to `maestros-secret.html`, explicit `scope`, theme/background colors, and local 192/512 icons including `maskable`. Both root and game HTML include the manifest link, `theme-color`, `apple-touch-icon`, and safe-area-compatible viewport metadata. The game remains usable as a normal page if the manifest is ignored.

## Cache model

A root-scoped service worker owns a versioned core cache: game and landing HTML, JS, CSS/inlined shell dependencies, local fonts, local dialogue art, icons, and offline fallback. The install step precaches the immutable core; navigation uses cache-first with network fallback; local same-origin static assets may be refreshed after use. It never intercepts a non-GET request for caching and never stores AI, Worker, model, or user-entered content.

Future era packs are an explicit player action. The app shows approximate size and available storage before caching an era's local assets; failure leaves the core game and save intact. Cache eviction is an expected browser behavior, so a miss falls back to network rather than corrupting a chronicle.

## Updates and saves

A newly installed worker waits. The UI shows a non-modal “A new edition is ready after this chronicle” state; activation occurs after explicit restart or a clean title-screen/new-chronicle boundary. Save writes remain local and occur after material transitions plus lifecycle suspension. Export/import is a user-initiated, schema-validated local file flow for recovery; it is not a cloud feature and does not claim storage continuity between browser and installed instances.

## Platform behavior

The in-game Install control handles `beforeinstallprompt` only when feature-detected. Otherwise it presents neutral platform instructions; it never reports failure because a browser declines installation promotion. Home Screen and Add to Dock paths are manual QA targets. No core feature requires installation, notifications, background execution, or a specific browser.

## Rollback

The game loads normally without a controlling service worker. Unregistering the worker and removing manifest links restores the current web-only delivery; invalid imported saves are rejected by existing validation.
