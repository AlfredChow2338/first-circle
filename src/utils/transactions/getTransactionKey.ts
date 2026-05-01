import type { TransactionRecord } from "src/components/TransactionTable/types";

export function getTransactionKey(transaction: TransactionRecord): string {
  return [
    transaction.transactionDate,
    transaction.accountNumber,
    transaction.accountHolderName,
    transaction.amount,
  ].join("|");
}
