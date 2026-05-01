## 1. Shared Stepper Component

- [x] 1.1 Create a shared stepper component in `src/components/shared/` with props for step items and active step index.
- [x] 1.2 Implement step state derivation (completed, active, waiting) and render marker, label, optional helper text, and connectors.
- [x] 1.3 Add/update shared styles to match the requested stepper visual pattern in the provided reference.

## 2. Batch Transfer Modal Integration

- [x] 2.1 Replace `Step {step} of 3` in `src/components/BatchTransferModal/BatchTransferModal.tsx` with the new shared stepper component.
- [x] 2.2 Provide batch-transfer step definitions (Transfer Details, Review Records, Summary) and wire current step state.
- [x] 2.3 Remove or refactor obsolete modal-specific step indicator styles and keep layout responsive.

## 3. Validation and Regression Coverage

- [x] 3.1 Update/add component tests to verify shared stepper renders correct states for active, completed, and waiting steps.
- [x] 3.2 Update batch transfer modal tests to assert stepper-based progress rendering instead of plain step text.
- [x] 3.3 Run lint and relevant tests, then resolve any regressions.
