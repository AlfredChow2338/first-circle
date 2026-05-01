import { describe, expect, it } from "vitest";

import {
  validateAccountHolderName,
  validateAccountNumber,
  validateAmount,
  validateDate,
  validateRow,
} from "./validation";

describe("validation", () => {
  it("validates date format and calendar validity", () => {
    expect(validateDate("2025/02/21")).toBeTruthy();
    expect(validateDate("2025-02-30")).toBeTruthy();
    expect(validateDate("2025-02-21")).toBeUndefined();
  });

  it("validates account number", () => {
    expect(validateAccountNumber("00012345678901")).toBeTruthy();
    expect(validateAccountNumber("000-123456789-0A")).toBeTruthy();
    expect(validateAccountNumber("000-123456789-01")).toBeUndefined();
  });

  it("validates account holder name", () => {
    expect(validateAccountHolderName("")).toBeTruthy();
    expect(validateAccountHolderName(" ")).toBeTruthy();
    expect(validateAccountHolderName("John Doe")).toBeUndefined();
  });

  it("validates positive amount", () => {
    expect(validateAmount("-50.00").error).toBeTruthy();
    expect(validateAmount("abc").error).toBeTruthy();
    expect(validateAmount("120.50")).toEqual({ amount: 120.5 });
  });

  it("returns row-level errors", () => {
    const result = validateRow({
      transactionDate: "invalid-date",
      accountNumber: "000123",
      accountHolderName: "",
      amountRaw: "-1",
    });
    expect(result.errors.transactionDate).toBeTruthy();
    expect(result.errors.accountNumber).toBeTruthy();
    expect(result.errors.accountHolderName).toBeTruthy();
    expect(result.errors.amount).toBeTruthy();
  });
});
