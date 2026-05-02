import { useState } from "react";

import { Button } from "src/components/shared/Button";
import { Table, type TableColumn } from "src/components/shared/Table";
import * as tableStyles from "src/styles/table.css";
import { getTransactionKey } from "src/utils/transactions";

import { STATUS_META } from "./config";

import type { TransactionRecord } from "./types";

type Props = {
  transactions: TransactionRecord[];
  onViewTransaction: (transaction: TransactionRecord) => void;
  onSettleTransaction: (transaction: TransactionRecord) => void;
  settlingTransactionKeys: Set<string>;
};

type FailedStatusCellProps = {
  color: string;
  errorMessage: string;
};

function FailedStatusCell({ color, errorMessage }: FailedStatusCellProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  return (
    <span className={tableStyles.statusInline}>
      <span style={{ color }}>Failed</span>
      <span className={tableStyles.statusTooltipWrapper}>
        <Button
          type="button"
          aria-label="Failed transaction details"
          aria-expanded={isTooltipOpen}
          className={tableStyles.failedInfoIconButton}
          onClick={() => setIsTooltipOpen((open) => !open)}
          onMouseEnter={() => setIsTooltipOpen(true)}
          onMouseLeave={() => setIsTooltipOpen(false)}
          onFocus={() => setIsTooltipOpen(true)}
          onBlur={() => setIsTooltipOpen(false)}
        >
          i
        </Button>
        {isTooltipOpen ? (
          <span role="tooltip" className={tableStyles.tooltipContent}>
            {errorMessage}
          </span>
        ) : null}
      </span>
    </span>
  );
}

export function TransactionTable({
  transactions,
  onViewTransaction,
  onSettleTransaction,
  settlingTransactionKeys,
}: Props) {
  const columns: TableColumn<TransactionRecord>[] = [
    { id: "transactionDate", header: "Transaction Date", cell: (tx) => tx.transactionDate },
    { id: "accountNumber", header: "Account Number", cell: (tx) => tx.accountNumber },
    { id: "accountHolderName", header: "Account Holder Name", cell: (tx) => tx.accountHolderName },
    { id: "amount", header: "Amount", cell: (tx) => tx.amount },
    {
      id: "status",
      header: "Status",
      cellClassName: tableStyles.statusTableCell,
      cell: (tx) => {
        const color = STATUS_META[tx.status].color;
        if (tx.status === "Failed" && tx.errorMessage) {
          return <FailedStatusCell color={color} errorMessage={tx.errorMessage} />;
        }
        return <span style={{ color }}>{tx.status}</span>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cellClassName: tableStyles.actionsTableCell,
      cell: (tx) => {
        const transactionKey = getTransactionKey(tx);
        const isSettling = settlingTransactionKeys.has(transactionKey);

        return (
          <div className={tableStyles.actionsInline}>
            <Button size="small" variant="secondary" onClick={() => onViewTransaction(tx)}>
              View
            </Button>
            {tx.status === "Pending" ? (
              <Button
                size="small"
                variant="success"
                disabled={isSettling}
                onClick={() => onSettleTransaction(tx)}
              >
                {isSettling ? "Settling..." : "Settle"}
              </Button>
            ) : null}
          </div>
        );
      },
    },
  ];

  return (
    <Table
      data={transactions}
      columns={columns}
      getRowKey={(row) => getTransactionKey(row)}
    />
  );
}
