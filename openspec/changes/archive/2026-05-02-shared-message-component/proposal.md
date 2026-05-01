## Why

Current user feedback is rendered as a static inline status line in `App`, which can be easy to miss and provides limited visual hierarchy for success vs error states. A shared message component (toast-like, similar to Ant Design message UX) will improve clarity, consistency, and reuse across app actions.

## What Changes

- Introduce a shared message/notification component system for transient user feedback.
- Replace direct inline `snapshotMessage` rendering in `App` with shared message display behavior.
- Support at least `success` and `error` message variants with consistent styling and auto-dismiss behavior.
- Provide a simple API so current actions (export/import/clear local data) can trigger messages without duplicating UI logic.
- Add tests and docs describing message behavior and usage patterns.

## Capabilities

### New Capabilities
- `shared-message-feedback`: Defines reusable app-wide transient feedback messages for user actions with typed variants and lifecycle behavior.

### Modified Capabilities
- `transaction-snapshot-import-export`: Update feedback delivery requirement for export/import actions to use shared message mechanism instead of inline-only status text.
- `home-more-actions-menu`: Update feedback requirement for `Clear Local Data` action to use shared message mechanism.

## Impact

- Affected UI: `src/App.tsx` message display path and action handlers.
- Affected state: current message field usage and any new message queue/manager abstraction.
- Affected tests/docs: App-level interaction tests and implementation notes/README feedback guidance.
