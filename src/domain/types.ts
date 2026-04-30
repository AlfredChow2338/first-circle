export type TransactionStatus = "Pending" | "Settled" | "Failed";

export type TransactionRecord = {
  transactionDate: string;
  accountNumber: string;
  accountHolderName: string;
  amount: number;
  status: TransactionStatus;
  errorMessage?: string;
};

export type CsvRowValidation = {
  transactionDate?: string;
  accountNumber?: string;
  accountHolderName?: string;
  amount?: string;
};

export type ParsedCsvRow = {
  rowNumber: number;
  transactionDate: string;
  accountNumber: string;
  accountHolderName: string;
  amountRaw: string;
  amount: number;
  errors: CsvRowValidation;
};
