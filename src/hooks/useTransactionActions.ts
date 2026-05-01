import { useState } from "react";

import { useMessage } from "src/components/shared/message/MessageProvider";
import type { TransactionRecord } from "src/components/TransactionTable/types";
import { getTransactionKey, mockSettleTransaction } from "src/utils/transactions";

type UseTransactionActionsOptions = {
  settleTransaction: (transactionKey: string) => void;
};

export function useTransactionActions({ settleTransaction }: UseTransactionActionsOptions) {
  const message = useMessage();
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionRecord | null>(null);
  const [settlingTransactionKeys, setSettlingTransactionKeys] = useState<Set<string>>(new Set());

  function handleViewTransaction(transaction: TransactionRecord) {
    setSelectedTransaction(transaction);
  }

  async function handleSettleTransaction(transaction: TransactionRecord) {
    if (transaction.status !== "Pending") {
      return;
    }

    const transactionKey = getTransactionKey(transaction);
    if (settlingTransactionKeys.has(transactionKey)) {
      return;
    }

    setSettlingTransactionKeys((previous) => new Set(previous).add(transactionKey));
    try {
      await mockSettleTransaction();
      settleTransaction(transactionKey);
      message.success("Transaction settled.");
    } finally {
      setSettlingTransactionKeys((previous) => {
        const next = new Set(previous);
        next.delete(transactionKey);
        return next;
      });
    }
  }

  function handleTransactionDetailModalOpenChange(open: boolean) {
    if (!open) {
      setSelectedTransaction(null);
    }
  }

  return {
    selectedTransaction,
    settlingTransactionKeys,
    handleViewTransaction,
    handleSettleTransaction,
    handleTransactionDetailModalOpenChange,
  };
}
