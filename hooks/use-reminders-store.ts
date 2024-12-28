import { create } from "zustand";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

// Initialize Supabase client
const supabase = createClient();
interface Reminder {
  id: string;
  user_id: string;
  type: "Challenge" | "Event";
  reference_id: string;
  title: string;
  datetime: string;
  notified: boolean;
}

interface RemindersState {
  reminders: Reminder[];
  isLoading: boolean;
  error: string | null;
  setReminder: (reminder: Omit<Reminder, "id" | "notified">) => Promise<void>;
  removeReminder: (reminderId: string) => Promise<void>;
  fetchReminders: (userId: string) => Promise<void>;
}

export const useReminders = create<RemindersState>((set, get) => ({
  reminders: [],
  isLoading: false,
  error: null,

  setReminder: async (reminder) => {
    set({ isLoading: true, error: null });
    try {
      const { data: newReminder, error } = await supabase
        .from("Reminders")
        .insert([
          {
            ...reminder,
            type:
              reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1),
            notified: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        reminders: [...state.reminders, newReminder],
        isLoading: false,
      }));

      toast.success("Reminder set successfully");
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error("Failed to set reminder");
    }
  },

  removeReminder: async (reminderId) => {
    try {
      const { error } = await supabase
        .from("Reminders")
        .delete()
        .eq("id", reminderId);

      if (error) throw error;

      set((state) => ({
        reminders: state.reminders.filter((r) => r.id !== reminderId),
      }));

      toast.success("Reminder removed");
    } catch (error: any) {
      toast.error("Failed to remove reminder");
    }
  },

  fetchReminders: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const { data: reminders, error } = await supabase
        .from("Reminders")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      set({ reminders: reminders || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
