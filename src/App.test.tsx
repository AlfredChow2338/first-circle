import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { resetTransactionsDbForTests } from "src/utils/storage/transactionsIndexedDb";

import App from "./App";
import { APPROVERS, useBatchTransferStore } from "./store/useBatchTransferStore";

beforeEach(async () => {
  await resetTransactionsDbForTests();
  vi.restoreAllMocks();
  class MockFileReader {
    public result: string | ArrayBuffer | null = null;
    public onload: null | (() => void) = null;
    public onerror: null | (() => void) = null;

    readAsText(file: Blob) {
      file
        .text()
        .then((text) => {
          this.result = text;
          this.onload?.();
        })
        .catch(() => {
          this.onerror?.();
        });
    }
  }

  // @ts-expect-error - test environment mock
  global.FileReader = MockFileReader;

  useBatchTransferStore.setState({
    isOpen: false,
    step: 1,
    batchName: "",
    approver: APPROVERS[0],
    selectedFileName: "",
    uploadError: null,
    snapshotMessage: null,
    csvContent: "",
    parsedRows: [],
    hasHydrated: true,
    transactions: [
      {
        transactionDate: "2025-02-20",
        accountNumber: "000-123456789-01",
        accountHolderName: "John Doe",
        amount: 100,
        status: "Pending",
      },
      {
        transactionDate: "2025-02-21",
        accountNumber: "000-987654321-02",
        accountHolderName: "Jane Smith",
        amount: 250.5,
        status: "Settled",
      },
      {
        transactionDate: "2025-02-22",
        accountNumber: "000-333222111-03",
        accountHolderName: "Alex Johnson",
        amount: 50,
        status: "Failed",
        errorMessage: "Insufficient balance",
      },
    ],
  });
});

describe("App flow", () => {
  const uploadButtonName = "Upload Transaction (.csv)";

  it("opens modal and preserves state across steps", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: uploadButtonName }));
    const stepper = screen.getByRole("list", { name: "Batch transfer progress" });
    expect(stepper.querySelector('li[data-state="active"]')).toHaveTextContent("Transfer Details");

    fireEvent.change(screen.getByLabelText("Batch Transfer Name"), {
      target: { value: "Payroll Batch" },
    });
    const csvFile = new File(
      [
        "Transaction Date,Account Number,Account Holder Name,Amount\n2025-02-20,000-123456789-01,John Doe,100.00",
      ],
      "valid.csv",
      { type: "text/csv" },
    );
    fireEvent.change(screen.getByLabelText("CSV File Upload"), { target: { files: [csvFile] } });
    expect(await screen.findByText("Selected file: valid.csv")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Next"));
    expect(await screen.findByRole("heading", { level: 3, name: "Review Records" })).toBeInTheDocument();
    expect(stepper.querySelector('li[data-state="completed"]')).toHaveTextContent("Transfer Details");
    expect(stepper.querySelector('li[data-state="active"]')).toHaveTextContent("Review Records");
    fireEvent.click(screen.getByText("Back"));

    expect(screen.getByLabelText("Batch Transfer Name")).toHaveValue("Payroll Batch");
    expect(screen.getByText("Selected file: valid.csv")).toBeInTheDocument();
    expect(stepper.querySelector('li[data-state="active"]')).toHaveTextContent("Transfer Details");
  });

  it("shows upload error for non-csv files", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: uploadButtonName }));
    const textFile = new File(["not,csv"], "invalid.txt", { type: "text/plain" });
    fireEvent.change(screen.getByLabelText("CSV File Upload"), { target: { files: [textFile] } });
    expect(await screen.findByRole("alert")).toHaveTextContent("Please upload a valid .csv file.");
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please upload a CSV file before continuing.",
    );
  });

  it("appends transactions when confirmed", async () => {
    render(<App />);
    const initial = useBatchTransferStore.getState().transactions.length;
    fireEvent.click(screen.getByRole("button", { name: uploadButtonName }));
    const csvFile = new File(
      [
        "Transaction Date,Account Number,Account Holder Name,Amount\n2025-02-20,000-123456789-01,John Doe,100.00",
      ],
      "valid.csv",
      { type: "text/csv" },
    );
    fireEvent.change(screen.getByLabelText("CSV File Upload"), { target: { files: [csvFile] } });
    expect(await screen.findByText("Selected file: valid.csv")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Next"));
    expect(await screen.findByRole("heading", { level: 3, name: "Review Records" })).toBeInTheDocument();
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Confirm Transfer"));
    await waitFor(() => {
      expect(useBatchTransferStore.getState().transactions.length).toBeGreaterThan(initial);
    });
  });

  it("clears modal state when closed from cross icon", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: uploadButtonName }));
    fireEvent.change(screen.getByLabelText("Batch Transfer Name"), {
      target: { value: "To Be Cleared" },
    });

    const csvFile = new File(
      [
        "Transaction Date,Account Number,Account Holder Name,Amount\n2025-02-20,000-123456789-01,John Doe,100.00",
      ],
      "valid.csv",
      { type: "text/csv" },
    );
    fireEvent.change(screen.getByLabelText("CSV File Upload"), { target: { files: [csvFile] } });
    expect(await screen.findByText("Selected file: valid.csv")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close modal" }));
    fireEvent.click(screen.getByRole("button", { name: uploadButtonName }));

    expect(screen.getByLabelText("Batch Transfer Name")).toHaveValue("");
    expect(screen.queryByText("Selected file: valid.csv")).not.toBeInTheDocument();
  });

  it("opens More menu and exports transactions from menu action", () => {
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);
    const revokeSpy = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    const createObjectUrlSpy = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob://transactions-export");

    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "More actions" }));
    expect(
      screen.getByRole("menuitem", { name: "Export Transactions (.csv)" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Clear Data" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("menuitem", { name: "Export Transactions (.csv)" }));

    expect(clickSpy).toHaveBeenCalled();
    expect(createObjectUrlSpy).toHaveBeenCalled();
    expect(revokeSpy).toHaveBeenCalledWith("blob://transactions-export");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("clears local data from More menu after confirmation", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<App />);
    expect(useBatchTransferStore.getState().transactions.length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "More actions" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Clear Data" }));

    await waitFor(() => {
      expect(useBatchTransferStore.getState().transactions).toEqual([]);
    });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByText("Cleared local transaction data.")).toBeInTheDocument();
  });
});
