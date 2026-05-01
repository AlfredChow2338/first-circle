## Why

Primary actions on the home page are becoming crowded, and export behavior no longer matches the desired CSV workflow. A consolidated "More" action menu with explicit data-management actions improves usability while giving users a safe way to clear persisted local IndexedDB data when needed.

## What Changes

- Replace the dedicated export button with a `More` button in the home-page action bar.
- Add a dropdown/menu opened by `More` with two actions:
  - `Export Transactions` (CSV export).
  - `Clear Local Data` (clear all persisted IndexedDB transaction data).
- Update transaction export requirements from JSON snapshot export to CSV export from current transaction rows.
- Define clear-data behavior for in-memory and persisted state so UI remains consistent immediately after clearing.
- Add tests for menu interactions, CSV export action, and clear-local-data behavior.

## Capabilities

### New Capabilities
- `home-more-actions-menu`: Covers the home-page `More` menu interaction model and action options for export and local-data clearing.

### Modified Capabilities
- `transaction-snapshot-import-export`: Change export requirement from JSON snapshot file to CSV transaction export.
- `batch-summary-and-persistence`: Add requirement coverage for user-triggered clearing of persisted IndexedDB transaction data.

## Impact

- Affected UI: `src/App.tsx` action controls and menu behavior.
- Affected state/storage: Zustand store actions and IndexedDB clear/delete path.
- Affected docs/tests: export behavior docs, persistence notes, and integration/state tests for clear-data and menu options.
