import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { resetTransactionsDbForTests } from "src/utils/storage/transactionsIndexedDb";
import * as transactionUtils from "src/utils/transactions";

import App from "./App";
import { APPROVERS, useBatchTransferStore } from "./store/useBatchTransferStore";

vi.mock("src/utils/transactions", async () => {
  const actual =
    await vi.importActual<typeof import("src/utils/transactions")>("src/utils/transactions");
  return {
    ...actual,
    mockSettleTransaction: vi.fn(() => Promise.resolve()),
  };
});

beforeEach(async () => {
  await resetTransactionsDbForTests();
  vi.restoreAllMocks();
  vi.mocked(transactionUtils.mockSettleTransaction).mockResolvedValue();

  useBatchTransferStore.setState({
    isOpen: false,
    step: 1,
    batchName: "",
    approver: APPROVERS[0],
    selectedFileName: "",
    uploadError: null,
    snapshotMessage: null,
    csvContent: "",
    parsedRows: [],
    hasHydrated: true,
    transactions: [
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
    ],
  });
});

describe("App transaction actions", () => {
  it("renders paginated transaction rows and navigates to next page", () => {
    useBatchTransferStore.setState({
      transactions: Array.from({ length: 12 }, (_, index) => ({
        transactionDate: `2025-03-${String(index + 1).padStart(2, "0")}`,
        accountNumber: `000-000000000-${String(index + 1).padStart(2, "0")}`,
        accountHolderName: `User ${index + 1}`,
        amount: index + 1,
        status: "Pending",
      })),
    });
    render(<App />);

    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.getByText("User 10")).toBeInTheDocument();
    expect(screen.queryByText("User 11")).not.toBeInTheDocument();
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));

    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(screen.getByText("User 11")).toBeInTheDocument();
    expect(screen.getByText("User 12")).toBeInTheDocument();
    expect(screen.queryByText("User 1")).not.toBeInTheDocument();
  });

  it("shows status-based action combinations in Actions column", () => {
    render(<App />);

    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "View" })).toHaveLength(3);
    expect(screen.getAllByRole("button", { name: "Settle" })).toHaveLength(1);
  });

  it("opens transaction details modal when clicking View", () => {
    render(<App />);

    const failedRow = screen.getByText("000-333222111-03").closest("tr");
    expect(failedRow).not.toBeNull();
    fireEvent.click(within(failedRow as HTMLTableRowElement).getByRole("button", { name: "View" }));

    const dialog = screen.getByRole("dialog", { name: "Transaction Details" });
    expect(within(dialog).getByText("Alex Johnson")).toBeInTheDocument();
    expect(within(dialog).getByText("Insufficient balance")).toBeInTheDocument();
  });

  it("settles pending transaction after mock api resolves", async () => {
    let resolveSettle: (() => void) | null = null;
    vi.mocked(transactionUtils.mockSettleTransaction).mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveSettle = resolve;
        }),
    );

    render(<App />);

    const pendingRow = screen.getByText("000-123456789-01").closest("tr");
    expect(pendingRow).not.toBeNull();
    const settleButton = within(pendingRow as HTMLTableRowElement).getByRole("button", {
      name: "Settle",
    });

    fireEvent.click(settleButton);
    expect(settleButton).toBeDisabled();
    expect(settleButton).toHaveTextContent("Settling...");

    if (!resolveSettle) {
      throw new Error("Expected settle resolver to be initialized.");
    }
    (resolveSettle as () => void)();

    await waitFor(() => {
      expect(
        within(pendingRow as HTMLTableRowElement).queryByRole("button", { name: "Settle" }),
      ).not.toBeInTheDocument();
    });
    expect(within(pendingRow as HTMLTableRowElement).getByText("Settled")).toBeInTheDocument();
  });
});
