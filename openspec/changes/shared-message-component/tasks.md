## 1. Shared Message Infrastructure

- [x] 1.1 Create shared message provider/container and typed message model (`success`, `error`, configurable duration).
- [x] 1.2 Expose a reusable message invocation API (hook/helper) for action handlers to trigger transient messages.
- [x] 1.3 Add vanilla-extract styles for message container positioning, variant appearance, and entry/exit transitions.

## 2. Integrate Existing Actions

- [x] 2.1 Replace inline `snapshotMessage` rendering in `src/App.tsx` with shared message consumption.
- [x] 2.2 Migrate export/import action feedback to shared messages with success/error variants.
- [x] 2.3 Migrate More-menu clear-local-data action feedback to shared messages while preserving confirmation flow.

## 3. Testing and Documentation

- [x] 3.1 Add tests for message lifecycle (render, variant styling, auto-dismiss timing, sequential messages).
- [x] 3.2 Update App interaction tests to assert shared message behavior for export/import/clear actions.
- [x] 3.3 Update README and implementation notes to document shared message usage and UX behavior.
