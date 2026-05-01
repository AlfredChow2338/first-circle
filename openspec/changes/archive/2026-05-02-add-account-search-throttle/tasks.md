## 1. Search Input and Throttle Hook

- [x] 1.1 Add transaction search input UI for account number/account holder name in the home view.
- [x] 1.2 Implement 0.5 second throttled query state handling in hook/app logic.
- [x] 1.3 Ensure throttle timers are cleaned up correctly on query updates and unmount.

## 2. Filtered Data Integration

- [x] 2.1 Implement case-insensitive partial filtering for `Account Holder Name`.
- [x] 2.2 Implement partial filtering for `Account Number`.
- [x] 2.3 Pass filtered transaction rows to `TransactionTable` while preserving existing actions and status behavior.

## 3. Verification and Coverage

- [x] 3.1 Add/adjust app integration tests for throttled search delay behavior.
- [x] 3.2 Add/adjust tests to verify filtering by both target columns.
- [x] 3.3 Add/adjust tests to ensure row actions still work on filtered results.
- [x] 3.4 Run lint and targeted tests, then resolve regressions.
