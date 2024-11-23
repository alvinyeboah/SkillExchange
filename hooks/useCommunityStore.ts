import { create } from 'zustand'

interface CommunityStats {
  activeUsers: Array<{
    id: string;
    username: string;
    avatar: string;
  }>;
}

interface CommunityStore {
  communityStats: CommunityStats;
  isLoading: boolean;
  error: string | null;
  fetchCommunityStats: () => Promise<void>;
}

export const useCommunityStore = create<CommunityStore>((set) => ({
  communityStats: { activeUsers: [] },
  isLoading: false,
  error: null,
  fetchCommunityStats: async () => {
    set({ isLoading: true });
    try {
      // Replace with your actual API call
      const response = await fetch('/api/community-stats');
      const data = await response.json();
      set({ communityStats: data, error: null });
    } catch (err) {
      set({ error: 'Failed to fetch community stats' });
    } finally {
      set({ isLoading: false });
    }
  }
})); 