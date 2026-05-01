import type { CsvRowValidation } from "src/utils/csv/types";

const ACCOUNT_PATTERN = /^\d{3}-\d{9}-\d{2}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function validateDate(value: string): string | undefined {
  if (!ISO_DATE_PATTERN.test(value)) {
    return "Transaction Date must be in YYYY-MM-DD format";
  }
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return "Transaction Date is not a valid calendar date";
  }
  return undefined;
}

export function validateAccountNumber(value: string): string | undefined {
  if (!ACCOUNT_PATTERN.test(value)) {
    return "Account Number must match 000-000000000-00";
  }
  return undefined;
}

export function validateAccountHolderName(value: string): string | undefined {
  if (!value.trim()) {
    return "Account Holder Name is required";
  }
  return undefined;
}

export function validateAmount(value: string): { amount: number; error?: string } {
  const amount = Number(value);
  if (Number.isNaN(amount) || amount <= 0) {
    return { amount: 0, error: "Amount must be a positive decimal number" };
  }
  return { amount };
}

export function validateRow(input: {
  transactionDate: string;
  accountNumber: string;
  accountHolderName: string;
  amountRaw: string;
}): { amount: number; errors: CsvRowValidation } {
  const errors: CsvRowValidation = {};
  const dateError = validateDate(input.transactionDate);
  if (dateError) errors.transactionDate = dateError;
  const accountError = validateAccountNumber(input.accountNumber);
  if (accountError) errors.accountNumber = accountError;
  const nameError = validateAccountHolderName(input.accountHolderName);
  if (nameError) errors.accountHolderName = nameError;
  const amountResult = validateAmount(input.amountRaw);
  if (amountResult.error) errors.amount = amountResult.error;
  return { amount: amountResult.amount, errors };
}
