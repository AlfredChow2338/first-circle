import { vars } from "src/styles/theme.css";

import type { TransactionStatus } from "./types";

export const STATUS_META: Record<TransactionStatus, { color: string }> = {
  Pending: { color: vars.color.pending },
  Settled: { color: vars.color.success },
  Failed: { color: vars.color.danger },
};
