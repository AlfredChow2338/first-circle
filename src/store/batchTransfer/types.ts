import type { TransactionRecord } from "src/components/TransactionTable/types";
import type { ParsedCsvRow } from "src/utils/csv/types";

export type Step = 1 | 2 | 3;

export type BatchTransferState = {
  isOpen: boolean;
  step: Step;
  batchName: string;
  approver: string;
  selectedFileName: string;
  uploadError: string | null;
  snapshotMessage: string | null;
  csvContent: string;
  parsedRows: ParsedCsvRow[];
  transactions: TransactionRecord[];
  hasHydrated: boolean;
  openModal: () => void;
  closeModal: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setBatchName: (value: string) => void;
  setApprover: (value: string) => void;
  setSelectedFileName: (value: string) => void;
  setUploadError: (value: string | null) => void;
  setSnapshotMessage: (value: string | null) => void;
  setCsvContent: (value: string) => void;
  setHasHydrated: (value: boolean) => void;
  parseCsv: () => void;
  confirmBatch: () => void;
  settleTransaction: (transactionKey: string) => void;
  clearLocalData: () => Promise<void>;
};
