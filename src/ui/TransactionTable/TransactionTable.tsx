import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";

import { STATUS_META } from "src/domain/status";
import type { TransactionRecord } from "src/domain/types";
import * as tableStyles from "src/styles/table.css";


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
        <button
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
        </button>
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
  const columns = [
    { header: "Transaction Date", accessorKey: "transactionDate" },
    { header: "Account Number", accessorKey: "accountNumber" },
    { header: "Account Holder Name", accessorKey: "accountHolderName" },
    { header: "Amount", accessorKey: "amount" },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: { row: { original: TransactionRecord } }) => {
        const tx = row.original;
        const color = STATUS_META[tx.status].color;
        if (tx.status === "Failed" && tx.errorMessage) {
          return <FailedStatusCell color={color} errorMessage={tx.errorMessage} />;
        }
        return <span style={{ color }}>{tx.status}</span>;
      },
    },
  ];

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={tableStyles.tableContainer}>
      <table className={tableStyles.table}>
        <thead className={tableStyles.tableHead}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className={tableStyles.tableHeader}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className={tableStyles.tableRow}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`${tableStyles.tableCell} ${
                    cell.column.id === "status" ? tableStyles.statusTableCell : ""
                  }`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext()) ??
                    String(cell.getValue() ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
