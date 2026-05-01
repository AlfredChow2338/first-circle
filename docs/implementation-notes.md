# Implementation Notes

## Requirement Traceability
- `csv-record-validation` -> `src/domain/validation.ts`, `src/domain/csv.ts`, tests in `src/domain/*.test.ts`.
- `transaction-table-and-status` -> `src/ui/TransactionTable.tsx`, tests in `src/ui/TransactionTable.test.tsx`.
- `batch-transfer-modal-flow` and `batch-summary-and-persistence` -> `src/ui/BatchTransferModal.tsx`, `src/state/useBatchTransferStore.ts`, tests in `src/App.test.tsx`.
- `transaction-snapshot-import-export` -> `src/domain/snapshot.ts`, `src/state/useBatchTransferStore.ts`, `src/storage/transactionsIndexedDb.ts`, `src/storage/createIndexedDbPersistStorage.ts`, import/export controls in `src/App.tsx`, tests in `src/domain/snapshot.test.ts` and `src/state/useBatchTransferStore.test.ts`.
- `offline-service-worker-state` -> `src/service-worker.ts`, `src/offline/registerServiceWorker.ts`, bootstrap in `src/main.tsx`, offline readiness UI in `src/App.tsx`, tests in `src/offline/registerServiceWorker.test.ts` and `src/App.test.tsx`.
- `home-more-actions-menu` -> `src/App.tsx` More menu actions, `src/state/useBatchTransferStore.ts` clear-local-data action, and tests in `src/App.test.tsx` / `src/state/useBatchTransferStore.test.ts`.
- `shared-message-feedback` -> `src/ui/shared/message/MessageProvider.tsx`, `src/styles/message.css.ts`, feedback integration in `src/App.tsx`, tests in `src/ui/shared/message/MessageProvider.test.tsx` and `src/App.test.tsx`.

## Known Trade-offs
- CSV input now uses file upload with strict `.csv` checks and schema validation, which is safer but slightly more rigid for ad-hoc testing.
- Transactions are persisted in IndexedDB via `idb` (frontend-only), which is durable across reload and scales to larger datasets.
- Offline startup depends on prior service worker installation and first online asset caching pass.
- Clear local data intentionally removes all persisted IndexedDB transaction envelopes and clears in-memory rows.
- User feedback for export/import/clear actions now uses transient shared messages instead of inline status text.
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

## Offline verification checklist
- `pnpm lint`
- `pnpm test`
- `pnpm build`
- Manual check in production preview: load once online, toggle browser offline, reload, verify app shell + IndexedDB hydration.
