import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { TransactionTable } from "./TransactionTable";

describe("TransactionTable", () => {
  it("renders required columns and failed info icon only for failed rows", () => {
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
    expect(screen.getByLabelText("Failed transaction details")).toBeInTheDocument();
    expect(screen.getAllByLabelText("Failed transaction details")).toHaveLength(1);
  });

  it("shows failed reason tooltip on hover, focus, and click", async () => {
    const user = userEvent.setup();

    render(
      <TransactionTable
        transactions={[
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

    const trigger = screen.getByLabelText("Failed transaction details");

    fireEvent.click(trigger);
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Insufficient balance");

    fireEvent.click(trigger);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    await user.hover(trigger);
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Insufficient balance");

    await user.unhover(trigger);
    trigger.focus();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Insufficient balance");
  });
});
