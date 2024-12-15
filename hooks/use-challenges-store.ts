import { create } from 'zustand';
import { toast } from 'sonner';

interface User {
  id: number;
  username: string;
  avatar_url: string;
}

interface Participant {
  challenge_id: number;
  user_id: number;
  progress: number;
  joined_at: string;
}

// Base challenge type for creation
interface BaseChallenge {
  title: string;
  description?: string;
  reward_skillcoins: number;
  difficulty?: string;
  category?: string;
  start_date: string;
  end_date: string;
  skills?: string[] | string;
}

// Extended challenge type with additional data
interface Challenge extends BaseChallenge {
  challenge_id: number;
  participantsCount: number;
  progress?: number;
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
  createChallenge: (challenge: BaseChallenge) => Promise<void>;
  participateInChallenge: (challengeId: number, userId: number) => Promise<void>;
}

const normalizeSkills = (skills: string | string[] | undefined): string[] => {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  return skills.split(/\s*,\s*/);
};

const getChallengeStatus = (startDate: string, endDate: string) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return 'upcoming';
  if (now > end) return 'completed';
  return 'active';
};

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
    const active: Challenge[] = [];
    const upcoming: Challenge[] = [];
    const completed: Challenge[] = [];

    challenges.forEach(challenge => {
      const status = getChallengeStatus(challenge.start_date, challenge.end_date);
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
      // Fetch all data in parallel
      const [challengesResponse, participantsResponse, usersResponse] = await Promise.all([
        fetch('/api/challenges'),
        fetch('/api/challenges/participate'),
        fetch('/api/users')
      ]);

      if (!challengesResponse.ok || !participantsResponse.ok || !usersResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [challenges, participants, users]: [BaseChallenge[], Participant[], User[]] = await Promise.all([
        challengesResponse.json(),
        participantsResponse.json(),
        usersResponse.json()
      ]);

      // Create a map of users for quick lookup
      const userMap = new Map(users.map(user => [user.id, user]));

      // Process challenges with participant data
      const processedChallenges: Challenge[] = challenges.map(challenge => {
        // Get participants for this challenge
        const challengeParticipants = participants.filter(
          p => p.challenge_id === (challenge as Challenge).challenge_id
        );

        // Get unique participants count
        const uniqueParticipants = new Set(challengeParticipants.map(p => p.user_id));
        
        // Get top 3 participants sorted by progress
        const topParticipants = challengeParticipants
          .sort((a, b) => b.progress - a.progress)
          .slice(0, 3)
          .map(p => {
            const user = userMap.get(p.user_id);
            return {
              name: user?.username || 'Unknown User',
              avatar: user?.avatar_url || '',
              progress: p.progress
            };
          });

        return {
          ...challenge,
          challenge_id: (challenge as Challenge).challenge_id,
          participantsCount: uniqueParticipants.size,
          topParticipants
        };
      });

      setChallenges(processedChallenges);
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

  createChallenge: async (challenge: BaseChallenge) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...challenge,
          skills: Array.isArray(challenge.skills) ? challenge.skills.join(',') : challenge.skills
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create challenge');
      }

      await get().fetchChallenges();
      set({ isLoading: false });

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

      await get().fetchChallenges();
      toast.success('Successfully joined the challenge');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  },
}));