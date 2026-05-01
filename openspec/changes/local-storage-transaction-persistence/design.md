## Context

The current transaction list is held in runtime state only, so confirmed uploads disappear on browser refresh. The requirement allows in-memory or file-based persistence without backend infrastructure, making local browser storage a suitable default.

We also want data portability and recovery. A versioned snapshot import/export workflow gives user-controlled file-based backup while keeping persistence fully client-side.

## Goals / Non-Goals

**Goals:**
- Persist transaction records in local storage so data survives reload and tab restart.
- Provide export of current transactions as a versioned JSON snapshot.
- Provide import of snapshots with strict schema validation and explicit error handling.
- Define deterministic import behavior (replace-all) and snapshot contract versioning.

**Non-Goals:**
- Backend database storage or API sync.
- Multi-user conflict resolution or collaborative state sharing.
- Supporting multiple import formats in v1 (JSON only).

## Decisions

1. **Use zustand `persist` middleware for transaction state.**
   - Rationale: Minimal integration with existing store, strong TypeScript support, predictable hydration.
   - Alternative: manual localStorage synchronization; rejected for extra boilerplate and edge-case risk.

2. **Persist only durable domain state (`transactions`) and exclude modal transient fields.**
   - Rationale: Modal UI state (step/errors/upload file selection) should not survive app restart.
   - Alternative: persist full store; rejected due to confusing resumed modal sessions.

3. **Use JSON snapshot format with explicit contract (`version`, `exportedAt`, `source`, `transactions`).**
   - Rationale: Easier strict validation and backward-compatible migrations than CSV for snapshots.
   - Alternative: CSV snapshot export/import; rejected for weaker schema expressiveness and metadata support.

4. **Validate imports with strict schema checks before mutation, then replace-all on success.**
   - Rationale: Deterministic behavior, simple mental model, avoids accidental duplication.
   - Alternative: append/dedupe mode; deferred to future enhancement.

5. **Add import/export controls at home-page level near transaction table.**
   - Rationale: Users should manage persistent dataset where they inspect transactions.
   - Alternative: modal-only controls; rejected for discoverability.

## Risks / Trade-offs

- [localStorage quota limits for very large datasets] -> Mitigation: scope to interview-sized data and add user-friendly quota error message.
- [Invalid or stale snapshot files] -> Mitigation: strict versioned schema validation with actionable error text.
- [Schema evolution over time] -> Mitigation: include `version` field and optional migration path for future versions.
- [Hydration flicker or stale state assumptions] -> Mitigation: render from hydrated persisted state and keep modal state non-persistent.
