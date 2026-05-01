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
