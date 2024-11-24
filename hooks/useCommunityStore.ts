import { create } from 'zustand'

interface CommunityStats {
  activeUsers: Array<{
    id: string;
    username: string;
    avatar: string;
  }>;
  topProviders: Array<{
    id: string;
    username: string;
    avatar_url: string;
    skill: string;
    avg_rating: number;
    completedTasks:number;
  }>;
}

interface CommunityStore {
  communityStats: CommunityStats;
  isLoading: boolean;
  error: string | null;
  fetchCommunityStats: () => Promise<void>;
}

export const useCommunityStore = create<CommunityStore>((set) => ({
  communityStats: { activeUsers: [], topProviders: [] },
  isLoading: false,
  error: null,
  fetchCommunityStats: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/community/stats');
      const data = await response.json();
      set({ communityStats: data, error: null });
    } catch (err) {
      set({ error: 'Failed to fetch community stats' });
    } finally {
      set({ isLoading: false });
    }
  }
})); 