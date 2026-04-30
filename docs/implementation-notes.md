# Implementation Notes

## Requirement Traceability
- `csv-record-validation` -> `src/domain/validation.ts`, `src/domain/csv.ts`, tests in `src/domain/*.test.ts`.
- `transaction-table-and-status` -> `src/ui/TransactionTable.tsx`, tests in `src/ui/TransactionTable.test.tsx`.
- `batch-transfer-modal-flow` and `batch-summary-and-persistence` -> `src/ui/BatchTransferModal.tsx`, `src/state/useBatchTransferStore.ts`, tests in `src/App.test.tsx`.

## Known Trade-offs
- CSV input currently uses a textarea to keep scope small and deterministic.
- Transactions are persisted in-memory through store state only.
- Styling is intentionally minimal to prioritize behavior and testability.

## Suggested Enhancements
- Replace textarea with true file upload control and FileReader parsing.
- Add richer visual status tokens and mobile responsive layout.
- Persist transactions to local storage for browser refresh continuity.
