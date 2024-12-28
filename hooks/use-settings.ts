import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";

// Create Supabase client
const supabase = createClient();

// Types matching the database schema
type NotificationType = "email" | "push" | "sms";
type NotificationFrequency = "realtime" | "daily" | "weekly";
type ProfileVisibility = "public" | "private" | "friends";

interface UserSettings {
  setting_id: number;
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  notification_frequency: NotificationFrequency;
  language: string;
  profile_visibility: ProfileVisibility;
  show_online_status: boolean;
  allow_messages_from_strangers: boolean;
  data_usage_consent: boolean;
  created_at: string;
  updated_at: string;
}

interface SettingsState {
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;
  fetchSettings: (userId: string) => Promise<void>;
  updateSettings: (
    userId: string,
    settings: Partial<
      Omit<UserSettings, "setting_id" | "user_id" | "created_at" | "updated_at">
    >
  ) => Promise<void>;
}

export const useSettings = create<SettingsState>((set) => ({
  settings: null,
  isLoading: false,
  error: null,

  fetchSettings: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      // First try to get existing settings
      let { data, error } = await supabase
        .from("UserSettings")
        .select("*")
        .eq("user_id", userId)
        .single();

      // If no settings exist, create default settings
      if (error?.code === "PGRST116") {
        // This is the "no rows returned" error code
        const defaultSettings = {
          user_id: userId,
          email_notifications: true,
          push_notifications: true,
          sms_notifications: false,
          notification_frequency: "realtime" as const,
          language: "en",
          profile_visibility: "public" as const,
          show_online_status: true,
          allow_messages_from_strangers: true,
          data_usage_consent: false,
        };

        const { data: newData, error: insertError } = await supabase
          .from("UserSettings")
          .insert(defaultSettings)
          .select()
          .single();

        if (insertError) throw insertError;
        data = newData;
      } else if (error) {
        throw error;
      }

      set({ settings: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateSettings: async (
    userId: string,
    newSettings: Partial<
      Omit<UserSettings, "setting_id" | "user_id" | "created_at" | "updated_at">
    >
  ) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("UserSettings")
        .update({
          ...newSettings,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        settings: data,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
