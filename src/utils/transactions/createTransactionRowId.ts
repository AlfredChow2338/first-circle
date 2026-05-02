/** Stable unique id per persisted row (upload batch, rehydration, etc.). */
export function createTransactionRowId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `tx-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}
