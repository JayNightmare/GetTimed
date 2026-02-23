import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface DraftState {
    jobTypeId: number | null;
    startTime: number | null;
    duration: number | null;
    description: string;
}

interface DraftStore {
    draft: DraftState | null;
    setDraft: (draft: DraftState) => void;
    clearDraft: () => void;
    updateDraft: (update: Partial<DraftState>) => void;
}

export const useDraftStore = create<DraftStore>()(
    persist(
        (set) => ({
            draft: null,
            setDraft: (draft) => set({ draft }),
            clearDraft: () => set({ draft: null }),
            updateDraft: (update) =>
                set((state) => ({
                    draft: state.draft
                        ? { ...state.draft, ...update }
                        : {
                              jobTypeId: null,
                              startTime: null,
                              duration: null,
                              description: "",
                              ...update,
                          },
                })),
        }),
        {
            name: "gettimed-draft-storage",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
