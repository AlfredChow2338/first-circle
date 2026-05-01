import * as tableStyles from "src/styles/table.css";

import type { Key, ReactNode } from "react";

export type TableColumn<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T, rowIndex: number) => ReactNode;
  cellClassName?: string;
};

type TableProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  getRowKey: (row: T, index: number) => Key;
};

export function Table<T>({ data, columns, getRowKey }: TableProps<T>) {
  return (
    <div className={tableStyles.tableContainer}>
      <table className={tableStyles.table}>
        <thead className={tableStyles.tableHead}>
          <tr>
            {columns.map((column) => (
              <th key={column.id} className={tableStyles.tableHeader}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={getRowKey(row, rowIndex)} className={tableStyles.tableRow}>
              {columns.map((column) => (
                <td
                  key={column.id}
                  className={`${tableStyles.tableCell} ${column.cellClassName ?? ""}`.trim()}
                >
                  {column.cell(row, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
