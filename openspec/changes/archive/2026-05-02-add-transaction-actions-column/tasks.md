## 1. Transaction Row Actions API

- [x] 1.1 Define row action handlers and selected-transaction modal state in `App`/store wiring.
- [x] 1.2 Add a mock settle service function that resolves after 2 seconds.
- [x] 1.3 Implement transaction status update logic for settling a single `Pending` row.
- [x] 1.4 Track per-row settle-in-progress state and expose it to table action rendering.

## 2. Transaction Table and Modal UI

- [x] 2.1 Add an `Actions` column to `TransactionTable` and render status-based `View` / `Settle` controls.
- [x] 2.2 Implement a transaction details modal opened by `View` for `Pending`, `Failed`, and `Settled` rows.
- [x] 2.3 Disable or show loading state on `Settle` while the row settlement request is in progress.
- [x] 2.4 Ensure non-`Pending` rows only render `View` and never render `Settle`.

## 3. Validation and Test Coverage

- [x] 3.1 Add/adjust component tests for `Actions` column visibility and status-based action combinations.
- [x] 3.2 Add/adjust tests verifying `View` opens the details modal with selected transaction data.
- [x] 3.3 Add/adjust tests for mock settle timing and status transition from `Pending` to `Settled`.
- [x] 3.4 Run lint and targeted test suites, then resolve regressions introduced by the change.
