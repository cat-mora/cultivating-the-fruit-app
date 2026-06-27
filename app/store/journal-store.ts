import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  encryptData,
  decryptData,
} from "../features/security/utils/encryption";
import { syncJournalEntry } from "../lib/data/sync-service";
import { Platform } from "react-native";

export interface JournalEntry {
  id: string;
  day_number: number;
  content: string; // Encrypted string
  created_at: string;
}

interface JournalState {
  entries: JournalEntry[];
  addEntry: (day_number: number, rawContent: string) => void;
  getDecryptedEntry: (day_number: number) => string | null;
  syncToSupabase: () => Promise<void>;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      addEntry: (day_number, rawContent) => {
        const encryptedContent = encryptData(rawContent);
        const newEntry: JournalEntry = {
          id: Math.random().toString(36).substring(7),
          day_number,
          content: encryptedContent,
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          entries: [
            ...state.entries.filter((e) => e.day_number !== day_number),
            newEntry,
          ],
        }));

        // Sync to Supabase after state update
        if (Platform.OS === "web") {
          // Web: immediate sync
          get().syncToSupabase();
        }
        // Native: background sync will handle it
      },
      getDecryptedEntry: (day_number) => {
        const entry = get().entries.find((e) => e.day_number === day_number);
        if (!entry) return null;
        try {
          return decryptData(entry.content);
        } catch (e) {
          return null;
        }
      },

      syncToSupabase: async () => {
        const state = get();

        try {
          // Sync all journal entries
          for (const entry of state.entries) {
            // Entry is already encrypted, so we sync the encrypted content
            await syncJournalEntry({
              entry_date: new Date(entry.created_at)
                .toISOString()
                .split("T")[0],
              encrypted_content: entry.content,
              initialization_vector: "", // TODO: Extract IV from encrypted content
              is_locked: true,
            });
          }
        } catch (error) {
          console.error("[JournalStore] Sync failed:", error);
          // Don't throw - allow local-only operation
        }
      },
    }),
    {
      name: "journal-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
