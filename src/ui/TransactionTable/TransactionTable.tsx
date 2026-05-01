import { useState } from "react";

import { STATUS_META } from "src/domain/status";
import type { TransactionRecord } from "src/domain/types";
import * as tableStyles from "src/styles/table.css";
import { Button } from "src/ui/shared/Button";
import { Table, type TableColumn } from "src/ui/shared/Table";

type Props = {
  transactions: TransactionRecord[];
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

export function TransactionTable({ transactions }: Props) {
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
  ];

  return (
    <Table
      data={transactions}
      columns={columns}
      getRowKey={(row, index) => `${row.accountNumber}-${index}`}
    />
  );
}
