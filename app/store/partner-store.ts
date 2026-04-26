import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PartnerLink {
  id: string;
  partnerId: string;
  partnerEmail: string;
  linkedAt: string;
}

interface PartnerState {
  linkedPartners: PartnerLink[];
  currentInviteCode: string | null;
  inviteCodeExpiry: string | null;
  addPartner: (partner: PartnerLink) => void;
  setLinkedPartners: (partners: PartnerLink[]) => void;
  removePartner: (partnerId: string) => void;
  setInviteCode: (code: string, expiry: string) => void;
  clearInviteCode: () => void;
  getLinkedPartners: () => PartnerLink[];
  syncToSupabase: () => Promise<void>;
}

export const usePartnerStore = create<PartnerState>()(
  persist(
    (set, get) => ({
      linkedPartners: [],
      currentInviteCode: null,
      inviteCodeExpiry: null,
      addPartner: (partner) => {
        set((state) => ({
          linkedPartners: state.linkedPartners.some(
            (existingPartner) => existingPartner.partnerId === partner.partnerId
          )
            ? state.linkedPartners.map((existingPartner) =>
                existingPartner.partnerId === partner.partnerId ? partner : existingPartner
              )
            : [...state.linkedPartners, partner],
        }));
      },

      setLinkedPartners: (partners) => {
        set({ linkedPartners: partners });
      },

      removePartner: (partnerId) => {
        set((state) => ({
          linkedPartners: state.linkedPartners.filter(
            (p) => p.partnerId !== partnerId
          ),
        }));
      },

      setInviteCode: (code, expiry) => {
        set({ currentInviteCode: code, inviteCodeExpiry: expiry });
      },

      clearInviteCode: () =>
        set({ currentInviteCode: null, inviteCodeExpiry: null }),

      getLinkedPartners: () => get().linkedPartners,

      syncToSupabase: async () => {
        try {
          // Partner links are written directly through the partner-linking hook
          // using authenticated Supabase requests. The persisted store is only a
          // local cache of those server-backed results.
        } catch (error) {
          console.error('[PartnerStore] Sync failed:', error);
          // Don't throw - allow local-only operation
        }
      },
    }),
    {
      name: 'partner-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
