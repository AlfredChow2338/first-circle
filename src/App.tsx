import Papa from "papaparse";
import { useEffect, useRef, useState } from "react";

import {
  OFFLINE_READY_EVENT,
  isOfflineReadyForCurrentPage,
} from "src/offline/registerServiceWorker";
import { useBatchTransferStore } from "src/state/useBatchTransferStore";
import { BatchTransferModal } from "src/ui/BatchTransferModal";
import { Button } from "src/ui/shared/Button";
import { TransactionTable } from "src/ui/TransactionTable";

import { appClassNames } from "./ui/config";

import type { ChangeEvent } from "react";

export default function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOfflineReady, setIsOfflineReady] = useState(isOfflineReadyForCurrentPage);

  const openModal = useBatchTransferStore((s) => s.openModal);
  const transactions = useBatchTransferStore((s) => s.transactions);
  const hasHydrated = useBatchTransferStore((s) => s.hasHydrated);
  const snapshotMessage = useBatchTransferStore((s) => s.snapshotMessage);
  const setSnapshotMessage = useBatchTransferStore((s) => s.setSnapshotMessage);
  const importSnapshot = useBatchTransferStore((s) => s.importSnapshot);

  useEffect(() => {
    const onOfflineReady = () => setIsOfflineReady(true);
    window.addEventListener(OFFLINE_READY_EVENT, onOfflineReady);
    return () => {
      window.removeEventListener(OFFLINE_READY_EVENT, onOfflineReady);
    };
  }, []);

  function handleExportTransactions() {
    const csvContent = Papa.unparse(
      transactions.map((transaction) => ({
        "Transaction Date": transaction.transactionDate,
        "Account Number": transaction.accountNumber,
        "Account Holder Name": transaction.accountHolderName,
        Amount: transaction.amount,
      })),
    );
    const file = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    anchor.href = url;
    anchor.download = `transactions-v1-${timestamp}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    setSnapshotMessage("Exported transactions CSV.");
  }

  async function handleImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const validJsonType =
      file.type === "application/json" || file.name.toLowerCase().endsWith(".json");
    if (!validJsonType) {
      setSnapshotMessage("Please select a valid JSON snapshot file.");
      event.target.value = "";
      return;
    }

    try {
      const text = await file.text();
      importSnapshot(text);
    } catch (error) {
      setSnapshotMessage(error instanceof Error ? error.message : "Unable to import snapshot.");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <main>
      <h1>Batch Transaction Processing System</h1>
      <div className={appClassNames.buttonWrapper}>
        <Button onClick={openModal}>Upload Transaction (.csv)</Button>
        <Button onClick={handleExportTransactions}>Export Transactions (.csv)</Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        aria-label="Import Transactions File"
        style={{ display: "none" }}
        onChange={(event) => {
          void handleImportFile(event);
        }}
      />
      {snapshotMessage ? <p role="status">{snapshotMessage}</p> : null}
      <p className={appClassNames.offlineStatus} role="status">
        {isOfflineReady ? "Offline mode ready." : "Offline mode not ready yet."}
      </p>
      {!hasHydrated ? <p>Loading persisted transactions...</p> : null}
      <TransactionTable transactions={transactions} />
      <BatchTransferModal />
    </main>
  );
}
