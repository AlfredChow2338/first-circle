import Papa from "papaparse";
import { z } from "zod";

import { validateRow } from "../validation";

import type { ParsedCsvRow } from "./types";
import { TransactionRecord } from "src/components/TransactionTable/types";

const EXPECTED_HEADERS = [
  "Transaction Date",
  "Account Number",
  "Account Holder Name",
  "Amount",
] as const;

const HeaderSchema = z.tuple([
  z.literal(EXPECTED_HEADERS[0]),
  z.literal(EXPECTED_HEADERS[1]),
  z.literal(EXPECTED_HEADERS[2]),
  z.literal(EXPECTED_HEADERS[3]),
]);

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
  const headerValidation = HeaderSchema.safeParse(header);
  if (!headerValidation.success || header.length !== EXPECTED_HEADERS.length) {
    throw new Error("CSV header does not match expected schema");
  }

  return rows.slice(1).map((row, index) => {
    if (row.length !== EXPECTED_HEADERS.length) {
      throw new Error(`CSV row ${index + 2} has invalid column count; expected 4`);
    }
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

export function handleExportTransactions(transactions: TransactionRecord[]) {
  const csvContent = Papa.unparse(
    transactions.map((transaction) => ({
      "Transaction Date": transaction.transactionDate,
      "Account Number": transaction.accountNumber,
      "Account Holder Name": transaction.accountHolderName,
      Amount: transaction.amount,
    })),
  );
  const file = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(file);
  const anchor = document.createElement("a");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  anchor.href = url;
  anchor.download = `transactions-v1-${timestamp}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}
