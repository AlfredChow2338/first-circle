## Why

The app now persists transactions in IndexedDB, but it still depends on network availability to load core assets and cannot guarantee a reliable offline experience. Adding service worker support now ensures users can reopen the app offline and continue working with already persisted data.

## What Changes

- Add a service worker that precaches the application shell and serves it offline.
- Add runtime caching for static assets and navigation requests so reloads work without network.
- Ensure app boot and store hydration continue to read persisted transactions from IndexedDB when offline.
- Add an explicit offline readiness signal in the UI so users know cached mode is available.
- Add tests and documentation for service worker behavior and offline expectations.

## Capabilities

### New Capabilities
- `offline-service-worker-state`: Define offline app shell caching, navigation fallback, and IndexedDB-backed state continuity requirements.

### Modified Capabilities
- `batch-summary-and-persistence`: Extend persistence behavior requirements to include offline startup/hydration expectations with IndexedDB-backed transactions.

## Impact

- Affected code: app bootstrap, build config, and new service worker registration/runtime files.
- Affected behavior: app can load and preserve state offline after first successful visit.
- Dependencies/tooling: service worker tooling in Vite build pipeline (or equivalent plugin/workbox integration).
- Tests/docs: add offline behavior coverage and update implementation notes/README for offline constraints.
