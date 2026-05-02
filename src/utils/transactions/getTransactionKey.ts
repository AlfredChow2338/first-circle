import type { TransactionRecord } from "src/components/TransactionTable/types";

export function getTransactionKey(transaction: TransactionRecord): string {
  if (transaction.id) {
    return transaction.id;
  }
  return [
    transaction.transactionDate,
    transaction.accountNumber,
    transaction.accountHolderName,
    transaction.amount,
  ].join("|");
}
