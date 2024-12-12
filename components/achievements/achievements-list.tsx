'use client'
import { useEffect } from 'react';
import { useAchievements } from '@/hooks/use-achievements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface AchievementsListProps {
  userId: number;
}

export function AchievementsList({ userId }: AchievementsListProps) {
  const { achievements, isLoading, error, fetchAchievements } = useAchievements();

  useEffect(() => {
    fetchAchievements(userId);
  }, [userId, fetchAchievements]);

  if (isLoading) {
    return <Skeleton className="w-full h-48" />;
  }

  if (error) {
    return <div className="text-red-500">Failed to load achievements</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((achievement) => (
        <Card key={achievement.achievement_id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {achievement.title}
              <Badge variant="secondary">
                +{achievement.skillcoins_reward} SkillCoins
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {achievement.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 