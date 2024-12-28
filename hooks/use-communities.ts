import { create } from 'zustand';
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// Base community interface for creating new communities
interface CreateCommunityDTO {
  name: string;
  description: string;
  creator_id: string;
}

// Full community interface including all fields
interface Community extends CreateCommunityDTO {
  community_id: number;
  created_at: string;
  updated_at: string;
}

// Define database response types for better error handling
type DbResult<T> = {
  data: T | null;
  error: Error | null;
};

interface CommunitiesState {
  communities: Community[];
  isLoading: boolean;
  error: string | null;
  fetchCommunities: () => Promise<void>;
  addCommunity: (communityData: CreateCommunityDTO) => Promise<void>;
  searchCommunities: (searchTerm: string) => Promise<void>;
}

export const useCommunities = create<CommunitiesState>((set, get) => ({
  communities: [],
  isLoading: false,
  error: null,

  fetchCommunities: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: communities, error } = await supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      set({ 
        communities: communities as Community[], 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch communities', 
        isLoading: false 
      });
    }
  },

  addCommunity: async (communityData: CreateCommunityDTO) => {
    set({ isLoading: true, error: null });
    try {
      // Validate required fields
      if (!communityData.name || !communityData.creator_id) {
        throw new Error('Name and creator ID are required');
      }

      const { data: newCommunity, error } = await supabase
        .from('communities')
        .insert([{
          name: communityData.name,
          description: communityData.description,
          creator_id: communityData.creator_id,
        }])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Update local state with the new community
      set((state) => ({
        communities: [newCommunity as Community, ...state.communities],
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add community', 
        isLoading: false 
      });
    }
  },

  searchCommunities: async (searchTerm: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: communities, error } = await supabase
        .from('communities')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      set({ 
        communities: communities as Community[], 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to search communities', 
        isLoading: false 
      });
    }
  },
}));