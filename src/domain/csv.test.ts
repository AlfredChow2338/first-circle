import { describe, expect, it } from "vitest";

import { parseCsvText } from "./csv";

describe("parseCsvText", () => {
  it("parses rows with expected header contract", () => {
    const rows = parseCsvText(`Transaction Date,Account Number,Account Holder Name,Amount
2025-02-20,000-123456789-01,John Doe,100.00`);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      transactionDate: "2025-02-20",
      accountNumber: "000-123456789-01",
      accountHolderName: "John Doe",
      amountRaw: "100.00",
      amount: 100,
    });
  });

  it("throws for invalid headers", () => {
    expect(() =>
      parseCsvText(`Date,Account,Name,Amount
2025-02-20,000-123456789-01,John Doe,100.00`),
    ).toThrow("CSV header does not match expected schema");
  });

  it("captures validation errors from sample invalid rows", () => {
    const rows = parseCsvText(`Transaction Date,Account Number,Account Holder Name,Amount
2025-02-20,000-123456789-01,John Doe,100.00
2025/02/21,00012345678901,Jane Smith,250.50
2025-02-30,000-987654321-02,,150.00
invalid-date,000-111222333-03,Alex Johnson,-50.00
2025-03-01,000-123456789-0A,Emily Davis,200.00`);
    const invalidCount = rows.filter((row) => Object.keys(row.errors).length > 0).length;
    expect(rows).toHaveLength(5);
    expect(invalidCount).toBe(4);
  });
});
