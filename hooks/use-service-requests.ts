import { create } from 'zustand';
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// Enum for request status
export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// DTO for creating a new service request
interface CreateServiceRequestDTO {
  service_id: number;
  requester_id: string;
  provider_id: string;
  requirements: string;
  budget?: number;
  deadline?: string;
}

// Full service request interface
interface ServiceRequest extends Omit<CreateServiceRequestDTO, 'requester_id' | 'provider_id'> {
  request_id: number;
  requester_id: string;
  provider_id: string;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
  completion_notes?: string;
  cancellation_reason?: string;
}

interface ServiceRequestsState {
  requests: ServiceRequest[];
  isLoading: boolean;
  error: string | null;
  addRequest: (requestData: CreateServiceRequestDTO) => Promise<ServiceRequest | null>;
  fetchUserRequests: (userId: string, asProvider?: boolean) => Promise<void>;
  updateRequestStatus: (
    requestId: number, 
    status: RequestStatus, 
    notes?: string
  ) => Promise<void>;
  fetchRequestById: (requestId: number) => Promise<ServiceRequest | null>;
  fetchPendingRequests: () => Promise<void>;
}

export const useServiceRequests = create<ServiceRequestsState>((set, get) => ({
  requests: [],
  isLoading: false,
  error: null,

  addRequest: async (requestData: CreateServiceRequestDTO) => {
    set({ isLoading: true, error: null });
    try {
      // Validate request data
      if (!requestData.service_id || !requestData.requester_id || !requestData.provider_id) {
        throw new Error('Missing required request fields');
      }

      const { data: newRequest, error } = await supabase
        .from('service_requests')
        .insert([{
          ...requestData,
          status: RequestStatus.PENDING
        }])
        .select('*')
        .single();

      if (error) throw new Error(error.message);

      set((state) => ({
        requests: [...state.requests, newRequest as ServiceRequest],
        isLoading: false
      }));

      return newRequest as ServiceRequest;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add service request', 
        isLoading: false 
      });
      throw error; // Re-throw for component handling
    }
  },

  fetchUserRequests: async (userId: string, asProvider: boolean = false) => {
    set({ isLoading: true, error: null });
    try {
      const { data: requests, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq(asProvider ? 'provider_id' : 'requester_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);

      set({ 
        requests: requests as ServiceRequest[], 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch requests', 
        isLoading: false 
      });
    }
  },

  fetchRequestById: async (requestId: number) => {
    set({ isLoading: true, error: null });
    try {
      const { data: request, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('request_id', requestId)
        .single();

      if (error) throw new Error(error.message);

      return request as ServiceRequest;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch request', 
        isLoading: false 
      });
      return null;
    }
  },

  fetchPendingRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: requests, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('status', RequestStatus.PENDING)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);

      set({ 
        requests: requests as ServiceRequest[], 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch pending requests', 
        isLoading: false 
      });
    }
  },

  updateRequestStatus: async (requestId: number, status: RequestStatus, notes?: string) => {
    set({ isLoading: true, error: null });
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      // Add appropriate notes field based on status
      if (status === RequestStatus.COMPLETED) {
        updateData.completion_notes = notes;
      } else if (status === RequestStatus.CANCELLED) {
        updateData.cancellation_reason = notes;
      }

      const { data: updatedRequest, error } = await supabase
        .from('service_requests')
        .update(updateData)
        .eq('request_id', requestId)
        .select()
        .single();

      if (error) throw new Error(error.message);

      set((state) => ({
        requests: state.requests.map(req => 
          req.request_id === requestId 
            ? { ...req, ...updatedRequest } 
            : req
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update request status', 
        isLoading: false 
      });
      throw error;
    }
  }
}));