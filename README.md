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

### Architecture

Layer 1: View

UI Components.

Layer 2: Domain

Business logic such as parse, validate and summarize. Separate to improve testability and allows TDD from pure functions before UI wiring.

Layer 3: State Orchestration

Steppers and session data.

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
- Package manager: Pnpm 10
