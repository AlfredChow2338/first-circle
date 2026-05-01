## Context

The home page currently exposes export as a standalone button, and local data reset is not directly available to users. Recent changes switched persistence to IndexedDB and export behavior to CSV in implementation, but the product interaction model needs an explicit, discoverable "More" menu that groups secondary actions and includes safe local-data clearing.

## Goals / Non-Goals

**Goals:**
- Replace the standalone export action with a `More` button that reveals action options.
- Provide two menu actions: CSV export and IndexedDB local-data clear.
- Ensure clear-data action resets both persisted storage and in-memory transaction state immediately.
- Preserve existing upload/import/modal behaviors.
- Add deterministic tests for menu toggle, export trigger path, and clear-data flow.

**Non-Goals:**
- Introducing backend-backed delete/reset APIs.
- Changing CSV import validation rules or modal step flow.
- Reworking transaction schema or status semantics.

## Decisions

1. Use a simple in-app menu/popover anchored to `More` button.
   - Rationale: keeps implementation lightweight with existing component patterns, avoids introducing another dependency.
   - Alternatives considered:
     - Add a full dropdown/menu library dependency: rejected to minimize complexity for two actions.

2. Implement clear-data as an explicit store action that coordinates memory + IndexedDB removal.
   - Rationale: store already owns transaction lifecycle; centralizing clear logic avoids split behavior between UI and storage helpers.
   - Alternatives considered:
     - Direct IndexedDB deletion from `App.tsx`: rejected because it bypasses store state consistency.

3. Keep CSV export action in `App.tsx` but invoke from menu item.
   - Rationale: existing export implementation already uses current transactions in state; only trigger location changes.
   - Alternatives considered:
     - Move export into store: rejected since file download concerns are UI/browser-specific.

4. Require confirmation before clearing local data.
   - Rationale: clearing IndexedDB is destructive from user perspective.
   - Alternatives considered:
     - Immediate clear on click: rejected due to accidental data-loss risk.

## Risks / Trade-offs

- [Menu discoverability may hide export action] -> Mitigation: label button as `More` and keep concise action labels.
- [Accidental local data deletion] -> Mitigation: add confirmation step before irreversible clear.
- [Store/persistence mismatch after clear] -> Mitigation: perform clear through single store action that updates both persisted and in-memory state.
- [Regression in export/import tests] -> Mitigation: extend UI tests around menu interactions and action outcomes.

## Migration Plan

1. Add `More` action menu UI in home page and remove standalone export button.
2. Add store/API hook for clearing IndexedDB-backed persisted transactions.
3. Wire menu actions: export CSV and clear local data with confirmation.
4. Update tests and docs for new interaction model.
5. Rollback path: restore previous direct export button and disable clear-data action while retaining existing persistence.

## Open Questions

- Should clear-data action reset transactions to an empty list or to seeded demo transactions?
- Should successful clear show a toast/status message distinct from export status text?
