import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TransactionTable } from "./TransactionTable";

describe("TransactionTable", () => {
  it("renders required columns and failed info icon only for failed rows", () => {
    render(
      <TransactionTable
        onViewTransaction={() => undefined}
        onSettleTransaction={() => undefined}
        settlingTransactionKeys={new Set()}
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
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByLabelText("Failed transaction details")).toBeInTheDocument();
    expect(screen.getAllByLabelText("Failed transaction details")).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "View" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Settle" })).toHaveLength(1);
  });

  it("shows failed reason tooltip on hover, focus, and click", async () => {
    const user = userEvent.setup();

    render(
      <TransactionTable
        onViewTransaction={() => undefined}
        onSettleTransaction={() => undefined}
        settlingTransactionKeys={new Set()}
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

  it("invokes view and settle handlers from actions column", async () => {
    const user = userEvent.setup();
    const onViewTransaction = vi.fn();
    const onSettleTransaction = vi.fn();

    render(
      <TransactionTable
        onViewTransaction={onViewTransaction}
        onSettleTransaction={onSettleTransaction}
        settlingTransactionKeys={new Set()}
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
            status: "Settled",
          },
        ]}
      />,
    );

    const [firstViewButton] = screen.getAllByRole("button", { name: "View" });
    await user.click(firstViewButton);
    expect(onViewTransaction).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Settle" }));
    expect(onSettleTransaction).toHaveBeenCalledTimes(1);
    expect(screen.getAllByRole("button", { name: "View" })).toHaveLength(2);
  });

  it("paginates transactions when more than 10 rows exist", () => {
    render(
      <TransactionTable
        onViewTransaction={() => undefined}
        onSettleTransaction={() => undefined}
        settlingTransactionKeys={new Set()}
        transactions={Array.from({ length: 12 }, (_, index) => ({
          transactionDate: `2025-03-${String(index + 1).padStart(2, "0")}`,
          accountNumber: `000-000000000-${String(index + 1).padStart(2, "0")}`,
          accountHolderName: `User ${index + 1}`,
          amount: index + 1,
          status: "Pending" as const,
        }))}
      />,
    );

    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.getByText("User 10")).toBeInTheDocument();
    expect(screen.queryByText("User 11")).not.toBeInTheDocument();
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
  });
});
