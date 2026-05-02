import { afterEach, describe, expect, it, vi } from "vitest";

import type { ParsedCsvRow } from "src/utils/csv/types";

import { mapParsedRowsToTransactions } from "./utils";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("mapParsedRowsToTransactions", () => {
  it("assigns a unique id per row so duplicate CSV data does not share one key", () => {
    const row: ParsedCsvRow = {
      rowNumber: 2,
      transactionDate: "2025-01-01",
      accountNumber: "000-1",
      accountHolderName: "A",
      amountRaw: "1",
      amount: 1,
      errors: {},
    };
    vi.spyOn(crypto, "randomUUID")
      .mockReturnValueOnce("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa")
      .mockReturnValueOnce("bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb");

    const [first, second] = mapParsedRowsToTransactions([row, row]);
    expect(first.id).toBe("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
    expect(second.id).toBe("bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb");
  });
});
