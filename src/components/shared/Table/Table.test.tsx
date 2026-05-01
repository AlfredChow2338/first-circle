import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Table, type TableColumn } from "./Table";

type Row = {
  id: string;
  label: string;
};

const columns: TableColumn<Row>[] = [{ id: "label", header: "Label", cell: (row) => row.label }];

function createRows(count: number): Row[] {
  return Array.from({ length: count }, (_, index) => ({
    id: String(index + 1),
    label: `Row ${index + 1}`,
  }));
}

describe("Shared Table pagination", () => {
  it("renders first 10 rows by default and navigates pages", () => {
    render(<Table data={createRows(12)} columns={columns} getRowKey={(row) => row.id} />);

    expect(screen.getByText("Row 1")).toBeInTheDocument();
    expect(screen.getByText("Row 10")).toBeInTheDocument();
    expect(screen.queryByText("Row 11")).not.toBeInTheDocument();
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));

    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(screen.getByText("Row 11")).toBeInTheDocument();
    expect(screen.getByText("Row 12")).toBeInTheDocument();
    expect(screen.queryByText("Row 1")).not.toBeInTheDocument();
  });

  it("disables boundary pagination buttons", () => {
    render(<Table data={createRows(11)} columns={columns} getRowKey={(row) => row.id} />);

    const previousButton = screen.getByRole("button", { name: "Previous page" });
    const nextButton = screen.getByRole("button", { name: "Next page" });

    expect(previousButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    fireEvent.click(nextButton);

    expect(previousButton).not.toBeDisabled();
    expect(nextButton).toBeDisabled();
  });
});
