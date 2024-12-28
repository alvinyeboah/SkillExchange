import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface MarketplaceService {
  service_id: number;
  title: string;
  description: string;
  skillcoin_price: number;
  delivery_time: number;
  user_id: string;
  user: {
    name: string;
    avatar_url: string;
    rating: number;
  };
  category: string;
  status: string;
  tags?: string;
  requirements?: string;
  revisions: number;
}

interface MarketplaceState {
  services: MarketplaceService[];
  filteredServices: MarketplaceService[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  fetchServices: () => Promise<void>;
  fetchServiceById: (serviceId: number) => Promise<MarketplaceService | null>;
  createNewService: (serviceData: {
    title: string;
    description: string;
    skillcoinPrice: number;
    deliveryTime: number;
    category: string;
    tags?: string;
    requirements?: string;
    revisions?: number;
    user_id?: string;
  }) => Promise<void>;
  requestService: (serviceId: number) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  editService: (
    serviceId: number,
    serviceData: {
      title?: string;
      description?: string;
      skillcoinPrice?: number;
      deliveryTime?: number;
      category?: string;
      tags?: string;
      requirements?: string;
      revisions?: number;
    }
  ) => Promise<void>;
}

export const useMarketplace = create<MarketplaceState>((set, get) => ({
  services: [],
  filteredServices: [],
  isLoading: false,
  error: null,
  searchTerm: "",
  selectedCategory: "all",

  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      const { data: services, error } = await supabase
        .from("Services")
        .select(
          `
          service_id,
          title,
          description,
          skillcoin_price,
          delivery_time,
          user_id,
          category,
          status,
          tags,
          requirements,
          revisions,
          user:Users!Services_user_id_fkey (
            name,
            avatar_url,
            rating
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      set({
        services: services as any,
        filteredServices: services as any,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchServiceById: async (serviceId: number) => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      const { data: service, error } = await supabase
        .from("Services")
        .select(
          `
          service_id,
          title,
          description,
          skillcoin_price,
          delivery_time,
          user_id,
          category,
          status,
          tags,
          requirements,
          revisions,
          user:Users!Services_user_id_fkey (
            name,
            avatar_url,
            rating
          )
        `
        )
        .eq("service_id", serviceId)
        .single();

      if (error) throw error;

      set({ isLoading: false });
      return service as any;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  createNewService: async (serviceData) => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();

      // Use provided user_id or get current user's ID
      let userId = serviceData.user_id;
      if (!userId) {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error("User not authenticated");
        userId = user?.id;
      }

      const formattedServiceData = {
        title:
          serviceData.title.charAt(0).toUpperCase() +
          serviceData.title.slice(1),
        description: serviceData.description,
        skillcoin_price: serviceData.skillcoinPrice,
        delivery_time: serviceData.deliveryTime,
        category:
          serviceData.category.charAt(0).toUpperCase() +
          serviceData.category.slice(1),
        tags: serviceData.tags,
        requirements: serviceData.requirements,
        revisions: serviceData.revisions ?? 1,
        user_id: userId,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabase
        .from("Services")
        .insert(formattedServiceData);

      if (insertError) throw insertError;

      await get().fetchServices();
      toast.success("Service created successfully!");
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Service creation failed: ${error.message}`);
    }
  },

  requestService: async (serviceId: number) => {
    try {
      const supabase = createClient();

      // Get the current user's ID
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.from("ServiceRequests").insert({
        service_id: serviceId,
        requester_id: user?.id,
        provider_id: null,
        status: "pending",
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast.success("Service requested successfully!");
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
    set({
      selectedCategory: category.charAt(0).toUpperCase() + category.slice(1),
    });
    const { services, searchTerm } = get();
    const filtered = filterServices(services, searchTerm, category);
    set({ filteredServices: filtered });
  },

  editService: async (serviceId, serviceData) => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();

      // Get the current user's ID
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("User not authenticated");

      const formattedServiceData = {
        ...(serviceData.title && {
          title:
            serviceData.title.charAt(0).toUpperCase() +
            serviceData.title.slice(1),
        }),
        ...(serviceData.description && {
          description: serviceData.description,
        }),
        ...(serviceData.skillcoinPrice && {
          skillcoin_price: serviceData.skillcoinPrice,
        }),
        ...(serviceData.deliveryTime && {
          delivery_time: serviceData.deliveryTime,
        }),
        ...(serviceData.category && {
          category:
            serviceData.category.charAt(0).toUpperCase() +
            serviceData.category.slice(1),
        }),
        ...(serviceData.tags && { tags: serviceData.tags }),
        ...(serviceData.requirements && {
          requirements: serviceData.requirements,
        }),
        ...(serviceData.revisions && { revisions: serviceData.revisions }),
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from("Services")
        .update(formattedServiceData)
        .eq("service_id", serviceId)
        .eq("user_id", user?.id); // Ensure user can only edit their own services

      if (updateError) throw updateError;

      await get().fetchServices();
      toast.success("Service updated successfully!");
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Service update failed: ${error.message}`);
    }
  },
}));

function filterServices(
  services: MarketplaceService[],
  searchTerm: string,
  category: string
): MarketplaceService[] {
  return services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      category === "all" ||
      service.category?.toLowerCase() === category?.toLowerCase();

    return matchesSearch && matchesCategory;
  });
}
