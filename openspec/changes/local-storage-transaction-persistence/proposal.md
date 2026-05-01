## Why

Uploaded transactions currently live only in runtime state, so data is lost on refresh even though the requirement allows in-memory or file-based persistence without a full backend. Adding local browser persistence with import/export snapshots gives durable UX while keeping the system frontend-only and interview-friendly.

## What Changes

- Persist home-page transaction data to browser local storage so uploaded records survive page reloads.
- Add snapshot export capability to download current transaction data as a versioned JSON file.
- Add snapshot import capability with strict schema validation and explicit error messaging.
- Define versioned snapshot contract and import behavior (replace-all policy) for deterministic recovery.

## Capabilities

### New Capabilities
- `transaction-snapshot-import-export`: User-facing export/import workflow for transaction snapshots with strict contract validation.

### Modified Capabilities
- `batch-summary-and-persistence`: Extend persistence requirement from runtime-only behavior to durable local storage hydration and recovery behavior.

## Impact

- Affects state orchestration layer (`zustand`) for storage hydration/persist behavior.
- Adds import/export controls on the home page and schema validation logic for snapshot files.
- Introduces versioned snapshot contract documentation and tests for malformed/legacy payload handling.
- No backend/API changes; persistence remains fully client-side.
