## 1. Persistence foundation

- [x] 1.1 Add zustand persist middleware to store `transactions` in local storage under a versioned storage key.
- [x] 1.2 Ensure modal/transient fields are excluded from persisted state so only durable transaction data is hydrated.
- [x] 1.3 Add hydration-safe initialization path so transaction table renders persisted data after reload.

## 2. Snapshot contract and validation

- [x] 2.1 Define TypeScript snapshot contract (`version`, `exportedAt`, `source`, `transactions`) for export/import.
- [x] 2.2 Implement strict import validation for JSON parse errors, unsupported version, and malformed transaction records.
- [x] 2.3 Implement deterministic replace-all import behavior with no mutation on validation failure.

## 3. Import/export UI workflow

- [x] 3.1 Add `Export Transactions` action on the home page to download versioned snapshot JSON.
- [x] 3.2 Add `Import Transactions` action with file picker limited to JSON snapshots.
- [x] 3.3 Display explicit user-facing success/error feedback for snapshot import/export operations.

## 4. Testing and reliability

- [x] 4.1 Add tests verifying export shape and metadata contract.
- [x] 4.2 Add tests verifying valid import replaces transactions and invalid import leaves state unchanged.
- [x] 4.3 Add tests verifying persisted transactions are restored after simulated reload/hydration.

## 5. Documentation and migration notes

- [x] 5.1 Update README with persistence behavior, storage key, and snapshot import/export usage.
- [x] 5.2 Document v1 snapshot schema and future version migration expectations.
- [x] 5.3 Run lint/test/build and capture final notes on any local storage limitations and safeguards.
