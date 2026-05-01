## Context

Batch confirmation in `useBatchTransferStore` currently performs row mapping and summary calculation synchronously on the main thread. With very large CSV payloads, this can block UI rendering and interaction, causing visible lag during confirm operations.

## Goals / Non-Goals

**Goals:**
- Move heavy confirmation computation (row mapping + summary calculation inputs) off the main thread using a Web Worker.
- Preserve existing confirmation outcomes: appended transactions, modal reset behavior, and summary consistency.
- Handle worker success and failure paths safely without leaving store state inconsistent.
- Keep the public store API stable for current UI consumers.

**Non-Goals:**
- Redesigning transaction domain models.
- Parallel chunk processing or worker pools.
- Introducing backend/offline sync changes.

## Decisions

- **Decision: Introduce a dedicated worker module for confirm computation payloads.**  
  The worker receives parsed rows and returns computed transactions plus summary-derived outputs needed by current flow.  
  *Alternative considered:* incremental `setTimeout` chunking on main thread, rejected due to complexity and weaker isolation.

- **Decision: Keep store action async-aware while preserving call semantics.**  
  `confirmBatch` will await worker completion before committing state updates.  
  *Alternative considered:* optimistic immediate state updates, rejected because compute result is authoritative.

- **Decision: Add a fallback/error strategy for worker failures.**  
  If worker initialization or execution fails, use a deterministic main-thread fallback path so confirmation remains functional.  
  *Alternative considered:* hard failure on worker errors, rejected for poor resilience.

- **Decision: Isolate pure compute helpers for worker reuse.**  
  Shared pure transformation logic should be colocated so both worker and fallback paths stay consistent and testable.

## Risks / Trade-offs

- **[Risk] Worker serialization overhead for huge payloads** -> **Mitigation:** transfer minimal required fields and benchmark before/after.
- **[Risk] Divergence between worker and fallback logic** -> **Mitigation:** centralize pure helpers and reuse in both paths.
- **[Risk] Hard-to-debug worker errors in tests** -> **Mitigation:** abstract worker invocation behind a small adapter and unit test success/failure branches.

## Migration Plan

1. Add worker compute module and typed request/response contracts.
2. Refactor confirm computation helpers into worker-compatible pure functions.
3. Update store `confirmBatch` flow to use worker and fallback on failure.
4. Add/adjust tests for worker success and fallback behavior with large datasets.
5. Run lint and targeted test suites.

Rollback path: switch `confirmBatch` back to synchronous helper invocation and remove worker adapter usage.

## Open Questions

- Should the UI expose an explicit “processing” indicator while worker computation is running for very large payloads?
