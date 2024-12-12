import { create } from 'zustand';
import { createCommunity, getCommunities } from '@/lib/api';

interface Community {
  community_id: number;
  name: string;
  description: string;
  creator_id: number;
}

interface CommunitiesState {
  communities: Community[];
  isLoading: boolean;
  error: string | null;
  fetchCommunities: () => Promise<void>;
  addCommunity: (communityData: any) => Promise<void>;
}

export const useCommunities = create<CommunitiesState>((set, get) => ({
  communities: [],
  isLoading: false,
  error: null,

  fetchCommunities: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getCommunities();
      set({ communities: response, isLoading: false });
    } catch (error: any) {
      set({ error: 'Failed to fetch communities', isLoading: false });
    }
  },

  addCommunity: async (communityData) => {
    set({ isLoading: true, error: null });
    try {
      await createCommunity(communityData);
      await get().fetchCommunities();
    } catch (error: any) {
      set({ error: 'Failed to add community', isLoading: false });
    }
  },
})); 