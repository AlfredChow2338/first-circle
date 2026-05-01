## Context

The app already persists transactions in IndexedDB through Zustand `persist`, but users still need network access to load the application shell and static assets. This creates a gap where data may exist locally yet remain inaccessible during connectivity loss. The change introduces offline readiness through a service worker while preserving current transaction hydration behavior from IndexedDB.

## Goals / Non-Goals

**Goals:**
- Enable users to open/reload the app offline after one successful online load.
- Ensure persisted IndexedDB transactions remain available offline during app boot.
- Define deterministic caching behavior for app shell assets and navigation requests.
- Keep existing snapshot import/export and batch workflow behavior unchanged.

**Non-Goals:**
- Building background sync for server mutation queues.
- Reworking persistence schema or replacing IndexedDB storage implementation.
- Supporting first-ever cold start with zero prior online visit.

## Decisions

1. Service worker strategy: precache app shell + runtime navigation fallback.
   - Rationale: app is SPA-based; precached shell allows reliable offline boot while still allowing runtime cache updates.
   - Alternatives considered:
     - Cache-only strategy for all requests: rejected due to stale asset risk.
     - Network-only fallback: rejected because it does not satisfy offline reload.

2. Keep IndexedDB as single source of truth for transaction persistence.
   - Rationale: this has already replaced localStorage and supports larger datasets plus async access semantics.
   - Alternatives considered:
     - Duplicate state into Cache Storage: rejected to avoid split-brain state and synchronization bugs.

3. Integrate service worker through Vite-compatible Workbox tooling.
   - Rationale: aligns with current build pipeline and supports predictable manifest-driven precaching.
   - Alternatives considered:
     - Hand-rolled service worker without tooling: rejected due to higher maintenance and versioning complexity.

4. Add explicit client-side offline readiness indicator.
   - Rationale: users need clear feedback that offline-capable mode is active after service worker installation.
   - Alternatives considered:
     - No UI signal: rejected because behavior would be opaque and harder to support/test.

## Risks / Trade-offs

- [Stale cached assets serving old UI] -> Mitigation: versioned precache manifest and activate/cleanup strategy.
- [Service worker lifecycle races during first install] -> Mitigation: treat offline readiness as available only after install/activation event.
- [Browser differences in service worker support] -> Mitigation: feature-detect registration and preserve online-only behavior as fallback.
- [Test instability around service worker APIs] -> Mitigation: isolate registration logic and mock service worker container in unit/integration tests.

## Migration Plan

1. Add service worker tooling and registration bootstrap.
2. Implement precache + navigation fallback behavior.
3. Add UI offline readiness signal and tests.
4. Verify online behavior parity, then verify offline reload with existing IndexedDB data.
5. Rollback path: disable service worker registration and ship cache-busting build; IndexedDB data model remains untouched.

## Open Questions

- Should offline readiness be shown as inline banner, status chip, or non-blocking toast?
- Should runtime cache include API requests if backend integration is introduced later?
