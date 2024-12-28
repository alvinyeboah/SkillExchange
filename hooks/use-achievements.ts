import { create } from 'zustand';
import { earnAchievement, getUserAchievements } from '@/lib/api';

interface Achievement {
  achievement_id: number;
  title: string;
  description: string;
  skillcoins_reward: number;
}

interface AchievementsState {
  achievements: Achievement[];
  isLoading: boolean;
  error: string | null;
  fetchAchievements: (userId: string) => Promise<void>;
  earnAchievement: (achievementData: any) => Promise<void>;
}

export const useAchievements = create<AchievementsState>((set) => ({
  achievements: [],
  isLoading: false,
  error: null,

  fetchAchievements: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getUserAchievements(userId);
      set({ achievements: response, isLoading: false });
    } catch (error: any) {
      set({ error: 'Failed to fetch achievements', isLoading: false });
    }
  },

  earnAchievement: async (achievementData) => {
    set({ isLoading: true, error: null });
    try {
      await earnAchievement(achievementData);
    } catch (error: any) {
      set({ error: 'Failed to earn achievement', isLoading: false });
    }
  }
}));