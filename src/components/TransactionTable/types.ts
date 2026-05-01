export type TransactionStatus = "Pending" | "Settled" | "Failed";

export type TransactionRecord = {
  transactionDate: string;
  accountNumber: string;
  accountHolderName: string;
  amount: number;
  status: TransactionStatus;
  errorMessage?: string;
};
