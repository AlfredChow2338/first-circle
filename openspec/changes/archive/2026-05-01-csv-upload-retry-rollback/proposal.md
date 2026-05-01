## Why

Reading a selected CSV in the browser can fail transiently (for example `FileReader` errors or rare runtime hiccups). Today a single failure clears the selection and shows a generic error, which is brittle. The product should **recover automatically** with bounded retries, then **roll back** to a clean upload state so the user can try again. *(Interpreting “more error-prone” as **more resilient to errors**; if you meant deliberately increasing failure rates for testing, say so and we can add a separate test hook.)*

## What Changes

- Wrap CSV file-to-text reading in a **retry policy**: wait **1s**, then **2s**, then **4s** between attempts (three retries after the first failure, i.e. up to **four** read attempts total—or clarify as: retry after delays 1s, 2s, 4s meaning 3 backoff waits; I'll specify **initial attempt + 3 retries** with delays 1s, 2s, 4s before the 2nd, 3rd, and 4th attempts).
- After **all attempts fail**, **rollback**: clear `selectedFileName`, `csvContent`, and any upload error state consistent with “no successful load”; reset the file input when applicable; surface a **final** user-visible error that **tells the user to upload the CSV again** (same surface as existing upload errors, e.g. `uploadError` / alert region).
- Optionally surface **non-blocking** feedback during retries (e.g. message or inline status) so the UI does not look frozen.
- Centralize logic in a **small utility** (or hook) used by the batch transfer modal so behavior is testable.

## Capabilities

### New Capabilities

- `csv-upload-read-resilience`: Bounded exponential backoff retries and rollback semantics for reading an uploaded CSV file as text in the client.

### Modified Capabilities

- _None_ (modal integration is implementation detail; requirements live under the new capability and existing modal specs remain valid.)

## Impact

- `src/components/BatchTransferModal/BatchTransferModal.tsx` (`handleFileChange` / `readFileAsText` path).
- New module under `src/utils/` (or `src/hooks/`) for retry + rollback orchestration.
- Unit tests for retry timing, success on retry, and rollback after final failure (likely `vi.useFakeTimers()`).
- Possible touch to shared messaging if retry status is user-visible.
