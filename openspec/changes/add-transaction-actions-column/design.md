## Context

The home transaction table currently exposes status visibility but no row-level actions. Users need to inspect row details and settle pending transactions directly from the table. The existing React + Zustand architecture already owns transaction state in a central store, so row actions should update state there and keep table rendering declarative.

## Goals / Non-Goals

**Goals:**
- Add an `Actions` column to the transaction table with status-specific controls.
- Support `View` action for all statuses via a reusable details modal.
- Support `Settle` action only for `Pending` rows, with a 2-second mock API delay.
- Update the selected row status to `Settled` after successful mock settlement.
- Provide loading/disabled behavior during settlement to prevent duplicate actions.

**Non-Goals:**
- Integrating a real backend API for settlement.
- Adding bulk settlement workflows.
- Redesigning existing transaction data schema beyond required UI metadata for action state.

## Decisions

- **Decision: Keep row action orchestration in the app/store layer, not inside base `Table`.**  
  The shared `Table` remains presentational. `TransactionTable` receives callbacks and state for row actions and renders action buttons per row.  
  *Alternative considered:* embedding action logic in `Table` would couple generic rendering with domain behavior and reduce reusability.

- **Decision: Add a local async settle helper that returns after 2 seconds.**  
  A mock service function (`Promise` + `setTimeout`) models network latency and keeps future real API replacement straightforward.  
  *Alternative considered:* direct inline `setTimeout` in component event handlers, rejected because it is harder to test and reuse.

- **Decision: Track per-transaction settle-in-progress state by stable row identity.**  
  Disable only the active row’s `Settle` action while allowing other rows to remain interactive.  
  *Alternative considered:* global loading state, rejected because it blocks unrelated interactions and degrades UX.

- **Decision: Reuse existing modal primitives for transaction detail viewing.**  
  The `View` action opens a modal showing all row fields relevant to reconciliation and status context.  
  *Alternative considered:* inline expandable rows, rejected to avoid table density and layout complexity.

## Risks / Trade-offs

- **[Risk] Row identity collisions for pending updates** -> **Mitigation:** use a deterministic composite key derived from immutable row fields already used for rendering.
- **[Risk] User confusion during 2-second delay** -> **Mitigation:** show explicit loading text/state on the `Settle` action and keep other actions responsive.
- **[Trade-off] Mock API may not model backend failures** -> **Mitigation:** structure the settle helper to allow error-path extension in a follow-up change.

## Migration Plan

1. Add spec coverage for action visibility, modal behavior, and settlement transition.
2. Implement actions column and transaction details modal in UI.
3. Add mock settle helper and wire status update in store/app action handlers.
4. Update and run tests for table action visibility, view modal, and settle flow timing.

Rollback is low-risk: remove action column and modal wiring, and keep existing status-only table rendering.

## Open Questions

- Should settlement completion emit the shared toast message for parity with other user-triggered state transitions?
