import { create } from 'zustand';

interface DashboardStats {
  skillcoins: number;
  skillcoins_earned_this_week: number;
  active_services: number;
  completed_challenges: number;
  my_services: Array<{
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
  }>;
  requested_services: Array<{
    id: number;
    title: string;
    description: string;
    status: string;
    price: number;
  }>;
  participating_challenges: Array<{
    id: number;
    title: string;
    description: string;
    status: string;
    reward: number;
  }>;
}

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboardStats: (id: number) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchDashboardStats: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      // Fetch user stats
      const userResponse = await fetch(`/api/users/${id}`);
      const userData = await userResponse.json();

      // Fetch my services
      const servicesResponse = await fetch(`/api/marketplace?user_id=${id}`);
      const myServices = await servicesResponse.json();

      // Fetch requested services
      const requestsResponse = await fetch(`/api/service-requests?requester_id=${id}`);
      const requestedServices = await requestsResponse.json();

      // Fetch participating challenges
      const challengesResponse = await fetch(`/api/challenges/participate?user_id=${id}`);
      const participatingChallenges = await challengesResponse.json();

      set({
        stats: {
          skillcoins: userData.skillcoins,
          skillcoins_earned_this_week: userData.skillcoins_earned_this_week,
          active_services: userData.active_services,
          completed_challenges: userData.completed_challenges,
          my_services: myServices.map((service: any) => ({
            id: service.service_id,
            title: service.title,
            description: service.description,
            status: service.status,
            price: service.skillcoin_price
          })),
          requested_services: requestedServices.map((request: any) => ({
            id: request.id,
            title: request.title,
            description: request.description,
            status: request.status,
            price: request.price
          })),
          participating_challenges: participatingChallenges.map((challenge: any) => ({
            id: challenge.id,
            title: challenge.title,
            description: challenge.description,
            reward: challenge.reward_skillcoins
          }))
        },
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