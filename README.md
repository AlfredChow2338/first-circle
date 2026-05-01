# Batch Transaction Processing System

### Product Scope

- CSV import
- Strict record validation
- Review/error visibility
- Computed summary metrics
- Adding uploaded transactions into the home-page table without backend integration

### Goals

- Deliver a complete three-step modal transfer workflow with bidirectional step navigation and no state loss.
- Ensure CSV parsing and validation logic are isolated in pure domain functions and fully testable.
- Ensure UI behavior is covered through component/integration tests for table rendering, tooltip behavior, and step transitions.
- Define coding rules and skill usage guidance that keep implementation consistent and reviewable.
- Define a Claude Code assisted loop that accelerates development while preserving TDD discipline.

### CSV Upload Rules

- Only `.csv` files are accepted.
- CSV must use exact header order:
  - `Transaction Date,Account Number,Account Holder Name,Amount`
- Each row must contain exactly 4 columns; malformed rows are rejected before Step 2.
- Invalid file type or malformed structure shows inline validation error and blocks progression.

### Home Actions

- Home page uses a `More` menu for secondary data actions:
  - `Export Transactions (.csv)` downloads current table rows in CSV format.
  - `Clear Local Data` removes all persisted IndexedDB transaction data after confirmation.
- Clearing local data also resets in-memory transaction state so the table updates immediately.

### Offline Support

- The app registers a service worker in production builds and precaches app-shell assets.
- After one successful online visit, reloads can open the app while offline.
- Offline mode uses IndexedDB as the source of truth for persisted transactions during hydration.
- UI shows readiness:
  - `Offline mode not ready yet.` before the page is controlled by the active service worker.
  - `Offline mode ready.` once service worker control is active.

### Tech stack (React and TypeScript friendly)

- @tanstack/react-table
  - ✅ Headless architecture gives full UI control while keeping powerful table logic (sorting/filtering/pagination).
  - ✅ Excellent TypeScript support for strongly-typed columns and cells.
  - ✅ Performs well for complex data tables and scales with feature growth.

- react-hook-form
  - ✅ Minimal re-renders via uncontrolled inputs, so forms stay fast.
  - ✅ Great DX with simple APIs and clean validation/error handling.
  - ✅ Easy integration with schema validators (like zod) and custom inputs.

- zod
  - ✅ Runtime validation + static TypeScript inference from one schema source.
  - ✅ Clear, composable schemas that are easy to maintain and reuse.
  - ✅ Safer parsing with predictable error structures for UI messaging.

- papaparse
  - ✅ Mature CSV parser with robust handling of edge cases (quotes, delimiters, malformed rows).
  - ✅ Browser-friendly and fast for client-side parsing.
  - ✅ Supports step/chunk parsing patterns for larger files.
- zustnd
  - ✅ Lightweight state management with low boilerplate and readable store patterns.
  - ✅ Flexible: simple local state up to app-wide state, with middleware support (persist, etc.).
  - ✅ Works very well with React hooks and TypeScript.
- Radix dialog/tooltip
  - ✅ Accessibility-first primitives (keyboard navigation, focus management, ARIA behavior).
  - ✅ Unstyled components let you keep your own design system.
  - ✅ Reliable behavior for tricky UI interactions across browsers.
- Vitest
  - ✅ Very fast test runs with Vite-native integration.
  - ✅ Jest-like API makes adoption easy.
  - ✅ Good TypeScript and ESM support out of the box.

- Reat Testing Library (RTL)
  - ✅ Encourages user-centric testing (interactions and visible behavior over internals).
  - ✅ Produces more resilient tests during refactors.
  - ✅ Great ecosystem integration (jest-dom, user-event) for realistic UI testing.

- IDB (IndexedDB)
  - ✅ Much cleaner promise-based API over raw IndexedDB.
  - ✅ Great for larger client-side persistence than localStorage.
  - ✅ Supports structured object storage and transactional semantics for safer data operations.

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
