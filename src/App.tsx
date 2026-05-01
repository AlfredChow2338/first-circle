import { useBatchTransferStore } from "src/state/useBatchTransferStore";
import { BatchTransferModal } from "src/ui/BatchTransferModal";
import { TransactionTable } from "src/ui/TransactionTable";

export default function App() {
  const openModal = useBatchTransferStore((s) => s.openModal);
  const transactions = useBatchTransferStore((s) => s.transactions);

  return (
    <main>
      <h1>Batch Transaction Processing System</h1>
      <button onClick={openModal}>Batch Transfer</button>
      <TransactionTable transactions={transactions} />
      <BatchTransferModal />
    </main>
  );
}
