import { create } from 'zustand';
import { getServices, createService, getServicesById } from '@/lib/api';
import { toast } from 'sonner';

interface MarketplaceService {
  service_id: number;
  title: string;
  description: string;
  skillcoin_price: number;
  delivery_time: string;
  user_id: number;
  user: {
    name: string;
    avatar_url: string;
    rating: number;
  };
  category: string;
}

interface MarketplaceState {
  services: MarketplaceService[];
  filteredServices: MarketplaceService[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  fetchServices: () => Promise<void>;
  fetchServiceById: (serviceId: string) => Promise<MarketplaceService | null>;
  createNewService: (serviceData: {
    title: string;
    description: string;
    skillcoinPrice: number;
    deliveryTime: string;
    category: string;
  }) => Promise<void>;
  requestService: (serviceId: number) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
}

export const useMarketplace = create<MarketplaceState>((set, get) => ({
  services: [],
  filteredServices: [],
  isLoading: false,
  error: null,
  searchTerm: '',
  selectedCategory: 'all',

  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getServices();
      if (!Array.isArray(response)) throw new Error('Unable to fetch services. Please try again later.');

      set({ 
        services: response,
        filteredServices: response,
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Service fetch failed: ${error.message}`);
    }
  },

  fetchServiceById: async (serviceId: string) => {
    set({ isLoading: true, error: null });
    try {
      const service = await getServicesById(serviceId);
      set({ isLoading: false });
      return service;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Service fetch failed: ${error.message}`);
      return null;
    }
  },

  createNewService: async (serviceData) => {
    set({ isLoading: true, error: null });
    try {
      const formattedServiceData = {
        ...serviceData,
        title: serviceData.title.charAt(0).toUpperCase() + serviceData.title.slice(1),
        category: serviceData.category.charAt(0).toUpperCase() + serviceData.category.slice(1),
      };
      await createService(formattedServiceData);
      await get().fetchServices();
      toast.success('Service created successfully!');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Service creation failed: ${error.message}`);
    }
  },

  requestService: async (serviceId: number) => {
    try {
      const response = await fetch(`/api/marketplace/${serviceId}/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to request service');
      }

      toast.success('Service requested successfully!');
    } catch (error: any) {
      toast.error(`Service request failed: ${error.message}`);
    }
  },

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
    const { services, selectedCategory } = get();
    const filtered = filterServices(services, term, selectedCategory);
    set({ filteredServices: filtered });
  },

  setSelectedCategory: (category: string) => {
    set({ selectedCategory: category.charAt(0).toUpperCase() + category.slice(1) });
    const { services, searchTerm } = get();
    const filtered = filterServices(services, searchTerm, category);
    set({ filteredServices: filtered });
  },
}));

function filterServices(
  services: MarketplaceService[], 
  searchTerm: string, 
  category: string
): MarketplaceService[] {
  return services.filter(service => {
    const matchesSearch = 
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      category === 'all' || 
      service.category?.toLowerCase() === category?.toLowerCase();

    return matchesSearch && matchesCategory;
  });
}
