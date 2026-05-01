import type { TransactionRecord } from "src/components/TransactionTable/types";
import type { ParsedCsvRow } from "src/utils/csv/types";
import { summarizeRows } from "src/utils/summary";
import type { Summary } from "src/utils/summary/summary";

export type BatchConfirmComputationResult = {
  transactions: TransactionRecord[];
  summary: Summary;
};

export function mapParsedRowsToTransactions(parsedRows: ParsedCsvRow[]): TransactionRecord[] {
  return parsedRows.map((row) => {
    const hasErrors = Object.keys(row.errors).length > 0;
    return {
      transactionDate: row.transactionDate,
      accountNumber: row.accountNumber,
      accountHolderName: row.accountHolderName,
      amount: row.amount,
      status: hasErrors ? "Failed" : "Pending",
      errorMessage: hasErrors ? Object.values(row.errors).join(", ") : undefined,
    };
  });
}

export function computeBatchConfirmResult(parsedRows: ParsedCsvRow[]): BatchConfirmComputationResult {
  return {
    transactions: mapParsedRowsToTransactions(parsedRows),
    summary: summarizeRows(parsedRows),
  };
}
