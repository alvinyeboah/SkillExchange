import { create } from "zustand";
import { getServices, createService } from "@/lib/api";

interface Service {
  service_id: any;
  title: string;
  description: string;
  skillcoin_price: number;
  provider_name: string;
  user_id: any;
  avatar_url?: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

interface ServicesState {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
  addService: (serviceData: any) => Promise<void>;
}

export const useServices = create<ServicesState>((set, get) => ({
  services: [],
  isLoading: false,
  error: null,

  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getServices();
      set({ services: response, isLoading: false });
    } catch (error: any) {
      set({ error: "Failed to fetch services", isLoading: false });
    }
  },

  addService: async (serviceData) => {
    set({ isLoading: true, error: null });
    try {
      await createService(serviceData);
      await get().fetchServices();
    } catch (error: any) {
      set({ error: "Failed to add service", isLoading: false });
    }
  },
}));
