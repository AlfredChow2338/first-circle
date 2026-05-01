import {
  deletePersistEnvelope,
  readPersistEnvelope,
  writePersistEnvelope,
  type PersistedTransactionsSlice,
} from "src/utils/storage/transactionsIndexedDb";

import type { PersistStorage } from "zustand/middleware";

type PersistedSlice = PersistedTransactionsSlice;

/**
 * Zustand `persist` storage backed by IndexedDB (structured clone of persist envelope).
 */
export function createIndexedDbPersistStorage(): PersistStorage<PersistedSlice> {
  return {
    getItem: async (name) => readPersistEnvelope(name),
    setItem: async (name, value) => {
      await writePersistEnvelope(name, value);
    },
    removeItem: async (name) => {
      await deletePersistEnvelope(name);
    },
  };
}
