## Why

Batch confirmation currently performs row mapping and summary computation on the main thread, which can cause UI lag when CSV payloads are large. Offloading heavy processing to a Web Worker keeps the interface responsive during compute-intensive operations.

## What Changes

- Move confirm-batch data transformation and summary computation to a Web Worker.
- Keep existing batch confirmation behavior and output shape compatible with current store/UI consumers.
- Add worker lifecycle/error handling for successful compute, worker failure, and fallback behavior.
- Ensure store updates are applied only after worker completion.

## Capabilities

### New Capabilities
- `batch-worker-computation`: Background processing of batch confirmation computation via Web Worker.

### Modified Capabilities
- `batch-summary-and-persistence`: Update batch confirmation computation flow to run in worker context while preserving summary and persisted transaction outcomes.

## Impact

- Affected state flow: `src/store/useBatchTransferStore.ts` confirmation path.
- Affected computation utilities: `src/store/batchTransfer/utils.ts` and any summary/mapping helpers used during confirm.
- Affected build/runtime: worker module wiring in Vite/TypeScript.
- Affected tests: store and integration tests for confirm behavior, worker success, and worker error/fallback handling.
