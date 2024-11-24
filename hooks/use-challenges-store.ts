import { create } from 'zustand';
import { toast } from 'sonner';
import { ChallengeStatus } from '@/lib/constants';

interface Challenge {
  challenge_id: number;
  title: string;
  description: string;
  reward_skillcoins: number;
  difficulty: string;
  category: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'upcoming' | 'completed';
  participants?: number;
  progress?: number;
  skills: string[];
  winner?: {
    name: string;
    avatar: string;
  };
  topParticipants?: {
    name: string;
    avatar: string;
    progress: number;
  }[];
}

interface ChallengesState {
  activeChallenges: Challenge[];
  upcomingChallenges: Challenge[];
  completedChallenges: Challenge[];
  isLoading: boolean;
  error: string | null;
  fetchChallenges: () => Promise<void>;
  createChallenge: (challenge: Omit<Challenge, 'challenge_id'>) => Promise<void>;
  participateInChallenge: (challengeId: number, userId: number) => Promise<void>;
}

export const useChallengesStore = create<ChallengesState>((set, get) => ({
  activeChallenges: [],
  upcomingChallenges: [],
  completedChallenges: [],
  isLoading: false,
  error: null,

  fetchChallenges: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/challenges');
      if (!response.ok) throw new Error('Unable to fetch challenges. Please try again later.');
      
      const challenges: Challenge[] = await response.json();
      
      set({
        activeChallenges: challenges.filter(c => c.status === 'active'),
        upcomingChallenges: challenges.filter(c => c.status === 'upcoming'),
        completedChallenges: challenges.filter(c => c.status === 'completed'),
        isLoading: false
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Challenges fetch failed: ${error.message}`);
    }
  },

  createChallenge: async (challenge) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(challenge),
      });

      if (!response.ok) throw new Error('Failed to create challenge');
      
      const newChallenge = await response.json();
      const { upcomingChallenges } = get();
      
      set({
        upcomingChallenges: [...upcomingChallenges, newChallenge],
        isLoading: false
      });
      
      toast.success('Challenge created successfully');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to create challenge');
    }
  },

  participateInChallenge: async (challengeId: number, userId: number) => {
    try {
      const response = await fetch('/api/challenges/participate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ challenge_id: challengeId, user_id: userId }),
      });

      if (!response.ok) throw new Error('Failed to join challenge');
      
      toast.success('Successfully joined the challenge');
      await get().fetchChallenges(); // Refresh challenges
    } catch (error: any) {
      toast.error('Failed to join challenge');
      throw error;
    }
  },
})); 