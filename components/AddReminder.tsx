import { useState } from 'react';
import { useReminders } from '@/hooks/use-reminders-store';
import { toast } from 'sonner';

export function AddReminder() {
  const { setReminder } = useReminders();
  const [title, setTitle] = useState('');
  const [datetime, setDatetime] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setReminder({
        userId: 1, // Replace with actual user ID
        type: 'event', // or 'challenge'
        referenceId: 0, // Replace with actual reference ID if needed
        title,
        datetime,
      });
      setTitle('');
      setDatetime('');
      toast.success('Reminder added successfully!');
    } catch (error) {
      toast.error('Failed to add reminder');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Reminder Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="datetime-local"
        value={datetime}
        onChange={(e) => setDatetime(e.target.value)}
        required
      />
      <button type="submit">Add Reminder</button>
    </form>
  );
}
