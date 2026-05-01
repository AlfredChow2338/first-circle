/// <reference lib="webworker" />

import { computeBatchConfirmResult } from "src/store/batchTransfer/utils";

import type { BatchConfirmWorkerRequest, BatchConfirmWorkerResponse } from "./workerContracts";

self.onmessage = (event: MessageEvent<BatchConfirmWorkerRequest>) => {
  const request = event.data;
  if (!request || request.type !== "compute") {
    return;
  }

  try {
    const payload = computeBatchConfirmResult(request.parsedRows);
    const response: BatchConfirmWorkerResponse = { type: "success", payload };
    self.postMessage(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Worker computation failed.";
    const response: BatchConfirmWorkerResponse = { type: "error", message };
    self.postMessage(response);
  }
};

export {};
