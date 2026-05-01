import { computeBatchConfirmResult } from "src/store/batchTransfer/utils";
import type { ParsedCsvRow } from "src/utils/csv/types";

import type {
  BatchConfirmWorkerRequest,
  BatchConfirmWorkerResponse,
  BatchConfirmWorkerSuccessResponse,
} from "./workerContracts";

export async function runBatchConfirmComputation(
  parsedRows: ParsedCsvRow[],
): Promise<BatchConfirmWorkerSuccessResponse["payload"]> {
  const fallback = () => computeBatchConfirmResult(parsedRows);

  if (typeof Worker === "undefined") {
    return fallback();
  }

  try {
    const worker = new Worker(new URL("./batchConfirm.worker.ts", import.meta.url), {
      type: "module",
    });

    return await new Promise<BatchConfirmWorkerSuccessResponse["payload"]>((resolve, reject) => {
      const cleanup = () => {
        worker.onmessage = null;
        worker.onerror = null;
        worker.terminate();
      };

      worker.onmessage = (event: MessageEvent<BatchConfirmWorkerResponse>) => {
        cleanup();
        if (event.data?.type === "success") {
          resolve(event.data.payload);
          return;
        }
        reject(new Error(event.data?.message ?? "Worker computation failed."));
      };

      worker.onerror = () => {
        cleanup();
        reject(new Error("Worker runtime error."));
      };

      const request: BatchConfirmWorkerRequest = { type: "compute", parsedRows };
      worker.postMessage(request);
    });
  } catch {
    return fallback();
  }
}
