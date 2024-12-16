import { create } from 'zustand';

interface User {
  user_id: number;
  username: string;
  name: string;
  skillcoins: number;
  avatar_url: string;
  rating: string;
  avg_rating: number | null;
}

interface Challenge {
  challenge_id: number;
  title: string;
  difficulty: string;
  category: string;
  skills: string;
  reward_skillcoins: number;
  start_date: string;
  end_date: string;
}

interface CommunityStats {
  activeUsers: Array<{ count: number }>;
  topProviders: Array<User>;
  topSkills: Array<{
    skill: string;
    usage_count: number;
  }>;
  totalSkillcoins: number;
  rankedUsers: Array<User>;
  availableChallenges: Array<Challenge>;
}

interface CommunityStore {
  communityStats: CommunityStats;
  isLoading: boolean;
  error: string | null;
  fetchCommunityStats: () => Promise<void>;
}

export const useCommunityStore = create<CommunityStore>((set) => ({
  communityStats: {
    activeUsers: [],
    topProviders: [],
    topSkills: [],
    totalSkillcoins: 0,
    rankedUsers: [],
    availableChallenges: []
  },
  isLoading: false,
  error: null,
  fetchCommunityStats: async () => {
    set({ isLoading: true });
    try {
      // Fetch users and challenges in parallel
      const [statsResponse, challengesResponse] = await Promise.all([
        fetch('/api/community/stats'),
        fetch('/api/challenges')
      ]);

      const statsData = await statsResponse.json();
      const challengesData = await challengesResponse.json();

      // Calculate total skillcoins from topProviders
      const totalSkillcoins = statsData.topProviders.reduce(
        (total: number, user: User) => total + (user.skillcoins || 0),
        0
      );

      // Extract and count skills from challenges
      const skillsMap = new Map<string, number>();
      challengesData.forEach((challenge: Challenge) => {
        challenge.skills.split(',').forEach(skill => {
          const trimmedSkill = skill.trim();
          skillsMap.set(trimmedSkill, (skillsMap.get(trimmedSkill) || 0) + 1);
        });
      });

      // Convert skills map to sorted array
      const topSkills = Array.from(skillsMap.entries())
        .map(([skill, usage_count]) => ({ skill, usage_count }))
        .sort((a, b) => b.usage_count - a.usage_count);

      // Sort users by skillcoins
      const rankedUsers = [...statsData.topProviders].sort((a, b) => 
        (b.skillcoins || 0) - (a.skillcoins || 0)
      );

      set({
        communityStats: {
          activeUsers: statsData.activeUsers,
          topProviders: statsData.topProviders,
          totalSkillcoins,
          topSkills,
          rankedUsers,
          availableChallenges: challengesData
        },
        error: null
      });
    } catch (err) {
      set({ 
        error: 'Failed to fetch community stats',
        communityStats: {
          activeUsers: [],
          topProviders: [],
          topSkills: [],
          totalSkillcoins: 0,
          rankedUsers: [],
          availableChallenges: []
        }
      });
      console.error('Error fetching community stats:', err);
    } finally {
      set({ isLoading: false });
    }
  }
}));