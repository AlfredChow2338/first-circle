import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";
import { APPROVERS, useBatchTransferStore } from "./state/useBatchTransferStore";

beforeEach(() => {
  useBatchTransferStore.setState({
    isOpen: false,
    step: 1,
    batchName: "",
    approver: APPROVERS[0],
    csvContent: "",
    parsedRows: [],
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

describe("App flow", () => {
  it("opens modal and preserves state across steps", () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole("button", { name: "Batch Transfer" })[0]);
    expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Batch Transfer Name"), { target: { value: "Payroll Batch" } });
    fireEvent.change(screen.getByLabelText("CSV Content"), {
      target: {
        value:
          "Transaction Date,Account Number,Account Holder Name,Amount\n2025-02-20,000-123456789-01,John Doe,100.00",
      },
    });

    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Back"));

    expect(screen.getByLabelText("Batch Transfer Name")).toHaveValue("Payroll Batch");
    expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();
  });

  it("appends transactions when confirmed", () => {
    render(<App />);
    const initial = useBatchTransferStore.getState().transactions.length;
    fireEvent.click(screen.getAllByRole("button", { name: "Batch Transfer" })[0]);
    fireEvent.change(screen.getByLabelText("CSV Content"), {
      target: {
        value:
          "Transaction Date,Account Number,Account Holder Name,Amount\n2025-02-20,000-123456789-01,John Doe,100.00",
      },
    });
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Confirm"));
    expect(useBatchTransferStore.getState().transactions.length).toBeGreaterThan(initial);
  });
});
