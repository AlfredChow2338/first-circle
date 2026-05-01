## Why

The current `Step {step} of 3` text in the batch transfer modal gives minimal context and does not visually communicate progression. A shared stepper component is needed now to improve usability and establish a reusable pattern aligned with the target UI style.

## What Changes

- Replace the plain step text in `BatchTransferModal` with a visual multi-step progress indicator.
- Introduce a shared stepper UI component under shared components so other flows can reuse the same pattern.
- Support per-step status presentation (completed, current/in-progress, upcoming/waiting) with labels and descriptive helper text.
- Style the stepper to match the provided reference direction: numbered/circle markers plus connecting progress lines.

## Capabilities

### New Capabilities
- `shared-stepper-progress-indicator`: Shared stepper component behavior and display rules for multi-step workflows.

### Modified Capabilities
- `batch-transfer-modal-flow`: Batch transfer modal step header behavior changes from plain text to the shared visual stepper.

## Impact

- Affected UI: `src/components/BatchTransferModal/BatchTransferModal.tsx` step header area.
- New shared UI component files under `src/components/shared/` (or existing shared component location).
- Affected styling files for modal and stepper presentation.
- Tests for batch transfer modal and shared component rendering/state transitions will need updates.
