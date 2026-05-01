## 1. Foundation and guardrails

- [x] 1.1 Define project rule checklist in repo docs (layer boundaries, pure validation functions, status mapping centralization, accessibility requirements for tooltips, and Red-Green-Refactor enforcement).
- [x] 1.2 Install and configure React 19 stack dependencies (`typescript`, `vite`, `@tanstack/react-table`, `react-hook-form`, `zod`, `papaparse`, `zustand`, Radix dialog/tooltip primitives).
- [x] 1.3 Configure testing baseline (`vitest`, `@testing-library/react`, `@testing-library/user-event`, `msw`) with coverage thresholds and CI/local commands.
- [x] 1.4 Identify and document active skills for this change (`openspec-apply-change`, `vercel-react-best-practices`, `web-design-guidelines`) and when to use each.
- [x] 1.5 Create AI usage log template to capture prompt intent, generated scope, and verification evidence for submission transparency.

## 2. Domain-first TDD slices (red-green-refactor)

- [x] 2.1 Write failing unit tests for CSV header parsing and row normalization contract.
- [x] 2.2 Implement minimum CSV parser to satisfy parsing tests, then refactor for readability.
- [x] 2.3 Write failing unit tests for validation rules: date format/validity, account number pattern, non-empty name, positive amount.
- [x] 2.4 Implement validation engine returning row-level field errors and pass all validation tests.
- [x] 2.5 Write failing unit tests for summary math (total, payment count, average) including decimal edge cases.
- [x] 2.6 Implement summary calculator with deterministic rounding strategy and pass summary tests.

## 3. UI workflow slices (component/integration TDD)

- [x] 3.1 Write failing component tests for home-page transaction table columns and status label/color mapping.
- [x] 3.2 Implement table/status UI and failed-status tooltip behavior to satisfy tests.
- [x] 3.3 Write failing integration tests for modal stepper open, step transitions, and bidirectional state persistence.
- [x] 3.4 Implement Step 1 transfer details UI (batch name, CSV upload, approver selection) with state orchestration.
- [x] 3.5 Implement Step 2 review table wired to parser/validator and satisfy review/error display tests.
- [x] 3.6 Implement Step 3 summary view and finalization action that appends transactions to home-page data source.

## 4. Claude Code accelerated development workflow

- [x] 4.1 For each slice, draft a scoped Claude prompt that asks for tests first, constrains touched files, and references relevant spec requirement.
- [x] 4.2 Run Claude in short loops (generate tests -> run tests -> generate implementation -> run tests), never combining multiple slices in one prompt.
- [x] 4.3 After each loop, manually review generated diffs against rule checklist and reject/rework any architecture or accessibility violations.
- [x] 4.4 Record AI assistance summary per completed slice (what Claude produced, what was changed manually, and final verification outcome).

## 5. Quality gates and handoff

- [x] 5.1 Execute full test suite, lint, and formatting checks; resolve failures and remove flaky assertions.
- [x] 5.2 Run manual acceptance pass using provided valid/invalid CSV samples and confirm all required UI behaviors.
- [x] 5.3 Finalize implementation notes: requirement traceability (spec -> tests -> code), known trade-offs, and next-step enhancements.
- [x] 5.4 Prepare final interview submission summary including explicit AI usage statement and contribution details.
