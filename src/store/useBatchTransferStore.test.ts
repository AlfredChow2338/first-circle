import { beforeEach, describe, expect, it, vi } from "vitest";

import type { TransactionRecord } from "src/components/TransactionTable/types";
import {
  readPersistEnvelope,
  resetTransactionsDbForTests,
  writePersistEnvelope,
} from "src/utils/storage/transactionsIndexedDb";

import { useBatchTransferStore } from "./useBatchTransferStore";

vi.mock("src/utils/web-worker/runBatchConfirmComputation", () => ({
  runBatchConfirmComputation: vi.fn(async () => ({
    transactions: [
      {
        id: "mock-confirm-tx-1",
        transactionDate: "2025-06-01",
        accountNumber: "000-100200300-01",
        accountHolderName: "Pat Lee",
        amount: 10,
        status: "Pending" as const,
      },
    ],
  })),
}));

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
    const rows = useBatchTransferStore.getState().transactions;
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject(persistedTransactions[0]);
    expect(rows[0].id).toBeDefined();
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

    const rows = useBatchTransferStore.getState().transactions;
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject(persistedTransactions[0]);
    expect(rows[0].id).toBeDefined();
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

describe("confirmBatch", () => {
  beforeEach(async () => {
    await resetTransactionsDbForTests();
    useBatchTransferStore.setState({
      isOpen: true,
      step: 3,
      parsedRows: [],
      batchName: "June payout",
      approver: "Alex Approver",
      transactions: [],
      hasHydrated: true,
      csvContent: "",
      selectedFileName: "",
      uploadError: null,
      snapshotMessage: null,
    });
  });

  it("stores batch name and approver on each appended transaction", async () => {
    await useBatchTransferStore.getState().confirmBatch();
    const rows = useBatchTransferStore.getState().transactions;
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      id: "mock-confirm-tx-1",
      batchName: "June payout",
      approver: "Alex Approver",
      transactionDate: "2025-06-01",
    });
  });

  it("settles only the row whose id matches, even when duplicate uploads share the same fields", () => {
    useBatchTransferStore.setState({
      transactions: [
        {
          id: "dup-a",
          transactionDate: "2025-01-01",
          accountNumber: "000-1",
          accountHolderName: "Same",
          amount: 1,
          status: "Pending",
        },
        {
          id: "dup-b",
          transactionDate: "2025-01-01",
          accountNumber: "000-1",
          accountHolderName: "Same",
          amount: 1,
          status: "Pending",
        },
      ],
      hasHydrated: true,
    });

    useBatchTransferStore.getState().settleTransaction("dup-a");
    const [first, second] = useBatchTransferStore.getState().transactions;
    expect(first.status).toBe("Settled");
    expect(second.status).toBe("Pending");
  });
});
