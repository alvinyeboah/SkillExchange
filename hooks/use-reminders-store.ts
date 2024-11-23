import { create } from 'zustand';
import { toast } from 'sonner';

interface Reminder {
  id: number;
  userId: number;
  type: 'challenge' | 'event';
  referenceId: number;
  title: string;
  datetime: string;
  notified: boolean;
}

interface RemindersState {
  reminders: Reminder[];
  isLoading: boolean;
  error: string | null;
  setReminder: (reminder: Omit<Reminder, 'id' | 'notified'>) => Promise<void>;
  removeReminder: (reminderId: number) => Promise<void>;
  fetchReminders: (userId: number) => Promise<void>;
}

export const useReminders = create<RemindersState>((set, get) => ({
  reminders: [],
  isLoading: false,
  error: null,

  setReminder: async (reminder) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reminder),
      });

      if (!response.ok) throw new Error('Failed to set reminder');
      
      const newReminder = await response.json();
      set((state) => ({
        reminders: [...state.reminders, newReminder],
        isLoading: false,
      }));
      
      toast.success('Reminder set successfully');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to set reminder');
    }
  },

  removeReminder: async (reminderId) => {
    try {
      await fetch(`/api/reminders/${reminderId}`, {
        method: 'DELETE',
      });
      
      set((state) => ({
        reminders: state.reminders.filter((r) => r.id !== reminderId),
      }));
      
      toast.success('Reminder removed');
    } catch (error: any) {
      toast.error('Failed to remove reminder');
    }
  },

  fetchReminders: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/reminders?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch reminders');
      
      const reminders = await response.json();
      set({ reminders, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
})); 