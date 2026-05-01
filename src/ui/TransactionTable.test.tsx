import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TransactionTable } from "./TransactionTable";

describe("TransactionTable", () => {
  it("renders required columns and status mapping", () => {
    render(
      <TransactionTable
        transactions={[
          {
            transactionDate: "2025-02-20",
            accountNumber: "000-123456789-01",
            accountHolderName: "John Doe",
            amount: 100,
            status: "Pending",
          },
          {
            transactionDate: "2025-02-22",
            accountNumber: "000-333222111-03",
            accountHolderName: "Alex Johnson",
            amount: 50,
            status: "Failed",
            errorMessage: "Insufficient balance",
          },
        ]}
      />,
    );

    expect(screen.getByText("Transaction Date")).toBeInTheDocument();
    expect(screen.getByText("Account Number")).toBeInTheDocument();
    expect(screen.getByText("Account Holder Name")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByLabelText("Failed transaction")).toBeInTheDocument();
  });
});
