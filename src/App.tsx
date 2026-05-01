import { BatchTransferModal } from "src/components/BatchTransferModal";
import { Button } from "src/components/shared/Button";
import { MessageProvider } from "src/components/shared/Message/MessageProvider";
import { TransactionDetailModal } from "src/components/TransactionDetailModal";
import { TransactionTable } from "src/components/TransactionTable";
import { useMoreMenuActions } from "src/hooks/useMoreMenuActions";
import { useTransactionActions } from "src/hooks/useTransactionActions";
import { useTransactionSearch } from "src/hooks/useTransactionSearch";
import { useBatchTransferStore } from "src/store/useBatchTransferStore";

import { appClassNames } from "./components/config";

function AppContent() {
  const openModal = useBatchTransferStore((s) => s.openModal);
  const transactions = useBatchTransferStore((s) => s.transactions);
  const hasHydrated = useBatchTransferStore((s) => s.hasHydrated);
  const clearLocalData = useBatchTransferStore((s) => s.clearLocalData);
  const settleTransaction = useBatchTransferStore((s) => s.settleTransaction);
  const { searchQuery, setSearchQuery, filteredTransactions } = useTransactionSearch(transactions);
  const { isMoreMenuOpen, toggleMoreMenu, handleExportFromMenu, handleClearLocalData } =
    useMoreMenuActions({
      transactions,
      clearLocalData,
    });

  const {
    selectedTransaction,
    settlingTransactionKeys,
    handleViewTransaction,
    handleSettleTransaction,
    handleTransactionDetailModalOpenChange,
  } = useTransactionActions({
    settleTransaction,
  });

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
            onClick={toggleMoreMenu}
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
                Clear Data
              </Button>
            </div>
          ) : null}
        </div>
      </div>
      {!hasHydrated ? <p>Loading persisted transactions...</p> : null}
      <input
        className={appClassNames.searchInput}
        aria-label="Search Transactions"
        placeholder="Search by acct no. or acct holder name"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />
      <TransactionTable
        transactions={filteredTransactions}
        onViewTransaction={handleViewTransaction}
        onSettleTransaction={(transaction) => void handleSettleTransaction(transaction)}
        settlingTransactionKeys={settlingTransactionKeys}
      />
      <TransactionDetailModal
        transaction={selectedTransaction}
        onOpenChange={handleTransactionDetailModalOpenChange}
      />
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
