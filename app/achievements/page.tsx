'use client'
import { AchievementsList } from '@/components/achievements/achievements-list';
import { useAuth } from '@/hooks/use-auth';

export default function AchievementsPage() {
  const { user } = useAuth();

  if (!user) return <div>Please log in to view your achievements.</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Achievements</h1>
      <AchievementsList userId={user.id} />
    </div>
  );
} 