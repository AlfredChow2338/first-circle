## Context

Step 1 in the batch transfer modal currently accepts CSV content through a textarea, which creates ambiguity around file provenance and permits malformed input before users discover errors later in the flow. The requested behavior is a proper file upload interaction constrained to `.csv` with strict format validation and explicit error messaging.

The change spans UI input controls, file parsing flow, and validation feedback logic. Existing parsing and row validation functions can be reused, but file-level guards and upload UX need to be introduced.

## Goals / Non-Goals

**Goals:**
- Replace textarea-based CSV entry with a file upload button/input in Step 1.
- Restrict selectable files to `.csv` and reject non-CSV uploads with clear errors.
- Apply strict validation for CSV structure (required headers, row width, parse errors) before moving to Step 2.
- Surface actionable validation messages in Step 1 without losing prior user inputs.
- Keep implementation TypeScript-friendly and testable, optionally leveraging modern schema helpers.

**Non-Goals:**
- Supporting additional file formats (xlsx, txt, tsv).
- Building backend-side CSV upload endpoints.
- Implementing drag-and-drop upload UX in this iteration.

## Decisions

1. **Use native file input with `accept=".csv,text/csv"` and client-side type checks.**
   - Rationale: Provides immediate browser-level file filtering and predictable TS typings for file handling.
   - Alternative: Keep textarea plus paste validation; rejected because it does not satisfy file-selection requirement.

2. **Read file content via `FileReader` and pass normalized text into existing parse/validate pipeline.**
   - Rationale: Reuses current domain parser behavior and minimizes duplication.
   - Alternative: Replace parser entirely; rejected as unnecessary scope increase.

3. **Add strict schema validation gates before step advance.**
   - Rationale: Users should not enter review step when file-level format is invalid.
   - Alternative: Defer all errors to Step 2; rejected due to poor UX and ambiguous failure state.

4. **Use explicit upload error state in modal store/component (`uploadError`) with deterministic messages.**
   - Rationale: Keeps validation feedback clear and testable.
   - Alternative: Generic toast-only errors; rejected because persistent inline context is needed near input.

5. **Use TypeScript-friendly validation helpers (e.g., `zod` for header/schema assertion) where it reduces ad-hoc checks.**
   - Rationale: Improves readability and maintainability of strict format constraints.
   - Alternative: manual chained checks only; acceptable but harder to evolve safely.

## Risks / Trade-offs

- [MIME type inconsistency across browsers] -> Mitigation: validate extension and parsed header content, not MIME only.
- [Large file read latency] -> Mitigation: keep current scope targeted to interview-sized files and show clear loading/error states.
- [Overly strict validation blocks legitimate files] -> Mitigation: document exact accepted schema and provide specific remediation in error text.
- [State loss on failed upload] -> Mitigation: preserve batch name/approver and only reset parsed rows when necessary.
