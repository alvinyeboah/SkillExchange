import { create } from 'zustand';
import { fetchServices, createService } from '@/lib/api';

interface UserService {
  service_id: number;
  title: string;
  description: string;
  rating: number;
  skillcoin_price: number;
  delivery_time: string;
}

interface ServicesState {
  services: UserService[];
  isLoading: boolean;
  error: string | null;
  fetchUserServices: (userId: number) => Promise<void>;
  createNewService: (serviceData: {
    title: string;
    description: string;
    skillcoinPrice: number;
    deliveryTime: string;
  }) => Promise<void>;
}

export const useServices = create<ServicesState>((set) => ({
  services: [],
  isLoading: false,
  error: null,

  fetchUserServices: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchServices(userId);
      set({ services: response, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createNewService: async (serviceData) => {
    set({ isLoading: true, error: null });
    try {
      await createService(serviceData);
      set((state) => ({
        services: [...state.services, serviceData as any],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));