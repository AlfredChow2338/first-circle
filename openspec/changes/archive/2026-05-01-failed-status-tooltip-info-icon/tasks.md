## 1. Failed status icon trigger

- [x] 1.1 Update status cell rendering in `src/ui/TransactionTable.tsx` to show an info icon beside `Failed` status labels only.
- [x] 1.2 Ensure tooltip trigger behavior works for hover and keyboard focus on the failed-status icon trigger.

## 2. Tooltip UI refinement

- [x] 2.1 Add or adjust styles for failed-status icon alignment, spacing, and focus visibility in table-related style files.
- [x] 2.2 Keep tooltip content mapped to the row `errorMessage` and ensure visual readability for failed reasons.

## 3. Verification

- [x] 3.1 Update or add tests validating info-icon presence for failed rows and absence for non-failed rows.
- [x] 3.2 Verify tooltip interaction path (hover/focus) and run lint/test to ensure no regressions.
