## Context

The batch transfer modal reads the chosen CSV via `FileReader` in `BatchTransferModal.tsx`. A single `onerror` or rejection currently clears file fields and shows one error. Intermittent failures should be masked by a short, bounded retry loop, then a deterministic rollback.

## Goals / Non-Goals

**Goals:**

- Implement **four read attempts** per file selection with **fixed backoff delays** of **1s**, **2s**, and **4s** after the **first**, **second**, and **third** failures respectively (before attempts 2–4).
- On **final failure**, **rollback**: no `selectedFileName`, no `csvContent`, file input cleared, user sees a **single** final error message that **tells them to upload the CSV again** (clear call to action; use existing `uploadError` / `role="alert"` pattern in the modal).
- Keep retry logic **pure/testable** (injectable `read` function and clock/sleep for tests).

**Non-Goals:**

- Retrying **network** uploads (there is no server upload in this flow).
- Retrying **parse** errors (`parseCsv`) or validation-only failures.
- Infinite retry, jitter, or configurable backoff via UI.

## Decisions

1. **`readFileAsTextWithRetry` utility** (e.g. `src/utils/csv/readFileAsTextWithRetry.ts`)  
   - **Why:** Keeps the modal thin and allows timer-based unit tests without mounting the full dialog.  
   - **Alternative:** Inline loop in the component — rejected for testability and reuse.

2. **Delays with `await new Promise(r => setTimeout(r, ms))`**  
   - **Why:** Matches existing patterns (e.g. mock settle) and needs no new dependency.  
   - **Alternative:** `async-retry` package — rejected to avoid dependency for three constants.

3. **No partial commit during retries**  
   - **Why:** Until a read succeeds, `selectedFileName` / `csvContent` MUST NOT reflect a half-loaded file; optionally show “Retrying…” via existing message or local state.  
   - **Alternative:** Set filename early — rejected; conflicts with rollback spec.

4. **Tests use fake timers** to assert delay sequence and early success short-circuiting.

## Risks / Trade-offs

- **Perceived slowness** on hard failure (up to ~7s wait) → Accept per product request; surface retry feedback if needed.  
- **Double-submit / re-entry** if user picks another file mid-retry → Use **abort flag** or ignore stale resolution when `file`/`input` identity changes (document in implementation).

## Migration Plan

- Ship behind no flag; behavior is user-visible only on failure paths. No data migration.

## Open Questions

- Whether to show **toast vs inline** “retrying” copy (default: minimal inline or message hook if already used for errors).
