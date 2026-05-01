# Implementation Notes

## Requirement Traceability
- `csv-record-validation` -> `src/domain/validation.ts`, `src/domain/csv.ts`, tests in `src/domain/*.test.ts`.
- `transaction-table-and-status` -> `src/ui/TransactionTable.tsx`, tests in `src/ui/TransactionTable.test.tsx`.
- `batch-transfer-modal-flow` and `batch-summary-and-persistence` -> `src/ui/BatchTransferModal.tsx`, `src/state/useBatchTransferStore.ts`, tests in `src/App.test.tsx`.
- `transaction-snapshot-import-export` -> `src/domain/snapshot.ts`, `src/state/useBatchTransferStore.ts`, import/export controls in `src/App.tsx`, tests in `src/domain/snapshot.test.ts` and `src/state/useBatchTransferStore.test.ts`.

## Known Trade-offs
- CSV input now uses file upload with strict `.csv` checks and schema validation, which is safer but slightly more rigid for ad-hoc testing.
- Transactions are persisted in local storage (frontend-only), which is durable across reload but constrained by browser storage limits.
- Styling is intentionally minimal to prioritize behavior and testability.

## Suggested Enhancements
- Add drag-and-drop support on top of the current file upload control.
- Add richer visual status tokens and mobile responsive layout.
- Add snapshot merge modes (append/dedupe) beyond current replace-all import policy.

## Validation approach rationale
- `papaparse` is used for robust CSV parsing.
- `zod` is used to enforce strict header shape with TypeScript-friendly schema checks.
- File-level validation runs before step transition so malformed uploads fail early with actionable messages.

## Snapshot versioning note
- Snapshot schema is versioned (`version: 1`) to support future migrations.
- Import currently accepts v1 only and fails fast for unsupported or malformed payloads.
