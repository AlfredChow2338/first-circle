## 1. More Menu UI Integration

- [x] 1.1 Replace the standalone export button in `src/App.tsx` with a `More` button and menu container.
- [x] 1.2 Add `Export Transactions` and `Clear Local Data` menu options with click handling and close-on-select behavior.
- [x] 1.3 Add clear-data confirmation flow before destructive action execution.

## 2. Export and Persistence Actions

- [x] 2.1 Keep CSV export behavior but trigger it from the `More` menu action.
- [x] 2.2 Add a store/storage action to clear all persisted transaction data from IndexedDB and synchronize in-memory state.
- [x] 2.3 Ensure post-clear UI state reflects emptied transaction data and user feedback message.

## 3. Verification and Documentation

- [x] 3.1 Add/adjust tests for More menu rendering, action selection, and confirmation behavior.
- [x] 3.2 Add/adjust tests for clear-local-data persistence reset and CSV export trigger path.
- [x] 3.3 Update README and implementation notes to document More menu actions and clear-local-data semantics.
