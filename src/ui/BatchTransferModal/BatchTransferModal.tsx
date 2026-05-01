import * as Dialog from "@radix-ui/react-dialog";
import { useMemo } from "react";

import { summarizeRows } from "src/domain/summary";
import {
  APPROVERS,
  useBatchTransferStore,
} from "src/state/useBatchTransferStore";

import { batchTransferModalClassNames } from "./config";

export function BatchTransferModal() {
  const {
    isOpen,
    step,
    batchName,
    approver,
    csvContent,
    parsedRows,
    closeModal,
    prevStep,
    nextStep,
    setBatchName,
    setApprover,
    setCsvContent,
    parseCsv,
    confirmBatch,
  } = useBatchTransferStore();

  const summary = useMemo(() => summarizeRows(parsedRows), [parsedRows]);

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
                CSV Content
                <textarea
                  aria-label="CSV Content"
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                />
              </label>
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
              <button
                onClick={() => {
                  parseCsv();
                  nextStep();
                }}
              >
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
