import { create } from 'zustand';
import { createServiceRequest } from '@/lib/api';

interface ServiceRequest {
  request_id: number;
  service_id: number;
  requester_id: number;
  provider_id: number;
  status: string;
  requirements: string;
}

interface ServiceRequestsState {
  requests: ServiceRequest[];
  isLoading: boolean;
  error: string | null;
  addRequest: (requestData: any) => Promise<void>;
}

export const useServiceRequests = create<ServiceRequestsState>((set) => ({
  requests: [],
  isLoading: false,
  error: null,

  addRequest: async (requestData) => {
    set({ isLoading: true, error: null });
    try {
      await createServiceRequest(requestData);
    } catch (error: any) {
      // Pass through the specific error message
      set({ 
        error: error.message || 'Failed to add service request', 
        isLoading: false 
      });
      // Re-throw the error so the component can handle it
      throw error;
    }
  },
})); 