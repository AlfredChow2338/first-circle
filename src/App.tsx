import { useState } from "react";

import { useBatchTransferStore } from "src/store/useBatchTransferStore";
import { BatchTransferModal } from "src/components/BatchTransferModal";
import { Button } from "src/components/shared/Button";
import { MessageProvider, useMessage } from "src/components/shared/Message/MessageProvider";
import { TransactionTable } from "src/components/TransactionTable";
import { handleExportTransactions } from "src/utils/csv";

import { appClassNames } from "./components/config";

function AppContent() {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const message = useMessage();

  const openModal = useBatchTransferStore((s) => s.openModal);
  const transactions = useBatchTransferStore((s) => s.transactions);
  const hasHydrated = useBatchTransferStore((s) => s.hasHydrated);
  const clearLocalData = useBatchTransferStore((s) => s.clearLocalData);

  function handleExportFromMenu() {
    handleExportTransactions(transactions);
    setIsMoreMenuOpen(false);
    message.success("Exported transactions CSV.");
  }

  async function handleClearLocalData() {
    const confirmed = window.confirm("Clear all locally saved transaction data?");
    if (!confirmed) {
      return;
    }
    await clearLocalData();
    message.success("Cleared local transaction data.");
    setIsMoreMenuOpen(false);
  }

  return (
    <main>
      <h1>Batch Transaction Processing System</h1>
      <div className={appClassNames.buttonWrapper}>
        <Button onClick={openModal}>Upload Transaction (.csv)</Button>
        <div className={appClassNames.moreMenuWrapper}>
          <Button
            variant="secondary"
            aria-label="More actions"
            aria-haspopup="menu"
            aria-expanded={isMoreMenuOpen}
            onClick={() => setIsMoreMenuOpen((open) => !open)}
          >
            &#8942;
          </Button>
          {isMoreMenuOpen ? (
            <div role="menu" className={appClassNames.moreMenuPanel}>
              <Button
                role="menuitem"
                variant="secondary"
                className={appClassNames.moreMenuItemButton}
                onClick={handleExportFromMenu}
              >
                Export Transactions (.csv)
              </Button>
              <Button
                role="menuitem"
                variant="danger"
                className={appClassNames.moreMenuItemButton}
                onClick={() => void handleClearLocalData()}
              >
                Clear Local Data
              </Button>
            </div>
          ) : null}
        </div>
      </div>
      {!hasHydrated ? <p>Loading persisted transactions...</p> : null}
      <TransactionTable transactions={transactions} />
      <BatchTransferModal />
    </main>
  );
}

export default function App() {
  return (
    <MessageProvider>
      <AppContent />
    </MessageProvider>
  );
}
