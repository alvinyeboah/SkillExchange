import { create } from 'zustand';
import { toast } from 'sonner';

interface Challenge {
  challenge_id: number;
  title: string;
  description?: string;
  reward_skillcoins: number;
  difficulty?: string;
  category?: string;
  start_date: string;
  end_date: string;
  participants?: number;
  progress?: number;
  skills?: string[] | string;  // Updated to handle both string and array
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
  challenges: Challenge[];
  activeChallenges: Challenge[];
  upcomingChallenges: Challenge[];
  completedChallenges: Challenge[];
  isLoading: boolean;
  error: string | null;
  setChallenges: (challenges: Challenge[]) => void;
  fetchChallenges: () => Promise<void>;
  createChallenge: (challenge: Omit<Challenge, 'challenge_id'>) => Promise<void>;
  participateInChallenge: (challengeId: number, userId: number) => Promise<void>;
}

// Helper function to normalize skills string to array
const normalizeSkills = (skills: string | string[] | undefined): string[] => {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  // Handle both comma-separated formats: with or without spaces
  return skills.split(/\s*,\s*/);
};

// Helper function to determine challenge status based on dates
const getChallengeStatus = (startDate: string, endDate: string) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return 'upcoming';
  if (now > end) return 'completed';
  return 'active';
};

// Helper function to sort challenges by start date
const sortByStartDate = (a: Challenge, b: Challenge) => 
  new Date(a.start_date).getTime() - new Date(b.start_date).getTime();

export const useChallengesStore = create<ChallengesState>((set, get) => ({
  challenges: [],
  activeChallenges: [],
  upcomingChallenges: [],
  completedChallenges: [],
  isLoading: false,
  error: null,

  setChallenges: (challenges) => {
    // Filter and sort challenges based on their dates
    const active: Challenge[] = [];
    const upcoming: Challenge[] = [];
    const completed: Challenge[] = [];

    challenges.forEach(challenge => {
      const status = getChallengeStatus(challenge.start_date, challenge.end_date);
      // Normalize skills to array format
      challenge.skills = normalizeSkills(challenge.skills);
      
      switch (status) {
        case 'active':
          active.push(challenge);
          break;
        case 'upcoming':
          upcoming.push(challenge);
          break;
        case 'completed':
          completed.push(challenge);
          break;
      }
    });

    set({
      challenges,
      activeChallenges: active.sort(sortByStartDate),
      upcomingChallenges: upcoming.sort(sortByStartDate),
      completedChallenges: completed.sort(sortByStartDate)
    });
  },

  fetchChallenges: async () => {
    const { setChallenges } = get();
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/challenges');
      if (!response.ok) {
        throw new Error('Failed to fetch challenges');
      }

      const challenges: Challenge[] = await response.json();
      setChallenges(challenges);
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message, 
        isLoading: false,
        challenges: [],
        activeChallenges: [],
        upcomingChallenges: [],
        completedChallenges: []
      });
      toast.error(`Failed to fetch challenges: ${error.message}`);
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
        body: JSON.stringify({
          ...challenge,
          // Join skills array with commas (no spaces) to match API format
          skills: Array.isArray(challenge.skills) ? challenge.skills.join(',') : challenge.skills
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create challenge');
      }

      const newChallenge: Challenge = await response.json();
      const { challenges } = get();
      const updatedChallenges = [...challenges, newChallenge];
      
      get().setChallenges(updatedChallenges);
      set({ isLoading: false });
      toast.success('Challenge created successfully');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Failed to create challenge: ${error.message}`);
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to join challenge');
      }

      // Refresh challenges to get updated participation status
      await get().fetchChallenges();
      toast.success('Successfully joined the challenge');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  },
}));