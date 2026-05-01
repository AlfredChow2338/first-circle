## 1. Worker Compute Infrastructure

- [x] 1.1 Define typed worker request/response contracts for batch confirm computation.
- [x] 1.2 Add a dedicated Web Worker module to process parsed rows into confirmation transaction outputs.
- [x] 1.3 Extract/refactor pure computation helpers so worker and fallback paths share deterministic logic.

## 2. Store Integration and Fallback

- [x] 2.1 Update `confirmBatch` flow in `useBatchTransferStore` to invoke worker computation asynchronously.
- [x] 2.2 Commit store updates only after worker (or fallback) returns computed results.
- [x] 2.3 Implement worker error handling with deterministic main-thread fallback behavior.

## 3. Validation and Regression Safety

- [x] 3.1 Add/adjust unit tests for worker success path and fallback path equivalence.
- [x] 3.2 Add/adjust integration tests to confirm persisted/rendered outcomes remain unchanged after workerization.
- [x] 3.3 Verify large input confirmation does not regress UI responsiveness expectations.
- [x] 3.4 Run lint and targeted tests, then resolve regressions.
