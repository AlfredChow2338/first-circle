import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { TransactionRecord } from "src/components/TransactionTable/types";
import { APPROVERS, initialModalState, PERSIST_KEY } from "src/store/batchTransfer/constants";
import type { BatchTransferState, Step } from "src/store/batchTransfer/types";
import { parseCsvText } from "src/utils/csv/csv";
import { createIndexedDbPersistStorage } from "src/utils/storage/createIndexedDbPersistStorage";
import { createTransactionRowId, getTransactionKey } from "src/utils/transactions";
import { runBatchConfirmComputation } from "src/utils/web-worker/runBatchConfirmComputation";

function ensureTransactionIds(transactions: TransactionRecord[]): TransactionRecord[] {
  return transactions.map((row) => (row.id ? row : { ...row, id: createTransactionRowId() }));
}

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
      confirmBatch: async () => {
        const { parsedRows, batchName, approver } = get();
        const { transactions: newTransactions } = await runBatchConfirmComputation(parsedRows);
        const tagged = newTransactions.map((transaction) => ({
          ...transaction,
          batchName,
          approver,
        }));
        set((state) => ({
          transactions: [...state.transactions, ...tagged],
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
      merge: (persistedState, currentState) => {
        const partial = (persistedState ?? {}) as Partial<BatchTransferState>;
        return {
          ...currentState,
          ...partial,
          transactions: ensureTransactionIds(
            partial.transactions !== undefined ? partial.transactions : currentState.transactions,
          ),
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export { APPROVERS };
