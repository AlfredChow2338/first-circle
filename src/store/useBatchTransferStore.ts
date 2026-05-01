import { create } from "zustand";
import { persist } from "zustand/middleware";

import { APPROVERS, initialModalState, PERSIST_KEY } from "src/store/batchTransfer/constants";
import type { BatchTransferState, Step } from "src/store/batchTransfer/types";
import { mapParsedRowsToTransactions } from "src/store/batchTransfer/utils";
import { parseCsvText } from "src/utils/csv/csv";
import { createIndexedDbPersistStorage } from "src/utils/storage/createIndexedDbPersistStorage";
import { summarizeRows } from "src/utils/summary";
import { getTransactionKey } from "src/utils/transactions";

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
      transactions: [],
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
      parseCsv: () => {
        const parsedRows = parseCsvText(get().csvContent);
        set({ parsedRows, uploadError: null });
      },
      confirmBatch: () => {
        const { parsedRows } = get();
        const newTransactions = mapParsedRowsToTransactions(parsedRows);
        summarizeRows(parsedRows);
        set((state) => ({
          transactions: [...state.transactions, ...newTransactions],
          isOpen: false,
          ...initialModalState,
        }));
      },
      settleTransaction: (transactionKey) => {
        set((state) => ({
          transactions: state.transactions.map((transaction) => {
            if (getTransactionKey(transaction) !== transactionKey || transaction.status !== "Pending") {
              return transaction;
            }

            return {
              ...transaction,
              status: "Settled",
              errorMessage: undefined,
            };
          }),
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
      name: PERSIST_KEY,
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

export { APPROVERS };
