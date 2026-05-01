import * as Dialog from "@radix-ui/react-dialog";
import { useMemo } from "react";


import { summarizeRows } from "src/domain/summary";
import {
  APPROVERS,
  useBatchTransferStore,
} from "src/state/useBatchTransferStore";

import { batchTransferModalClassNames } from "./config";

import type { ChangeEvent } from "react";

export function BatchTransferModal() {
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

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => (!open ? closeModal() : undefined)}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={batchTransferModalClassNames.overlay} />
        <Dialog.Content className={batchTransferModalClassNames.wrapper}>
          <Dialog.Title>Batch Transfer</Dialog.Title>
          <Dialog.Description>
            Three-step batch transfer workflow
          </Dialog.Description>
          <div className={batchTransferModalClassNames.stepIndicator}>Step {step} of 3</div>
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
                <input
                  aria-label="CSV File Upload"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(event) => {
                    void handleFileChange(event);
                  }}
                />
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
              <button onClick={handleNextFromStepOne}>
                Next
              </button>
            </section>
          )}
          {step === 2 && (
            <section>
              <h3>Review Records</h3>
              <table>
                <thead>
                  <tr>
                    <th>Transaction Date</th>
                    <th>Account Number</th>
                    <th>Account Holder Name</th>
                    <th>Amount</th>
                    <th>Errors</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.map((row) => (
                    <tr key={row.rowNumber}>
                      <td>{row.transactionDate}</td>
                      <td>{row.accountNumber}</td>
                      <td>{row.accountHolderName}</td>
                      <td>{row.amountRaw}</td>
                      <td>{Object.values(row.errors).join(", ") || "None"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={prevStep}>Back</button>
              <button onClick={nextStep}>Next</button>
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
                <strong>Average Payment Value:</strong> $
                {summary.averagePayment.toFixed(2)}
              </div>
              <button onClick={prevStep}>Back</button>
              <button onClick={confirmBatch}>Confirm</button>
            </section>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
