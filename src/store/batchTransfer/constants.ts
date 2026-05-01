import type { ParsedCsvRow } from "src/utils/csv/types";

import type { Step } from "./types";

export const APPROVERS = ["Olivia Lee", "Daniel Wong", "Emma Chen", "Noah Lin"];

export const PERSIST_KEY = "batch-transactions-v1";

export const initialModalState = {
  step: 1 as Step,
  batchName: "",
  approver: APPROVERS[0],
  selectedFileName: "",
  uploadError: null as string | null,
  snapshotMessage: null as string | null,
  csvContent: "",
  parsedRows: [] as ParsedCsvRow[],
};
