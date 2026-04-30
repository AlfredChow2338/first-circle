import Papa from "papaparse";
import { validateRow } from "./validation";
import type { ParsedCsvRow } from "./types";

const EXPECTED_HEADERS = [
  "Transaction Date",
  "Account Number",
  "Account Holder Name",
  "Amount",
] as const;

export function parseCsvText(csvText: string): ParsedCsvRow[] {
  const parsed = Papa.parse<string[]>(csvText.trim(), {
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    throw new Error(`CSV parse error: ${parsed.errors[0]?.message ?? "Unknown error"}`);
  }

  const rows = parsed.data;
  if (rows.length < 2) {
    return [];
  }

  const header = rows[0].map((cell) => cell.trim());
  const headerMatches = EXPECTED_HEADERS.every((expected, index) => header[index] === expected);
  if (!headerMatches) {
    throw new Error("CSV header does not match expected schema");
  }

  return rows.slice(1).map((row, index) => {
    const transactionDate = (row[0] ?? "").trim();
    const accountNumber = (row[1] ?? "").trim();
    const accountHolderName = (row[2] ?? "").trim();
    const amountRaw = (row[3] ?? "").trim();
    const { amount, errors } = validateRow({
      transactionDate,
      accountNumber,
      accountHolderName,
      amountRaw,
    });
    return {
      rowNumber: index + 2,
      transactionDate,
      accountNumber,
      accountHolderName,
      amountRaw,
      amount,
      errors,
    };
  });
}
