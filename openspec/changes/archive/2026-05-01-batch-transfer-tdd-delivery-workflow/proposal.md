## Why

The interview assignment requires a complete, testable batch transfer experience with CSV ingestion, record validation, and status visibility, but there is no implementation plan that connects requirements, quality gates, and delivery flow. Defining this change now reduces rework by aligning scope, behavior, and test strategy before coding starts.

## What Changes

- Add a home-page transaction table with status rendering and failed-status tooltip behavior.
- Add a three-step modal batch transfer flow (details, review records, summary) with step state persistence in both directions.
- Add CSV parsing and per-record validation for date, account number format, account holder name, and positive amount.
- Add summary metrics generation (total amount, number of payments, average payment value) for validated records.
- Add local persistence behavior so uploaded transactions are appended to the home-page table without backend dependency.
- Define implementation guardrails for engineering rules, recommended Cursor/agent skills, TDD-first feature slicing, and AI-assisted delivery workflow documentation.

## Capabilities

### New Capabilities
- `batch-transfer-modal-flow`: Multi-step modal workflow for creating a batch transfer with preserved step state.
- `csv-record-validation`: CSV ingestion, parsing, validation rules, and review-table error surfacing.
- `transaction-table-and-status`: Home-page transaction list rendering, status labels/colors, and failed-message tooltip behavior.
- `batch-summary-and-persistence`: Summary calculation and appending uploaded records to in-memory/file-backed transaction state.
- `ai-assisted-tdd-delivery`: Rules, skill usage guidance, and Claude Code workflow for TDD-oriented implementation velocity.

### Modified Capabilities
- None.

## Impact

- Affects frontend UI architecture (home page table, modal stepper, review/summary views) and shared domain logic for parsing/validation/statistics.
- Introduces or extends unit and component test suites to support red-green-refactor delivery.
- Uses React 19 with modern supporting libraries: `@tanstack/react-table`, `react-hook-form`, `zod`, `papaparse`, `zustand`, Radix dialog/tooltip, and Vitest/Testing Library stack.
- No external API or backend contract changes are required for the initial delivery scope.
