import type { ParsedCsvRow } from "src/utils/csv/types";

export type Summary = {
  totalAmount: number;
  paymentCount: number;
  averagePayment: number;
};

function roundTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

export function summarizeRows(rows: ParsedCsvRow[]): Summary {
  const validRows = rows.filter((row) => Object.keys(row.errors).length === 0);
  const paymentCount = validRows.length;
  const totalAmount = roundTwo(validRows.reduce((sum, row) => sum + row.amount, 0));
  const averagePayment = paymentCount > 0 ? roundTwo(totalAmount / paymentCount) : 0;
  return { totalAmount, paymentCount, averagePayment };
}
