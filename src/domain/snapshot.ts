import { z } from "zod";

const transactionSchema = z.object({
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  accountNumber: z.string().regex(/^\d{3}-\d{9}-\d{2}$/),
  accountHolderName: z.string().min(1),
  amount: z.number().positive(),
  status: z.enum(["Pending", "Settled", "Failed"]),
  errorMessage: z.string().optional(),
});

const snapshotSchemaV1 = z.object({
  version: z.literal(1),
  exportedAt: z.string().datetime(),
  source: z.literal("first-circle-interview"),
  transactions: z.array(transactionSchema),
});

export function createSnapshot(transactions: any) {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    source: "first-circle-interview",
    transactions,
  };
}

export function parseSnapshot(jsonText: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("Invalid snapshot JSON.");
  }

  const result = snapshotSchemaV1.safeParse(parsed);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    throw new Error(`Invalid snapshot contract: ${firstIssue?.message ?? "unknown error"}`);
  }

  return result.data;
}
