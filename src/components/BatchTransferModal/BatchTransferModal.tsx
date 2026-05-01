import * as Dialog from "@radix-ui/react-dialog";
import { useMemo } from "react";

import { Button } from "src/components/shared/Button";
import { useMessage } from "src/components/shared/Message/MessageProvider";
import { Stepper } from "src/components/shared/Stepper";
import { Table, type TableColumn } from "src/components/shared/Table";
import { APPROVERS, useBatchTransferStore } from "src/store/useBatchTransferStore";
import type { ParsedCsvRow } from "src/utils/csv/types";
import { summarizeRows } from "src/utils/summary";

import { batchTransferModalClassNames } from "./config";

import type { ChangeEvent } from "react";

export function BatchTransferModal() {
  const steps = useMemo(
    () => [
      { title: "Transfer Details", description: "Provide transfer name, file, and approver." },
      { title: "Review Records", description: "Check parsed transactions and validation results." },
      { title: "Summary", description: "Verify totals before confirming transfer." },
    ],
    [],
  );
  const message = useMessage();
  const {
    isOpen,
    step,
    batchName,
    approver,
    selectedFileName,
    uploadError,
    csvContent,
    parsedRows,
    closeModal,
    prevStep,
    nextStep,
    setBatchName,
    setApprover,
    setSelectedFileName,
    setUploadError,
    setCsvContent,
    parseCsv,
    confirmBatch,
  } = useBatchTransferStore();

  const summary = useMemo(() => summarizeRows(parsedRows), [parsedRows]);
  const hasValidationErrors = useMemo(
    () => parsedRows.some((row) => Object.keys(row.errors).length > 0),
    [parsedRows],
  );
  const reviewColumns = useMemo<TableColumn<ParsedCsvRow>[]>(
    () => [
      { id: "transactionDate", header: "Transaction Date", cell: (row) => row.transactionDate },
      { id: "accountNumber", header: "Account Number", cell: (row) => row.accountNumber },
      {
        id: "accountHolderName",
        header: "Account Holder Name",
        cell: (row) => row.accountHolderName,
      },
      { id: "amountRaw", header: "Amount", cell: (row) => row.amountRaw },
      { id: "errors", header: "Errors", cell: (row) => Object.values(row.errors).join(", ") },
    ],
    [],
  );

  function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("Unable to read uploaded file"));
      reader.readAsText(file);
    });
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    const fileName = file.name.toLowerCase();
    const isCsvByExt = fileName.endsWith(".csv");
    const allowedMime = new Set(["text/csv", "application/vnd.ms-excel", ""]);
    const isCsvByMime = allowedMime.has(file.type);

    if (!isCsvByExt && !isCsvByMime) {
      setSelectedFileName("");
      setCsvContent("");
      setUploadError("Please upload a valid .csv file.");
      event.target.value = "";
      return;
    }

    try {
      const text = await readFileAsText(file);
      if (!text.trim()) {
        setSelectedFileName("");
        setCsvContent("");
        setUploadError("CSV file is empty. Please upload a file with valid records.");
        return;
      }
      setSelectedFileName(file.name);
      setCsvContent(text);
    } catch {
      setSelectedFileName("");
      setCsvContent("");
      setUploadError("Unable to read the uploaded CSV file. Please try again.");
    }
  }

  function handleNextFromStepOne() {
    if (!selectedFileName || !csvContent.trim()) {
      setUploadError("Please upload a CSV file before continuing.");
      return;
    }

    try {
      parseCsv();
      setUploadError(null);
      nextStep();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Invalid CSV format.");
    }
  }

  async function handleConfirmBatch() {
    await confirmBatch();
    message.success("Batch transfer confirmed.");
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => (!open ? closeModal() : undefined)}>
      <Dialog.Portal>
        <Dialog.Overlay className={batchTransferModalClassNames.overlay} />
        <Dialog.Content
          className={`${batchTransferModalClassNames.wrapper} ${
            step === 2 ? batchTransferModalClassNames.wrapperStepTwo : ""
          }`}
        >
          <Dialog.Close asChild>
            <Button aria-label="Close modal" className={batchTransferModalClassNames.closeButton}>
              ×
            </Button>
          </Dialog.Close>
          <Dialog.Title>Batch Transfer</Dialog.Title>
          <Dialog.Description>
            Upload and review batch transactions before confirming transfer submission.
          </Dialog.Description>
          <Stepper steps={steps} activeStep={step} ariaLabel="Batch transfer progress" />
          {step === 1 && (
            <section>
              <label>
                Batch Transfer Name
                <input
                  aria-label="Batch Transfer Name"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                />
              </label>
              <label>
                CSV File Upload
                <div className={batchTransferModalClassNames.fileUploadWrapper}>
                  <input
                    id="csv-file-upload"
                    aria-label="CSV File Upload"
                    type="file"
                    accept=".csv,text/csv"
                    className={batchTransferModalClassNames.fileUploadInput}
                    onChange={(event) => {
                      void handleFileChange(event);
                    }}
                  />
                  <label
                    htmlFor="csv-file-upload"
                    className={batchTransferModalClassNames.fileUploadLabel}
                  >
                    <span className={batchTransferModalClassNames.fileUploadIcon}>📁</span>
                    <span>{selectedFileName || "Choose CSV file or drag and drop"}</span>
                  </label>
                </div>
              </label>
              {selectedFileName ? (
                <div className={batchTransferModalClassNames.uploadMeta}>
                  Selected file: {selectedFileName}
                </div>
              ) : null}
              {uploadError ? (
                <div role="alert" className={batchTransferModalClassNames.uploadError}>
                  {uploadError}
                </div>
              ) : null}
              <label>
                Approver Selection
                <select
                  aria-label="Approver Selection"
                  value={approver}
                  onChange={(e) => setApprover(e.target.value)}
                >
                  {APPROVERS.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <Button onClick={handleNextFromStepOne}>Next</Button>
            </section>
          )}
          {step === 2 && (
            <section>
              <h3>Review Records</h3>
              {hasValidationErrors ? (
                <div role="alert" className={batchTransferModalClassNames.reviewValidationError}>
                  Some transactions have validation errors. Please review before continuing.
                </div>
              ) : null}
              <Table data={parsedRows} columns={reviewColumns} getRowKey={(row) => row.rowNumber} />
              <Button variant="secondary" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep}>Next</Button>
            </section>
          )}
          {step === 3 && (
            <section>
              <h3>Summary</h3>
              <div className={batchTransferModalClassNames.summaryItem}>
                <strong>Batch Transfer Name:</strong> {batchName}
              </div>
              <div className={batchTransferModalClassNames.summaryItem}>
                <strong>Approver:</strong> {approver}
              </div>
              <div className={batchTransferModalClassNames.summaryItem}>
                <strong>Total Amount:</strong> ${summary.totalAmount.toFixed(2)}
              </div>
              <div className={batchTransferModalClassNames.summaryItem}>
                <strong>Number of Payments:</strong> {summary.paymentCount}
              </div>
              <div className={batchTransferModalClassNames.summaryItem}>
                <strong>Average Payment Value:</strong> ${summary.averagePayment.toFixed(2)}
              </div>
              <Button variant="secondary" onClick={prevStep}>
                Back
              </Button>
              <Button variant="success" onClick={() => void handleConfirmBatch()}>
                Confirm
              </Button>
            </section>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
