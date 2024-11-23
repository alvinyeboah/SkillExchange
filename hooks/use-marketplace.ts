import { create } from 'zustand';
import { getServices, createService } from '@/lib/api';

interface MarketplaceService {
  service_id: number;
  title: string;
  description: string;
  skillcoin_price: number;
  delivery_time: string;
  user: {
    user_id: number;
    username: string;
    name: string;
    avatar: string;
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
  createNewService: (serviceData: {
    title: string;
    description: string;
    skillcoinPrice: number;
    deliveryTime: string;
    category: string;
  }) => Promise<void>;
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
      set({ 
        services: response,
        filteredServices: response,
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createNewService: async (serviceData) => {
    set({ isLoading: true, error: null });
    try {
      await createService(serviceData);
      await get().fetchServices();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
    const { services, selectedCategory } = get();
    const filtered = filterServices(services, term, selectedCategory);
    set({ filteredServices: filtered });
  },

  setSelectedCategory: (category: string) => {
    set({ selectedCategory: category });
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
      service.category.toLowerCase() === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });
}
