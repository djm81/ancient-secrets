# Design: Installable offline-first web app shell

## Manifest and launch

`manifest.webmanifest` uses relative project-safe URLs, a stable `id`, `display: "standalone"`, `start_url` pointing directly to `maestros-secret.html`, explicit `scope`, theme/background colors, and local 192/512 icons including `maskable`. Both root and game HTML include the manifest link, `theme-color`, `apple-touch-icon`, and safe-area-compatible viewport metadata. The game remains usable as a normal page if the manifest is ignored.

## Cache model

A root-scoped service worker owns a versioned core cache: game and landing HTML, JS, CSS/inlined shell dependencies, local fonts, local dialogue art, icons, and offline fallback. The install step precaches the immutable core; navigation is network-first with a fallback from the active release cache, while local same-origin static assets resolve from cache. Era art is intentionally excluded from the install-time core cache and is written to that active release cache only after the player first requests it online while entering an era. Every changed HTML shell references its module and era-art dependencies with an exact release query; static requests therefore match those exact cached URLs. Only the active-cache navigation fallback uses `ignoreSearch`, so a deep-link query can still reach that release’s shell without allowing a prior retained cache to win. This prevents a query-refreshed client from combining new HTML with stale same-named JavaScript or art, while keeping a visited era’s revisioned local URLs available offline. It never intercepts a non-GET request for caching and never stores AI, Worker, model, or user-entered content. Older core caches are retained across an update so currently controlled chronicles can continue to resolve their own shell consistently; ordinary browser storage eviction remains the eventual cache cleanup path.

Future era packs are an explicit player action. The app shows approximate size and available storage before caching an era's local assets; failure leaves the core game and save intact. Cache eviction is an expected browser behavior, so a miss falls back to network rather than corrupting a chronicle.

## Updates and saves

A newly installed worker waits. The UI shows a non-modal “A new edition is ready after this chronicle” state; activation occurs after explicit restart or a clean title-screen/new-chronicle boundary. The worker records the client that requested restart, activates without claiming every controlled client, and sends `UPDATE_READY` only to that client; that client reloads into the new edition while other active chronicles remain with their existing worker and cache. Save writes remain local and occur after material transitions plus lifecycle suspension. Export/import is a user-initiated, schema-validated local file flow for recovery; it is not a cloud feature and does not claim storage continuity between browser and installed instances.

## Platform behavior

The in-game Install control handles `beforeinstallprompt` only when feature-detected. Otherwise it presents neutral platform instructions; it never reports failure because a browser declines installation promotion. Home Screen and Add to Dock paths are manual QA targets. No core feature requires installation, notifications, background execution, or a specific browser.

## Rollback

The game loads normally without a controlling service worker. Unregistering the worker and removing manifest links restores the current web-only delivery; invalid imported saves are rejected by existing validation.
