## 1. Service Worker Foundation

- [x] 1.1 Add Vite-compatible service worker tooling and baseline configuration for precache manifest generation.
- [x] 1.2 Implement service worker registration in app bootstrap with feature detection and lifecycle event handling.
- [x] 1.3 Create service worker runtime logic for app shell precache and offline navigation fallback.

## 2. Offline State Continuity

- [x] 2.1 Ensure app startup path hydrates transactions from IndexedDB in offline mode without network dependencies.
- [x] 2.2 Add UI offline readiness indicator tied to active service worker control state.
- [x] 2.3 Verify existing batch flow and snapshot import/export behavior remain unchanged while offline mode is enabled.

## 3. Testing and Documentation

- [x] 3.1 Add unit/integration tests for service worker registration and offline-ready UI behavior.
- [x] 3.2 Add coverage for offline reload with previously persisted IndexedDB transactions.
- [x] 3.3 Update README and implementation notes with offline constraints, expected behavior, and verification steps.
