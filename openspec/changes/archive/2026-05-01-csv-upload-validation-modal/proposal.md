## Why

The current Step 1 CSV input uses a freeform textarea, which allows invalid content entry and bypasses file-type constraints expected in real batch upload workflows. Switching to a strict `.csv` file upload flow with explicit format validation improves correctness, user guidance, and downstream parsing reliability.

## What Changes

- Replace the Step 1 CSV textarea with a file upload control restricted to `.csv` file selection.
- Add strict CSV schema validation before Step 2 navigation, including header checks and row-shape validation.
- Add clear user-facing error messages for invalid file type, malformed CSV structure, and invalid row format.
- Allow optional use of modern TypeScript-friendly validation/parser helper libraries where they improve reliability and maintainability.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `batch-transfer-modal-flow`: Step 1 input interaction changes from freeform textarea to CSV file selection with validation gate before proceeding.
- `csv-record-validation`: Validation scope is expanded to include strict file-level and schema-level checks with explicit upload error handling.

## Impact

- Affects `src/ui/BatchTransferModal/BatchTransferModal.tsx` Step 1 controls and state handling.
- Affects CSV parsing/validation modules and related tests.
- May add lightweight TypeScript-friendly CSV/schema helper dependency for robust file validation.
- No backend/API contract changes; impact remains within frontend behavior and validation workflow.
