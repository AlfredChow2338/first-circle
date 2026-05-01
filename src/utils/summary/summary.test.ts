import { describe, expect, it } from "vitest";

import { summarizeRows } from "./summary";

import type { ParsedCsvRow } from "./types";

describe("summarizeRows", () => {
  it("calculates total, count, and average for valid rows only", () => {
    const rows: ParsedCsvRow[] = [
      {
        rowNumber: 2,
        transactionDate: "2025-02-20",
        accountNumber: "000-123456789-01",
        accountHolderName: "John Doe",
        amountRaw: "100",
        amount: 100,
        errors: {},
      },
      {
        rowNumber: 3,
        transactionDate: "2025-02-21",
        accountNumber: "000-123456789-02",
        accountHolderName: "Jane Doe",
        amountRaw: "200.55",
        amount: 200.55,
        errors: {},
      },
      {
        rowNumber: 4,
        transactionDate: "bad",
        accountNumber: "bad",
        accountHolderName: "",
        amountRaw: "-1",
        amount: 0,
        errors: { transactionDate: "bad" },
      },
    ];

    expect(summarizeRows(rows)).toEqual({
      totalAmount: 300.55,
      paymentCount: 2,
      averagePayment: 150.28,
    });
  });
});
