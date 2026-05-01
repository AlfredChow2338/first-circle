## Context

The app currently displays user feedback through a single inline status paragraph in `App`, which can be missed and does not provide consistent visual distinction across success/error outcomes. Recent feature growth (export, import, clear-local-data, offline readiness) increases the need for a reusable transient message layer that can be triggered from different UI paths.

## Goals / Non-Goals

**Goals:**
- Introduce a shared message component with API ergonomics similar to antd `message` (success/error style variants and auto-dismiss).
- Replace inline action feedback rendering in `App` with centralized transient messages.
- Support concurrent/repeated action feedback without breaking UX.
- Keep implementation dependency-light and aligned with existing styling architecture (vanilla-extract + shared UI).
- Add tests to verify render, lifecycle, and variant behavior.

**Non-Goals:**
- Implementing a full notification center/history panel.
- Adding global async loading/progress spinners for long-running actions.
- Introducing third-party toast libraries for this iteration.

## Decisions

1. Build an internal message provider + hook (`useMessage`) pattern.
   - Rationale: allows app-wide invocation from components without prop-drilling and mirrors antd message ergonomics.
   - Alternatives considered:
     - Local component state in `App` only: rejected due to poor scalability and reusability.

2. Message model includes `type`, `content`, `duration`, and unique id.
   - Rationale: supports deterministic dismissal and variant styling.
   - Alternatives considered:
     - Single string state: rejected because it cannot reliably handle multiple quick events.

3. Default to top-center stacked toast container.
   - Rationale: high visibility and familiar UX pattern for transient action feedback.
   - Alternatives considered:
     - Bottom-right toast stack: rejected to reduce overlap with modal/table interactions in current layout.

4. Keep store logic focused on domain events and emit message requests at UI boundary.
   - Rationale: prevents presentation concerns from tightly coupling into Zustand store internals.
   - Alternatives considered:
     - Triggering visual message content directly inside store actions: rejected for separation-of-concerns reasons.

## Risks / Trade-offs

- [Rapid action bursts could spam messages] -> Mitigation: constrain max visible messages and auto-dismiss timing.
- [Variant styling inconsistency with existing design tokens] -> Mitigation: define message variants using existing theme variables.
- [Tests become flaky due to timers] -> Mitigation: use controlled fake timers in message lifecycle tests.
- [Incomplete migration leaves mixed inline/toast UX] -> Mitigation: explicitly remove old inline status rendering for migrated actions.

## Migration Plan

1. Add shared message component/provider and style tokens.
2. Integrate provider at app root and expose message hook API.
3. Replace `snapshotMessage` inline display path in `App` action handlers with message calls.
4. Update tests and docs to reflect toast-style feedback behavior.
5. Rollback path: preserve prior inline status rendering behind feature flag or temporary fallback if needed.

## Open Questions

- Should offline readiness status remain persistent inline while action feedback moves to transient messages?
- Should clear-local-data success be `success` or `warning` semantic style?
