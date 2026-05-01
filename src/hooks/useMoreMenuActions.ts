import { useState } from "react";

import { useMessage } from "src/components/shared/Message/MessageProvider";
import type { TransactionRecord } from "src/components/TransactionTable/types";
import { handleExportTransactions } from "src/utils/csv";

type UseMoreMenuActionsOptions = {
  transactions: TransactionRecord[];
  clearLocalData: () => Promise<void>;
};

export function useMoreMenuActions({ transactions, clearLocalData }: UseMoreMenuActionsOptions) {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const message = useMessage();

  function toggleMoreMenu() {
    setIsMoreMenuOpen((open) => !open);
  }

  function handleExportFromMenu() {
    handleExportTransactions(transactions);
    setIsMoreMenuOpen(false);
    message.success("Exported transactions CSV.");
  }

  async function handleClearLocalData() {
    const confirmed = window.confirm("Clear all locally saved transaction data?");
    if (!confirmed) {
      return;
    }
    await clearLocalData();
    message.success("Cleared local transaction data.");
    setIsMoreMenuOpen(false);
  }

  return {
    isMoreMenuOpen,
    toggleMoreMenu,
    handleExportFromMenu,
    handleClearLocalData,
  };
}
