import { create } from 'zustand';
import { getDashboardStats } from '@/lib/api';
import { User } from './use-auth';

interface DashboardStats {
  total_users: number;
  total_services: number;
  active_challenges: number;
  popular_skills: Array<{
    skill: string;
    usage_count: number;
  }>;
  leaderboard: User[];
}

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboardStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getDashboardStats();
      set({ 
        stats: response,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: 'Failed to fetch dashboard stats', 
        isLoading: false 
      });
    }
  },
})); 