import type { TransactionStatus } from "./types";

export const STATUS_META: Record<TransactionStatus, { color: string }> = {
  Pending: { color: "goldenrod" },
  Settled: { color: "green" },
  Failed: { color: "crimson" },
};
