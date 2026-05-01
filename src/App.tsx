import { useRef } from "react";

import { useBatchTransferStore } from "src/state/useBatchTransferStore";
import { BatchTransferModal } from "src/ui/BatchTransferModal";
import { TransactionTable } from "src/ui/TransactionTable";

import type { ChangeEvent } from "react";

export default function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openModal = useBatchTransferStore((s) => s.openModal);
  const transactions = useBatchTransferStore((s) => s.transactions);
  const hasHydrated = useBatchTransferStore((s) => s.hasHydrated);
  const snapshotMessage = useBatchTransferStore((s) => s.snapshotMessage);
  const setSnapshotMessage = useBatchTransferStore((s) => s.setSnapshotMessage);
  const exportSnapshot = useBatchTransferStore((s) => s.exportSnapshot);
  const importSnapshot = useBatchTransferStore((s) => s.importSnapshot);

  function handleExportTransactions() {
    const snapshot = exportSnapshot();
    const file = new Blob([snapshot], { type: "application/json" });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    anchor.href = url;
    anchor.download = `transactions-v1-${timestamp}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setSnapshotMessage("Exported transactions snapshot.");
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const validJsonType = file.type === "application/json" || file.name.toLowerCase().endsWith(".json");
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
      <button onClick={openModal}>Batch Transfer</button>
      <button onClick={handleExportTransactions}>Export Transactions</button>
      <button onClick={handleImportClick}>Import Transactions</button>
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
      {!hasHydrated ? <p>Loading persisted transactions...</p> : null}
      <TransactionTable transactions={transactions} />
      <BatchTransferModal />
    </main>
  );
}
