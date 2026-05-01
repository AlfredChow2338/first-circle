import * as Dialog from "@radix-ui/react-dialog";

import { Button } from "src/components/shared/Button";
import type { TransactionRecord } from "src/components/TransactionTable/types";
import * as modalStyles from "src/styles/modal.css";

type TransactionDetailModalProps = {
  transaction: TransactionRecord | null;
  onOpenChange: (open: boolean) => void;
};

export function TransactionDetailModal({ transaction, onOpenChange }: TransactionDetailModalProps) {
  return (
    <Dialog.Root open={transaction !== null} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={modalStyles.modalOverlay} />
        <Dialog.Content className={modalStyles.modalContent}>
          <Dialog.Close asChild>
            <Button aria-label="Close transaction details" className={modalStyles.closeButton}>
              ×
            </Button>
          </Dialog.Close>
          <Dialog.Title>Transaction Details</Dialog.Title>
          <Dialog.Description>Review transaction information for this row.</Dialog.Description>
          {transaction ? (
            <section>
              <p>
                <strong>Transaction Date:</strong> {transaction.transactionDate}
              </p>
              <p>
                <strong>Account Number:</strong> {transaction.accountNumber}
              </p>
              <p>
                <strong>Account Holder Name:</strong> {transaction.accountHolderName}
              </p>
              <p>
                <strong>Amount:</strong> {transaction.amount}
              </p>
              <p>
                <strong>Status:</strong> {transaction.status}
              </p>
              {transaction.errorMessage ? (
                <p>
                  <strong>Error:</strong> {transaction.errorMessage}
                </p>
              ) : null}
            </section>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
