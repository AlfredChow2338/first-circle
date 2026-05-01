import { create } from "zustand";

import { parseCsvText } from "src/domain/csv";
import { summarizeRows } from "src/domain/summary";
import type { ParsedCsvRow, TransactionRecord } from "src/domain/types";

type Step = 1 | 2 | 3;

type BatchTransferState = {
  isOpen: boolean;
  step: Step;
  batchName: string;
  approver: string;
  selectedFileName: string;
  uploadError: string | null;
  csvContent: string;
  parsedRows: ParsedCsvRow[];
  transactions: TransactionRecord[];
  openModal: () => void;
  closeModal: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setBatchName: (value: string) => void;
  setApprover: (value: string) => void;
  setSelectedFileName: (value: string) => void;
  setUploadError: (value: string | null) => void;
  setCsvContent: (value: string) => void;
  parseCsv: () => void;
  confirmBatch: () => void;
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

export const useBatchTransferStore = create<BatchTransferState>((set, get) => ({
  isOpen: false,
  step: 1,
  batchName: "",
  approver: APPROVERS[0],
  selectedFileName: "",
  uploadError: null,
  csvContent: "",
  parsedRows: [],
  transactions: initialTransactions,
  openModal: () => set({ isOpen: true, step: 1 }),
  closeModal: () => set({ isOpen: false }),
  nextStep: () => set((state) => ({ step: Math.min(3, state.step + 1) as Step })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) as Step })),
  setBatchName: (value) => set({ batchName: value }),
  setApprover: (value) => set({ approver: value }),
  setSelectedFileName: (value) => set({ selectedFileName: value }),
  setUploadError: (value) => set({ uploadError: value }),
  setCsvContent: (value) => set({ csvContent: value }),
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
      step: 1,
    }));
  },
}));
