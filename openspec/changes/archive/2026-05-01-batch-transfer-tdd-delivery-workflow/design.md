## Context

The target system is a frontend-driven batch transfer experience centered on a home page and a modal stepper flow. The product scope includes CSV import, strict record validation, review/error visibility, computed summary metrics, and adding uploaded transactions into the home-page table without backend integration.

The implementation must remain interview-friendly: clear modular architecture, deterministic validation behavior, and unit/component test coverage that demonstrates engineering rigor. The requirements also request explicit disclosure of AI usage; therefore, the delivery process should include a repeatable AI-assisted workflow.

Proposed implementation stack is React 19 with TypeScript and Vite for fast local iteration and simple interview portability.

## Goals / Non-Goals

**Goals:**
- Deliver a complete three-step modal transfer workflow with bidirectional step navigation and no state loss.
- Ensure CSV parsing and validation logic are isolated in pure domain functions and fully testable.
- Ensure UI behavior is covered through component/integration tests for table rendering, tooltip behavior, and step transitions.
- Define coding rules and skill usage guidance that keep implementation consistent and reviewable.
- Define a Claude Code assisted loop that accelerates development while preserving TDD discipline.

**Non-Goals:**
- Building a backend API, database schema, or asynchronous settlement pipeline.
- Implementing production-grade authentication/authorization for approver management.
- Adding advanced CSV capabilities (multi-sheet, custom delimiter UI, streaming very large files).
- Introducing persistent storage beyond in-memory or local file fixture-level persistence.

## Decisions

1. **Layered frontend architecture (UI + domain + state orchestration).**
   - Decision: Separate logic into `domain` (parse/validate/summarize), `state` (stepper/session data), and `ui` (views/components).
   - Rationale: Improves testability and allows TDD to start from pure functions before UI wiring.
   - Alternative considered: Implement all logic inside modal components; rejected due to poor test isolation and high refactor cost.

2. **Strict schema-first CSV validation with row-level error model.**
   - Decision: Convert each CSV row into a normalized record plus an error list keyed by field.
   - Rationale: Enables consistent review-table display, failed status tooltip messaging, and deterministic summary filtering.
   - Alternative considered: Validate only on submit; rejected because Step 2 explicitly requires per-record review and error visibility.

3. **Deterministic status presentation contract.**
   - Decision: Use a centralized status mapping (`Pending`, `Settled`, `Failed`) with color token + optional tooltip text.
   - Rationale: Prevents UI divergence and makes status rendering easy to test.
   - Alternative considered: Inline status styles per component; rejected because it duplicates mapping logic.

4. **TDD-first vertical slices.**
   - Decision: Implement in feature slices where each slice starts with failing tests, then minimal implementation, then refactor.
   - Rationale: Keeps progress measurable and lowers integration risk for multi-step workflows.
   - Alternative considered: Build full UI first then add tests; rejected due to high risk of hidden validation/state regressions.

5. **Rules and skill guidance embedded in workflow artifacts.**
   - Decision: Define rule set for architecture, validation, accessibility, testing, and commit hygiene; map each phase to relevant skills.
   - Rationale: Gives clear guardrails for collaborators and AI tools, reducing context drift.
   - Alternative considered: Keep rules informal in chat only; rejected because repeatability is lower.

6. **Claude Code acceleration through scoped prompts and small checkpoints.**
   - Decision: Use short, bounded prompts per slice (tests first), require local verification before next slice, and maintain an AI usage log.
   - Rationale: Maximizes speed without losing correctness and supports submission transparency requirements.
   - Alternative considered: Large end-to-end generation prompts; rejected due to quality variance and harder review.

7. **Modern React 19 library set optimized for reliability and speed.**
   - Decision: Use `@tanstack/react-table` for transaction/review tables, `react-hook-form` + `zod` for Step 1 form and schema validation, `papaparse` for CSV parsing, `zustand` for wizard state, `@radix-ui/react-tooltip` + `@radix-ui/react-dialog` for accessible modal/tooltip primitives, and `vitest` + `@testing-library/react` + `@testing-library/user-event` + `msw` for tests.
   - Rationale: These libraries are mature, TypeScript-friendly, and map directly to requirement-heavy UI + validation workflows while keeping boilerplate low.
   - Alternative considered: Full UI framework plus monolithic form/data stack; rejected to keep bundle and interview complexity lower.

## Risks / Trade-offs

- [CSV edge cases exceed baseline parser assumptions] -> Mitigation: lock accepted format explicitly in tests, return clear row-level errors for unsupported inputs.
- [Stepper state bugs when navigating backward/forward] -> Mitigation: store canonical wizard state in one source and test navigation round-trips.
- [Floating-point rounding errors in totals/averages] -> Mitigation: normalize amounts to fixed precision strategy and assert summary calculations with representative cases.
- [AI-generated code drifts from constraints] -> Mitigation: enforce red-green-refactor checkpoints, keep prompts file-scoped, and gate merges on test/lint pass.
- [Tooltip accessibility regressions] -> Mitigation: add tests for failed-status semantic labels and keyboard/focus discoverability where applicable.

