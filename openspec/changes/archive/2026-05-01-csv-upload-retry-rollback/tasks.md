## 1. Retry utility

- [x] 1.1 Add `readFileAsTextWithRetry` (or equivalent) under `src/utils/csv/` with backoff delays 1s, 2s, 4s and a maximum of four read attempts per selection.
- [x] 1.2 Support injectable read/sleep for unit tests (default to `FileReader`-based read and `setTimeout`).

## 2. Modal integration

- [x] 2.1 Replace direct `readFileAsText` usage in `BatchTransferModal` with the retry helper for valid CSV selections.
- [x] 2.2 On terminal failure, clear `selectedFileName`, `csvContent`, reset the file input value, and set `uploadError` to a message that **tells the user to upload the CSV again** (visible in the existing error region).
- [x] 2.3 Optionally show brief user feedback while retries are in progress (inline or message provider), without committing partial CSV content.

## 3. Tests and verification

- [x] 3.1 Add unit tests for success on first try, success after one or more failures, and rollback after four failures (use fake timers).
- [x] 3.2 Update or add integration-style tests if existing upload tests assume single-attempt behavior.
- [x] 3.3 Run lint and targeted tests; fix regressions.
