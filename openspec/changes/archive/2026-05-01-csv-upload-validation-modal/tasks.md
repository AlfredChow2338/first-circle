## 1. File upload UI and state wiring

- [x] 1.1 Replace Step 1 textarea with a file input/button flow limited to `.csv` selection (`accept=".csv,text/csv"`).
- [x] 1.2 Add upload-related modal state for selected file metadata and `uploadError` message handling.
- [x] 1.3 Preserve batch name, approver, and selected valid file state when navigating between steps.

## 2. Strict CSV file validation pipeline

- [x] 2.1 Implement file-level validation for extension/type checks and reject non-CSV files with explicit errors.
- [x] 2.2 Implement strict schema validation for required headers and consistent column count before row parsing.
- [x] 2.3 Integrate `FileReader` flow to parse uploaded file text and block Step 2 navigation when validation fails.
- [x] 2.4 Add TypeScript-friendly schema helper usage (e.g., `zod`) where it improves strict validation clarity.

## 3. Error handling and UX feedback

- [x] 3.1 Display inline error messages in Step 1 for invalid file type, malformed CSV structure, and parse failures.
- [x] 3.2 Clear prior errors when user selects a new file and keep error copy actionable for remediation.
- [x] 3.3 Ensure Next button behavior reflects validation gate (no step advance on upload validation failure).

## 4. Tests and verification

- [x] 4.1 Add/update component tests for file input behavior, `.csv` restriction, and Step 1 error messaging.
- [x] 4.2 Add/update parser/validation tests covering malformed headers, uneven columns, and valid upload success path.
- [x] 4.3 Run lint/test/build and verify no regressions in review/summary steps after upload flow change.

## 5. Documentation and migration notes

- [x] 5.1 Update README or developer notes to document CSV upload expectations and strict format requirements.
- [x] 5.2 Add implementation note describing chosen library/utilities and rationale for strict validation approach.
