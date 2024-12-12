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
      set({ error: 'Failed to add service request', isLoading: false });
    }
  },
})); 