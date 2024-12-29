import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export interface Notification {
  notification_id: number;
  user_id: string;
  title: string;
  message: string;
  type: "email" | "push" | "sms";
  status: "unread" | "read";
  created_at: string;
  reference_id?: number;
  reference_type?: string;
}

interface NotificationsState {
  notifications: Notification[];
  reminders: any[]; // Using existing reminder type
  isLoading: boolean;
  error: string | null;
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  getUnreadCount: () => number;
}

export const useNotifications = create<NotificationsState>((set, get) => ({
  notifications: [],
  reminders: [],
  isLoading: false,
  error: null,

  fetchNotifications: async (userId: string) => {
    set({ isLoading: true });
    try {
      const [{ data: notifications }, { data: reminders }] = await Promise.all([
        supabase
          .from("Notifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
        supabase
          .from("Reminders")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
      ]);

      set({
        notifications: notifications || [],
        reminders: reminders || [],
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        isLoading: false,
      });
    }
  },

  markAsRead: async (notificationId: number) => {
    try {
      const { error } = await supabase
        .from("Notifications")
        .update({ status: "read" })
        .eq("notification_id", notificationId);

      if (error) throw error;

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.notification_id === notificationId ? { ...n, status: "read" } : n
        ),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  },

  markAllAsRead: async (userId: string) => {
    try {
      const { error } = await supabase
        .from("Notifications")
        .update({ status: "read" })
        .eq("user_id", userId)
        .eq("status", "unread");

      if (error) throw error;

      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          status: "read",
        })),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  },

  getUnreadCount: () => {
    const state = get();
    return (
      state.notifications.filter((n) => n.status === "unread").length +
      state.reminders.filter((r) => !r.notified).length
    );
  },
}));
