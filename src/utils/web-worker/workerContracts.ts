import type { BatchConfirmComputationResult } from "src/store/batchTransfer/utils";
import type { ParsedCsvRow } from "src/utils/csv/types";

export type BatchConfirmWorkerRequest = {
  type: "compute";
  parsedRows: ParsedCsvRow[];
};

export type BatchConfirmWorkerSuccessResponse = {
  type: "success";
  payload: BatchConfirmComputationResult;
};

export type BatchConfirmWorkerErrorResponse = {
  type: "error";
  message: string;
};

export type BatchConfirmWorkerResponse =
  | BatchConfirmWorkerSuccessResponse
  | BatchConfirmWorkerErrorResponse;
