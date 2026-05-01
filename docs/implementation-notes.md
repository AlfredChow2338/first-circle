# Implementation Notes

## Requirement Traceability
- `csv-record-validation` -> `src/domain/validation.ts`, `src/domain/csv.ts`, tests in `src/domain/*.test.ts`.
- `transaction-table-and-status` -> `src/ui/TransactionTable.tsx`, tests in `src/ui/TransactionTable.test.tsx`.
- `batch-transfer-modal-flow` and `batch-summary-and-persistence` -> `src/ui/BatchTransferModal.tsx`, `src/state/useBatchTransferStore.ts`, tests in `src/App.test.tsx`.

## Known Trade-offs
- CSV input now uses file upload with strict `.csv` checks and schema validation, which is safer but slightly more rigid for ad-hoc testing.
- Transactions are persisted in-memory through store state only.
- Styling is intentionally minimal to prioritize behavior and testability.

## Suggested Enhancements
- Add drag-and-drop support on top of the current file upload control.
- Add richer visual status tokens and mobile responsive layout.
- Persist transactions to local storage for browser refresh continuity.

## Validation approach rationale
- `papaparse` is used for robust CSV parsing.
- `zod` is used to enforce strict header shape with TypeScript-friendly schema checks.
- File-level validation runs before step transition so malformed uploads fail early with actionable messages.
