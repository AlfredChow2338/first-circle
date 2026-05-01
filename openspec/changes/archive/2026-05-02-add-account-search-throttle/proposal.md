## Why

As transaction volume grows, users need a faster way to locate records by account details without scanning every row. Adding throttled search improves usability while avoiding excessive UI updates during typing.

## What Changes

- Add a search input that filters transaction table rows by `Account Number` and `Account Holder Name`.
- Apply a 0.5 second throttle delay before search filtering is applied.
- Ensure search matching works for partial text in both target columns.
- Keep search behavior integrated with current table rendering (including existing actions/status behavior).

## Capabilities

### New Capabilities
- `transaction-table-throttled-search`: Throttled search over account number and account holder name for transaction table data.

### Modified Capabilities
- `transaction-table-and-status`: Extend transaction table behavior to support filtered row rendering based on throttled account search input.

## Impact

- Affected UI: `src/App.tsx`, `src/components/TransactionTable/*`, and potentially shared table wiring for filtered data flow.
- Affected state/hooks: transaction list derivation logic for throttled query application.
- Affected tests: transaction table and app integration tests to validate search filtering and throttle delay behavior.
- No new external dependencies are required; throttle can be implemented with existing React hooks/timers.
