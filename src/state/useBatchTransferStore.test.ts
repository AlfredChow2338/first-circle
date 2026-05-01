import { beforeEach, describe, expect, it } from "vitest";

import type { TransactionRecord } from "src/domain/types";
import {
  resetTransactionsDbForTests,
  writePersistEnvelope,
} from "src/storage/transactionsIndexedDb";

import { useBatchTransferStore } from "./useBatchTransferStore";

const baselineTransactions: TransactionRecord[] = [
  {
    transactionDate: "2025-02-20",
    accountNumber: "000-123456789-01",
    accountHolderName: "John Doe",
    amount: 100,
    status: "Pending",
  },
];

describe("useBatchTransferStore snapshot persistence", () => {
  beforeEach(async () => {
    await resetTransactionsDbForTests();
    useBatchTransferStore.setState({
      transactions: baselineTransactions,
      snapshotMessage: null,
      hasHydrated: true,
    });
  });

  it("replaces transactions when importing a valid snapshot", () => {
    const nextTransactions: TransactionRecord[] = [
      {
        transactionDate: "2025-03-01",
        accountNumber: "000-987654321-02",
        accountHolderName: "Jane Smith",
        amount: 250.5,
        status: "Settled",
      },
    ];
    const snapshot = JSON.stringify({
      version: 1,
      exportedAt: new Date().toISOString(),
      source: "first-circle-interview",
      transactions: nextTransactions,
    });

    useBatchTransferStore.getState().importSnapshot(snapshot);
    expect(useBatchTransferStore.getState().transactions).toEqual(nextTransactions);
  });

  it("does not mutate transactions when importing malformed snapshot", () => {
    const before = useBatchTransferStore.getState().transactions;
    expect(() => useBatchTransferStore.getState().importSnapshot("{bad-json")).toThrow(
      "Invalid snapshot JSON.",
    );
    expect(useBatchTransferStore.getState().transactions).toEqual(before);
  });

  it("rehydrates persisted transactions from IndexedDB", async () => {
    const persistedTransactions: TransactionRecord[] = [
      {
        transactionDate: "2025-04-01",
        accountNumber: "000-111222333-03",
        accountHolderName: "Alex Johnson",
        amount: 50,
        status: "Failed",
        errorMessage: "Insufficient balance",
      },
    ];

    useBatchTransferStore.setState({ transactions: baselineTransactions, hasHydrated: false });
    await writePersistEnvelope("batch-transactions-v1", {
      state: { transactions: persistedTransactions },
      version: 0,
    });

    await (useBatchTransferStore as unknown as { persist: { rehydrate: () => Promise<void> } }).persist.rehydrate();
    expect(useBatchTransferStore.getState().transactions).toEqual(persistedTransactions);
    expect(useBatchTransferStore.getState().hasHydrated).toBe(true);
  });
});
