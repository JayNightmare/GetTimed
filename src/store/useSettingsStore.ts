import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SettingsState {
    weeklyQuotaHours: number;
    dailyReminderEnabled: boolean;
    dailyReminderTime: string; // HH:mm format
}

interface SettingsStore {
    settings: SettingsState;
    updateSettings: (update: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            settings: {
                weeklyQuotaHours: 40,
                dailyReminderEnabled: true,
                dailyReminderTime: "17:00",
            },
            updateSettings: (update) =>
                set((state) => ({
                    settings: { ...state.settings, ...update },
                })),
        }),
        {
            name: "gettimed-settings-storage",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
