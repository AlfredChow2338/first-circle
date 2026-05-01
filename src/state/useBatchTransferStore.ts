import { create } from "zustand";
import { persist } from "zustand/middleware";

import { parseCsvText } from "src/utils/csv/csv";
import { createSnapshot, parseSnapshot } from "src/domain/snapshot";
import { summarizeRows } from "src/utils/summary";
import type { ParsedCsvRow } from "src/utils/csv/types";
import type { TransactionRecord } from "src/ui/TransactionTable/types";
import { createIndexedDbPersistStorage } from "src/storage/createIndexedDbPersistStorage";

type Step = 1 | 2 | 3;

type BatchTransferState = {
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
  exportSnapshot: () => string;
  importSnapshot: (jsonText: string) => void;
  parseCsv: () => void;
  confirmBatch: () => void;
  clearLocalData: () => Promise<void>;
};

const initialTransactions: TransactionRecord[] = [
  {
    transactionDate: "2025-02-20",
    accountNumber: "000-123456789-01",
    accountHolderName: "John Doe",
    amount: 100,
    status: "Pending",
  },
  {
    transactionDate: "2025-02-21",
    accountNumber: "000-987654321-02",
    accountHolderName: "Jane Smith",
    amount: 250.5,
    status: "Settled",
  },
  {
    transactionDate: "2025-02-22",
    accountNumber: "000-333222111-03",
    accountHolderName: "Alex Johnson",
    amount: 50,
    status: "Failed",
    errorMessage: "Insufficient balance",
  },
];

export const APPROVERS = ["Olivia Lee", "Daniel Wong", "Emma Chen", "Noah Lin"];

const initialModalState = {
  step: 1 as Step,
  batchName: "",
  approver: APPROVERS[0],
  selectedFileName: "",
  uploadError: null as string | null,
  snapshotMessage: null as string | null,
  csvContent: "",
  parsedRows: [] as ParsedCsvRow[],
};

export const useBatchTransferStore = create<BatchTransferState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      step: 1,
      batchName: "",
      approver: APPROVERS[0],
      selectedFileName: "",
      uploadError: null,
      snapshotMessage: null,
      csvContent: "",
      parsedRows: [],
      transactions: initialTransactions,
      hasHydrated: false,
      openModal: () => set({ isOpen: true, step: 1 }),
      closeModal: () =>
        set({
          isOpen: false,
          ...initialModalState,
        }),
      nextStep: () => set((state) => ({ step: Math.min(3, state.step + 1) as Step })),
      prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) as Step })),
      setBatchName: (value) => set({ batchName: value }),
      setApprover: (value) => set({ approver: value }),
      setSelectedFileName: (value) => set({ selectedFileName: value }),
      setUploadError: (value) => set({ uploadError: value }),
      setSnapshotMessage: (value) => set({ snapshotMessage: value }),
      setCsvContent: (value) => set({ csvContent: value }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
      exportSnapshot: () => JSON.stringify(createSnapshot(get().transactions), null, 2),
      importSnapshot: (jsonText) => {
        const snapshot = parseSnapshot(jsonText);
        set({
          transactions: snapshot.transactions,
        });
      },
      parseCsv: () => {
        const parsedRows = parseCsvText(get().csvContent);
        set({ parsedRows, uploadError: null });
      },
      confirmBatch: () => {
        const { parsedRows } = get();
        const newTransactions = parsedRows.map((row) => {
          const hasErrors = Object.keys(row.errors).length > 0;
          return {
            transactionDate: row.transactionDate,
            accountNumber: row.accountNumber,
            accountHolderName: row.accountHolderName,
            amount: row.amount,
            status: hasErrors ? "Failed" : "Pending",
            errorMessage: hasErrors ? Object.values(row.errors).join(", ") : undefined,
          } as TransactionRecord;
        });
        summarizeRows(parsedRows);
        set((state) => ({
          transactions: [...state.transactions, ...newTransactions],
          isOpen: false,
          ...initialModalState,
        }));
      },
      clearLocalData: async () => {
        set({
          transactions: [],
        });
        await (
          useBatchTransferStore as unknown as {
            persist: { clearStorage: () => Promise<void> };
          }
        ).persist.clearStorage();
      },
    }),
    {
      name: "batch-transactions-v1",
      storage: createIndexedDbPersistStorage(),
      partialize: (state) => ({
        transactions: state.transactions,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
