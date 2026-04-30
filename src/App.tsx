import { BatchTransferModal } from "./ui/BatchTransferModal";
import { TransactionTable } from "./ui/TransactionTable";
import { useBatchTransferStore } from "./state/useBatchTransferStore";

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
