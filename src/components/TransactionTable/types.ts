export type TransactionStatus = "Pending" | "Settled" | "Failed";

export type TransactionRecord = {
  /** Unique per row so duplicate uploads / identical fields do not share one identity. */
  id?: string;
  transactionDate: string;
  accountNumber: string;
  accountHolderName: string;
  amount: number;
  status: TransactionStatus;
  errorMessage?: string;
  /** Set when the row is added via batch confirm (survives persist and modal reset). */
  batchName?: string;
  approver?: string;
};
