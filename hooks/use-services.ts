import { create } from 'zustand';
import { getServices } from '@/lib/api';

interface Service {
  service_id: string;
  title: string;
  description: string;
  skillcoin_price: number;
  provider_name: string;
  avatar_url?: string;
}

interface ServicesState {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
}

export const useServices = create<ServicesState>((set) => ({
  services: [],
  isLoading: false,
  error: null,

  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getServices();
      set({ 
        services: response,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: 'Failed to fetch services', 
        isLoading: false 
      });
    }
  },
}));