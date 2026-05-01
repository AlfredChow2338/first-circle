import { describe, expect, it } from "vitest";

import { createSnapshot, parseSnapshot } from "./snapshot";

import type { TransactionRecord } from "./types";

const sampleTransactions: TransactionRecord[] = [
  {
    transactionDate: "2025-02-20",
    accountNumber: "000-123456789-01",
    accountHolderName: "John Doe",
    amount: 100,
    status: "Pending",
  },
];

describe("snapshot contract", () => {
  it("creates snapshot with required metadata shape", () => {
    const snapshot = createSnapshot(sampleTransactions);
    expect(snapshot.version).toBe(1);
    expect(snapshot.source).toBe("first-circle-interview");
    expect(new Date(snapshot.exportedAt).toString()).not.toBe("Invalid Date");
    expect(snapshot.transactions).toHaveLength(1);
  });

  it("parses valid snapshot json", () => {
    const json = JSON.stringify(createSnapshot(sampleTransactions));
    const parsed = parseSnapshot(json);
    expect(parsed.version).toBe(1);
    expect(parsed.transactions[0]?.accountHolderName).toBe("John Doe");
  });

  it("throws on malformed json", () => {
    expect(() => parseSnapshot("{bad-json")).toThrow("Invalid snapshot JSON.");
  });

  it("throws on unsupported version", () => {
    const invalid = {
      version: 2,
      exportedAt: new Date().toISOString(),
      source: "first-circle-interview",
      transactions: sampleTransactions,
    };
    expect(() => parseSnapshot(JSON.stringify(invalid))).toThrow("Invalid snapshot contract");
  });
});
