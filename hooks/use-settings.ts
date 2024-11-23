import { create } from 'zustand';

interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  notificationFrequency: 'realtime' | 'daily' | 'weekly';
  language: string;
  profileVisibility: 'public' | 'private' | 'friends';
  showOnlineStatus: boolean;
  allowMessagesFromStrangers: boolean;
  dataUsageConsent: boolean;
}

interface SettingsState {
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;
  fetchSettings: (userId: number) => Promise<void>;
  updateSettings: (userId: number, settings: Partial<UserSettings>) => Promise<void>;
}

export const useSettings = create<SettingsState>((set) => ({
  settings: null,
  isLoading: false,
  error: null,

  fetchSettings: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/settings?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      set({ settings: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateSettings: async (userId: number, newSettings: Partial<UserSettings>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...newSettings }),
      });
      
      if (!response.ok) throw new Error('Failed to update settings');
      
      set((state) => ({
        settings: state.settings ? { ...state.settings, ...newSettings } : null,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
})); 