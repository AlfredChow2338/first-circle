## Context

`BatchTransferModal` currently renders a plain header text (`Step {step} of 3`) to indicate progress. The requested UI introduces a richer, multi-step visual stepper with explicit status signaling for completed, current, and upcoming steps, similar to the provided reference. The implementation should be reusable across flows rather than tightly coupled to batch transfer.

## Goals / Non-Goals

**Goals:**
- Replace simple step text with a structured visual stepper in the batch transfer modal.
- Introduce a shared stepper component API that accepts step metadata and active index.
- Ensure styling supports distinct states (completed, in-progress, waiting) and connector progress lines.
- Keep modal behavior and state transitions unchanged beyond presentation.

**Non-Goals:**
- Changing modal workflow logic, step count, or step validation rules.
- Adding backend/API behavior.
- Introducing animation libraries or cross-page navigation behaviors.

## Decisions

1. **Create a shared `Stepper` component in the shared UI layer**
   - **Why:** The request explicitly asks for a shared component; this avoids duplicating step indicator code in future flows.
   - **Alternative considered:** Keep a modal-local stepper implementation. Rejected due to lower reusability and inconsistent UI patterns.

2. **Model each step with display metadata (`title`, optional `description`) and derive status from active step**
   - **Why:** Keeps call sites simple and deterministic while allowing richer labels and helper text.
   - **Alternative considered:** Pass fully computed status per step from each parent. Rejected to reduce parent complexity for common linear steppers.

3. **Implement connector and marker states via CSS classes using existing styling approach**
   - **Why:** Aligns with current project styling conventions and keeps DOM semantics straightforward for tests.
   - **Alternative considered:** Use inline styles or SVG for connectors. Rejected because class-based styling is easier to maintain and test.

4. **Update modal tests to verify stepper semantics instead of raw `Step X of 3` text**
   - **Why:** Prevents brittle tests tied to removed UI text while preserving behavior coverage.
   - **Alternative considered:** Keep text assertion alongside stepper. Rejected because old text is replaced by design.

## Risks / Trade-offs

- **Visual parity risk** -> The implemented stepper may not exactly match the reference image.  
  **Mitigation:** Define clear state classes and verify key visual elements (markers, connectors, labels) in CSS and QA review.

- **Shared API overfitting risk** -> Future flows might need non-linear navigation states.  
  **Mitigation:** Keep initial API small but extensible (accept optional per-step description and external className hooks).

- **Test fragility risk** -> UI structure changes can break selector assumptions.  
  **Mitigation:** Prefer role/label based assertions and stable text labels for each step.
