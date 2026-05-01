# Batch Transaction Processing System

### Product Scope

- CSV import
- Strict record validation
- Review/error visibility
- Computed summary metrics
- Adding uploaded transactions into the home-page table without backend integration

### CSV Upload Rules

- Step 1 uses file upload only (no freeform CSV textarea input).
- Only `.csv` files are accepted.
- CSV must use exact header order:
  - `Transaction Date,Account Number,Account Holder Name,Amount`
- Each row must contain exactly 4 columns; malformed rows are rejected before Step 2.
- Invalid file type or malformed structure shows inline validation error and blocks progression.

### Persistence and Snapshot

- Transactions are persisted in **IndexedDB** (database `batch-transactions-db`, object store `zustand-persist`, persist name `batch-transactions-v1`).
- Only durable transaction data is persisted; modal/transient state is not persisted.
- Home page supports:
  - `Export Transactions` -> downloads versioned JSON snapshot
  - `Import Transactions` -> validates and replaces current transactions on success
- Snapshot contract v1:
  - `version: 1`
  - `exportedAt` (ISO timestamp)
  - `source: "first-circle-interview"`
  - `transactions` array

### Offline Support

- The app registers a service worker in production builds and precaches app-shell assets.
- After one successful online visit, reloads can open the app while offline.
- Offline mode uses IndexedDB as the source of truth for persisted transactions during hydration.
- UI shows readiness:
  - `Offline mode not ready yet.` before the page is controlled by the active service worker.
  - `Offline mode ready.` once service worker control is active.

### Offline Verification

- Build and preview production output:
  - `pnpm build`
  - `pnpm preview`
- Open the app once while online, then switch DevTools network to **Offline** and reload.
- Confirm:
  - The app shell still renders.
  - Existing transactions are hydrated from IndexedDB.
  - Snapshot export/import behavior remains unchanged.

### Goals

- Deliver a complete three-step modal transfer workflow with bidirectional step navigation and no state loss.
- Ensure CSV parsing and validation logic are isolated in pure domain functions and fully testable.
- Ensure UI behavior is covered through component/integration tests for table rendering, tooltip behavior, and step transitions.
- Define coding rules and skill usage guidance that keep implementation consistent and reviewable.
- Define a Claude Code assisted loop that accelerates development while preserving TDD discipline.

### Architecture

- View: UI Components for visualisation.

- Domain: Business logic such as parse, validate and summarize. Separate to improve testability and allows TDD from pure functions before UI wiring.

- State Orchestration: Steppers and session data.

### Tech stack (TS-friendly)

- React 19
- @tanstack/react-table
- react-hook-form
- zod
- papaparse
- zustnd
- Radix dialog/tooltip
- Vitest
- Reat Testing Library (RTL)
- IDB (IndexedDB)

- vanilla-extract/css
  - ✅ Type-safe - ClassNames are typed and autocompleted
  - ✅ Scoped - No CSS conflicts or naming collisions
  - ✅ Tree-shakeable - Unused styles are removed from production

- Package manager: Pnpm 10

### Import Rules

- Do not use relative imports deeper than `../../..`; use `src/...` instead.
- Import order is enforced as: libraries -> `src/...` -> relative (`./`, `../`).
- Keep a blank line between import groups.

### Lint and Format Workflow

- Format code: `pnpm format`
- Check formatting: `pnpm format:check`
- Lint code: `pnpm lint`
- Autofix lint issues: `pnpm lint:fix`
- Recommended local sequence: `pnpm format && pnpm lint`

### Data Persistence Consideration

- Local storage cannot handle large-size dataset due to 10MB size limit.
- Another alternative will be IndexDB
  - ✅ Async, much larger quota (browser/device dependent, often hundreds of MB+)
  - ✅ Can store structured objects directly (without `JSON.stringify`)
  - ✅ Libraries such as `idb` or `Dexie` provide good DX

### Practical approach for large-size CSV

- User selects file.
- Read it in chunks (File.stream() or chunked slicing).
- Parse incrementally (worker thread recommended).
- Persist records in IndexedDB in batches (e.g., 500–5000 rows per transaction).
- UI reads paginated slices from IndexedDB (not all rows at once).
