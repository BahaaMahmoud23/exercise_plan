# Workout app: deployment, installation and offline use

This is the existing Vite/React app. Workout persistence still uses
`bahaa-workouts.upper-lower.v1`; no existing keys or records are migrated or cleared.
Installing does not sync data between devices, browsers or origins. Safari and an
installed iOS app may use separate storage: verify the history in the installed app.
Browser storage can be evicted or cleared by the user/OS; this is not a cloud backup.

## Production deployment

Run `npm ci` and `npm run build`, and deploy **dist** to the root of an HTTPS origin.
Do not deploy the Vite development server; the worker is registered only in production.
`vercel.json` supplies the worker/manifest/HTML revalidation headers and long-lived
caching for content-hashed assets. Vercel's Vite build uses `dist` as its output.
For other static hosts, apply equivalent headers:

- `/sw.js`: JavaScript, `Cache-Control: no-cache, no-store, must-revalidate`.
- `/manifest.webmanifest`: `application/manifest+json`, `Cache-Control: no-cache`.
- `/` and `/index.html`: `Cache-Control: no-cache`.
- `/assets/*`: `Cache-Control: public, max-age=31536000, immutable`.
- Serve real files before any SPA fallback. MP4 URLs must return MP4 content and
  normal HTTP byte-range responses, never an HTML fallback. Preserve public filenames.

This change includes configuration, not a deployment to an external hosting account.
Keep the same HTTPS origin to keep existing browser history accessible.

## Offline behavior and updates

`pwa/vite-plugin.mjs` builds a versioned native Service Worker from
`pwa/service-worker.js`. It uses only browser APIs and Vite's supported plugin hooks.
The external package registry was unavailable during implementation; there is no
additional PWA dependency or runtime CDN dependency.

The worker atomically precaches HTML, bundled workout program/code, CSS, the
manifest and icons. Wait for **Ready for offline workouts** during an online visit.
The interface, history, comparisons and set logging then work without a connection.
A newly installed version waits for the user to press **Reload to update**, or for
all old app windows to close. The worker only cleans caches with its own shell prefix;
it never accesses localStorage. Online/startup checks and hourly checks discover updates.
A failed download leaves the previous installed worker available.

Videos are deliberately NOT precached or stored by the worker. They load only after
**Load … video** is pressed, and otherwise use native HTTP streaming and range
requests. The close button and exercise switching release the video source. Video
errors offer Retry. Offline video playback is not guaranteed; external hero imagery
also needs a connection. No whole-library download occurs.

The manifest is standalone, with root start URL/scope, 192/512 maskable-safe PNG
icons and a 180px Apple touch icon. Browsers may still discard inactive app processes;
the cached shell and saved logs let the app reopen without losing recorded sets.

## Install on a phone

Android/Chrome: open the deployed HTTPS site, wait for offline readiness, then press
the optional **Install app** button or Chrome menu → Add to home screen → Install.
The in-app button appears only when Chrome provides a supported installation prompt.

iPhone/Safari: open the deployed HTTPS site, Share → Add to Home Screen, enable
**Open as Web App** if shown, then Add. Launch the new home-screen icon online once
and wait for offline readiness before testing airplane mode.

## Validation

- `npm test`: production build plus program, mapping, manifest/icon and worker event
  tests. The worker tests execute the emitted worker with a simulated Cache API,
  covering offline responses, explicit activation, failed installs and preserved logs.
- `npm run typecheck`: strict TypeScript checks.
- `npm run test:browser`: existing desktop/mobile logging/history regression checks.
- `npm run test:media`: actual decoding/playback of all seven supplied MP4s, metadata,
  contain layout at mobile/desktop sizes, lazy loading and closing cleanup.
- `npm run test:pwa`: real browser worker install/activation, offline loading/logging,
  persistent-profile restart and waiting-update test against a temporary local server.
  Requires Playwright Chromium and permission to access loopback. Set
  PLAYWRIGHT_BROWSERS_PATH if Chromium is installed outside the default cache.

The sandbox denied browser loopback networking (`ERR_NETWORK_ACCESS_DENIED`), so
real browser Service Worker installation/offline restart could not be verified here.
The worker event tests and intercepted-production-build media/tracking tests are separate
from that blocked end-to-end test. Actual Android/iPhone home-screen launch must be
checked on the deployed site; no physical-device test is claimed.
