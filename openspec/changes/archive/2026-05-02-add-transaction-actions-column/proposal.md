## Why

Users can currently see transaction status but cannot take contextual actions from each row. This slows routine operations because settlement and detail checks require manual or future out-of-band workflows.

## What Changes

- Add an `Actions` column to the transaction table rendered from `src/App.tsx`.
- For `Pending` transactions, provide `View` and `Settle` actions.
- For `Failed` and `Settled` transactions, provide `View` action only.
- Add a transaction details modal opened by `View` for all statuses.
- Add a mock settle flow that waits 2 seconds, then updates the selected `Pending` transaction status to `Settled`.
- Disable or show loading state for `Settle` while the mock request is in progress to prevent repeated triggers.

## Capabilities

### New Capabilities
- `transaction-row-actions`: Row-level transaction actions, including status-based action visibility, details modal viewing, and mock settlement behavior.

### Modified Capabilities
- `transaction-table-and-status`: Extend table behavior to include an `Actions` column and status-driven interactive controls.

## Impact

- Affected UI: `src/App.tsx`, `src/components/TransactionTable/*`, and shared modal/button/table wiring as needed.
- Affected state: transaction status updates in the batch transfer store.
- Affected tests: transaction table behavior tests and app flow tests for action visibility and settle transitions.
- No new external dependencies are required; mock API behavior can be implemented with existing async utilities (`setTimeout`/Promise).
