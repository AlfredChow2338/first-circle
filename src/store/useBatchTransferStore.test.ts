import { beforeEach, describe, expect, it } from "vitest";

import type { TransactionRecord } from "src/components/TransactionTable/types";
import {
  readPersistEnvelope,
  resetTransactionsDbForTests,
  writePersistEnvelope,
} from "src/utils/storage/transactionsIndexedDb";

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

    await (
      useBatchTransferStore as unknown as { persist: { rehydrate: () => Promise<void> } }
    ).persist.rehydrate();
    expect(useBatchTransferStore.getState().transactions).toEqual(persistedTransactions);
    expect(useBatchTransferStore.getState().hasHydrated).toBe(true);
  });

  it("rehydrates persisted transactions while offline", async () => {
    const persistedTransactions: TransactionRecord[] = [
      {
        transactionDate: "2025-04-02",
        accountNumber: "000-444555666-04",
        accountHolderName: "Taylor Chen",
        amount: 125,
        status: "Pending",
      },
    ];

    useBatchTransferStore.setState({ transactions: baselineTransactions, hasHydrated: false });
    await writePersistEnvelope("batch-transactions-v1", {
      state: { transactions: persistedTransactions },
      version: 0,
    });
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: false,
    });

    await (
      useBatchTransferStore as unknown as { persist: { rehydrate: () => Promise<void> } }
    ).persist.rehydrate();

    expect(useBatchTransferStore.getState().transactions).toEqual(persistedTransactions);
    expect(useBatchTransferStore.getState().hasHydrated).toBe(true);
  });

  it("clears local data from memory and IndexedDB", async () => {
    const persistedTransactions: TransactionRecord[] = [
      {
        transactionDate: "2025-04-03",
        accountNumber: "000-777888999-05",
        accountHolderName: "Jordan Lee",
        amount: 10,
        status: "Pending",
      },
    ];
    await writePersistEnvelope("batch-transactions-v1", {
      state: { transactions: persistedTransactions },
      version: 0,
    });
    useBatchTransferStore.setState({ transactions: persistedTransactions, snapshotMessage: null });

    await useBatchTransferStore.getState().clearLocalData();

    expect(useBatchTransferStore.getState().transactions).toEqual([]);
    expect(useBatchTransferStore.getState().snapshotMessage).toBeNull();
    await expect(readPersistEnvelope("batch-transactions-v1")).resolves.toBeNull();
  });
});
