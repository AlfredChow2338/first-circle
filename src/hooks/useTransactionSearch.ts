import { useEffect, useRef, useState } from "react";

import type { TransactionRecord } from "src/components/TransactionTable/types";

const THROTTLE_MS = 800;

function matchesTransaction(transaction: TransactionRecord, query: string): boolean {
  const accountNumber = transaction.accountNumber.toLowerCase();
  const accountHolderName = transaction.accountHolderName.toLowerCase();
  return accountNumber.includes(query) || accountHolderName.includes(query);
}

export function useTransactionSearch(transactions: TransactionRecord[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [throttledQuery, setThrottledQuery] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRunRef = useRef(0);

  useEffect(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const now = Date.now();
    const elapsed = now - lastRunRef.current;

    if (elapsed >= THROTTLE_MS) {
      setThrottledQuery(normalizedQuery);
      lastRunRef.current = now;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    const remainingMs = THROTTLE_MS - elapsed;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setThrottledQuery(normalizedQuery);
      lastRunRef.current = Date.now();
      timeoutRef.current = null;
    }, remainingMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [searchQuery]);

  const filteredTransactions =
    throttledQuery.length === 0
      ? transactions
      : transactions.filter((transaction) => matchesTransaction(transaction, throttledQuery));

  return {
    searchQuery,
    setSearchQuery,
    filteredTransactions,
  };
}
