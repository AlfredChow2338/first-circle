import { deleteDB, openDB, type DBSchema, type IDBPDatabase } from "idb";

import type { TransactionRecord } from "src/domain/types";

import type { StorageValue } from "zustand/middleware";


export const PERSIST_DB_NAME = "batch-transactions-db";
export const PERSIST_DB_VERSION = 1;
export const PERSIST_STORE_NAME = "zustand-persist";

export type PersistedTransactionsSlice = {
  transactions: TransactionRecord[];
};

interface BatchTransactionsDB extends DBSchema {
  [PERSIST_STORE_NAME]: {
    key: string;
    value: StorageValue<PersistedTransactionsSlice>;
  };
}

let dbPromise: Promise<IDBPDatabase<BatchTransactionsDB>> | null = null;

export function openTransactionsDb(): Promise<IDBPDatabase<BatchTransactionsDB>> {
  if (!dbPromise) {
    dbPromise = openDB<BatchTransactionsDB>(PERSIST_DB_NAME, PERSIST_DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(PERSIST_STORE_NAME)) {
          db.createObjectStore(PERSIST_STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
}

export async function readPersistEnvelope(
  name: string,
): Promise<StorageValue<PersistedTransactionsSlice> | null> {
  const db = await openTransactionsDb();
  const value = await db.get(PERSIST_STORE_NAME, name);
  return value ?? null;
}

export async function writePersistEnvelope(
  name: string,
  value: StorageValue<PersistedTransactionsSlice>,
): Promise<void> {
  const db = await openTransactionsDb();
  await db.put(PERSIST_STORE_NAME, value, name);
}

export async function deletePersistEnvelope(name: string): Promise<void> {
  const db = await openTransactionsDb();
  await db.delete(PERSIST_STORE_NAME, name);
}

export async function clearAllPersistEnvelopes(): Promise<void> {
  const db = await openTransactionsDb();
  await db.clear(PERSIST_STORE_NAME);
}

/** Clears the singleton and deletes the DB (for tests and hard resets). */
export async function resetTransactionsDbForTests(): Promise<void> {
  const activeDbPromise = dbPromise;
  dbPromise = null;

  if (activeDbPromise) {
    try {
      const db = await activeDbPromise;
      db.close();
    } catch {
      // ignore close errors; best-effort teardown
    }
  }

  try {
    await deleteDB(PERSIST_DB_NAME);
  } catch {
    // ignore teardown errors in constrained environments
  }
}
