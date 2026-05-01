import { useEffect, useMemo, useState } from "react";

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

const DEFAULT_PAGE_SIZE = 10;

export function Table<T>({ data, columns, getRowKey }: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / DEFAULT_PAGE_SIZE));

  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(previousPage, totalPages));
  }, [totalPages]);

  const pageStartIndex = (currentPage - 1) * DEFAULT_PAGE_SIZE;
  const pageRows = useMemo(
    () => data.slice(pageStartIndex, pageStartIndex + DEFAULT_PAGE_SIZE),
    [data, pageStartIndex],
  );

  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

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
          {pageRows.map((row, rowIndex) => {
            const absoluteRowIndex = pageStartIndex + rowIndex;
            return (
              <tr key={getRowKey(row, absoluteRowIndex)} className={tableStyles.tableRow}>
              {columns.map((column) => (
                <td
                  key={column.id}
                  className={`${tableStyles.tableCell} ${column.cellClassName ?? ""}`.trim()}
                >
                    {column.cell(row, absoluteRowIndex)}
                </td>
              ))}
            </tr>
            );
          })}
        </tbody>
      </table>
      {totalPages > 1 ? (
        <div className={tableStyles.paginationContainer}>
          <button
            type="button"
            className={tableStyles.paginationButton}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={isPreviousDisabled}
            aria-label="Previous page"
          >
            Previous
          </button>
          <span className={tableStyles.paginationLabel}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            className={tableStyles.paginationButton}
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={isNextDisabled}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
