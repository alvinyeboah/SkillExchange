"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useReminders } from "@/hooks/use-reminders-store";
import { toast } from "sonner";

export function ReminderCheck() {
  const { user } = useAuth();
  const { fetchReminders } = useReminders();

  useEffect(() => {
    if (user?.user_id) {
      fetchReminders(user?.user_id);
      const interval = setInterval(() => {
        fetchReminders(user?.user_id);
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [user?.user_id, fetchReminders]);

  return null;
}
