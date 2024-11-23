import { create } from 'zustand';
import { fetchChallenges } from '@/lib/api';

interface UserChallenge {
  challenge_id: number;
  title: string;
  status: 'active' | 'completed';
  progress: number;
  description: string;
  reward_skillcoins: number;
  start_date: string;
  end_date: string;
}

interface ChallengesState {
  activeChallenges: UserChallenge[];
  completedChallenges: UserChallenge[];
  isLoading: boolean;
  error: string | null;
  fetchUserChallenges: (userId: number) => Promise<void>;
}

export const useChallenges = create<ChallengesState>((set) => ({
  activeChallenges: [],
  completedChallenges: [],
  isLoading: false,
  error: null,

  fetchUserChallenges: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchChallenges(userId);
      set({
        activeChallenges: response.filter((c: UserChallenge) => c.status === 'active'),
        completedChallenges: response.filter((c: UserChallenge) => c.status === 'completed'),
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
})); 