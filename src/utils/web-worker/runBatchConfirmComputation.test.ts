import { afterEach, describe, expect, it, vi } from "vitest";

import { computeBatchConfirmResult } from "src/store/batchTransfer/utils";
import type { ParsedCsvRow } from "src/utils/csv/types";

import { runBatchConfirmComputation } from "./runBatchConfirmComputation";

import type { BatchConfirmWorkerRequest, BatchConfirmWorkerResponse } from "./workerContracts";

const parsedRows: ParsedCsvRow[] = [
  {
    rowNumber: 2,
    transactionDate: "2025-02-20",
    accountNumber: "000-123456789-01",
    accountHolderName: "John Doe",
    amountRaw: "100.00",
    amount: 100,
    errors: {},
  },
  {
    rowNumber: 3,
    transactionDate: "2025-02-21",
    accountNumber: "000-987654321-02",
    accountHolderName: "Jane Smith",
    amountRaw: "250.50",
    amount: 250.5,
    errors: {},
  },
];

describe("runBatchConfirmComputation", () => {
  const originalWorker = globalThis.Worker;

  afterEach(() => {
    if (originalWorker) {
      globalThis.Worker = originalWorker;
    } else {
      // @ts-expect-error test cleanup for optional global
      delete globalThis.Worker;
    }
  });

  it("falls back to main-thread computation when Worker is unavailable", async () => {
    // @ts-expect-error test setup for unavailable worker environments
    delete globalThis.Worker;
    await expect(runBatchConfirmComputation(parsedRows)).resolves.toEqual(
      computeBatchConfirmResult(parsedRows),
    );
  });

  it("uses worker result when worker succeeds", async () => {
    const expected = computeBatchConfirmResult(parsedRows);
    class MockWorker {
      public onmessage: ((event: MessageEvent<BatchConfirmWorkerResponse>) => void) | null = null;
      public onerror: ((event: ErrorEvent) => void) | null = null;
      public terminate = vi.fn();

      constructor(_: URL, __: WorkerOptions) {}

      public postMessage(message: BatchConfirmWorkerRequest) {
        if (message.type !== "compute") {
          return;
        }
        this.onmessage?.({ data: { type: "success", payload: expected } } as MessageEvent);
      }
    }

    // @ts-expect-error test worker mock
    globalThis.Worker = MockWorker;

    await expect(runBatchConfirmComputation(parsedRows)).resolves.toEqual(expected);
  });

  it("falls back when worker reports an error", async () => {
    class MockWorker {
      public onmessage: ((event: MessageEvent<BatchConfirmWorkerResponse>) => void) | null = null;
      public onerror: ((event: ErrorEvent) => void) | null = null;
      public terminate = vi.fn();

      constructor(_: URL, __: WorkerOptions) {}

      public postMessage(_: BatchConfirmWorkerRequest) {
        this.onerror?.(new ErrorEvent("error"));
      }
    }

    // @ts-expect-error test worker mock
    globalThis.Worker = MockWorker;

    await expect(runBatchConfirmComputation(parsedRows)).resolves.toEqual(
      computeBatchConfirmResult(parsedRows),
    );
  });
});
