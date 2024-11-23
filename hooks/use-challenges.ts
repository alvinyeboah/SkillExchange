import { create } from 'zustand';
import { getChallenges } from '@/lib/api';

interface Challenge {
  challenge_id: string;
  title: string;
  description: string;
  reward: number;
  participants: number;
  timeLeft: string;
}

interface ChallengesState {
  challenges: Challenge[];
  isLoading: boolean;
  error: string | null;
  fetchChallenges: () => Promise<void>;
}

export const useChallenges = create<ChallengesState>((set) => ({
  challenges: [],
  isLoading: false,
  error: null,

  fetchChallenges: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getChallenges();
      set({ 
        challenges: response,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: 'Failed to fetch challenges', 
        isLoading: false 
      });
    }
  },
})); 