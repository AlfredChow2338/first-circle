import * as Tooltip from "@radix-ui/react-tooltip";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { STATUS_META } from "src/domain/status";
import type { TransactionRecord } from "src/domain/types";
import * as tableStyles from "src/styles/table.css";


type Props = {
  transactions: TransactionRecord[];
};

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
          return (
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <span aria-label="Failed transaction" style={{ color, textDecoration: "underline dotted" }}>
                    {tx.status}
                  </span>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content sideOffset={6}>{tx.errorMessage}</Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          );
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
                <td key={cell.id} className={tableStyles.tableCell}>{flexRender(cell.column.columnDef.cell, cell.getContext()) ?? String(cell.getValue() ?? "")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
