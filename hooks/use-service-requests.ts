import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";
import { sendEmailNotification } from "@/utils/email";

const supabase = createClient();

// Enum for request status
export enum RequestStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
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
interface ServiceRequest
  extends Omit<CreateServiceRequestDTO, "requester_id" | "provider_id"> {
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
  addRequest: (
    requestData: CreateServiceRequestDTO
  ) => Promise<ServiceRequest | null>;
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
      if (
        !requestData.service_id ||
        !requestData.requester_id ||
        !requestData.provider_id
      ) {
        throw new Error("Missing required request fields");
      }

      // Check if user is requesting service from themselves
      if (requestData.requester_id === requestData.provider_id) {
        throw new Error("You cannot request services from yourself");
      }

      const { data: newRequest, error } = await supabase
        .from("ServiceRequests")
        .insert([
          {
            ...requestData,
            status: RequestStatus.PENDING,
          },
        ])
        .select("*")
        .single();

      if (error) throw new Error(error.message);

      // Fetch provider's email
      const { data: providerData, error: providerError } = await supabase
        .from("Users")
        .select("email")
        .eq("user_id", requestData.provider_id)
        .single();

      if (providerError) throw new Error(providerError.message);
      if (!providerData?.email) throw new Error("Provider email not found");

      // Create notification for the provider
      const { error: notificationError } = await supabase
        .from("Notifications")
        .insert([
          {
            user_id: requestData.provider_id,
            title: "New Service Request",
            message: "You have received a new service request",
            type: "push",
            status: "unread",
            reference_id: newRequest.request_id,
            reference_type: "service_request",
          },
        ]);

      if (notificationError) throw new Error(notificationError.message);
      await sendEmailNotification({
        to: providerData.email,
        subject: "New Service Request",
        template: "service-request",
        data: {
          requestId: newRequest.request_id,
          requirements: requestData.requirements,
          deadline: requestData.deadline,
        },
      });
      set((state) => ({
        requests: [...state.requests, newRequest as ServiceRequest],
        isLoading: false,
      }));

      return newRequest as ServiceRequest;
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to add service request",
        isLoading: false,
      });
      throw error; // Re-throw for component handling
    }
  },

  fetchUserRequests: async (userId: string, asProvider: boolean = false) => {
    set({ isLoading: true, error: null });
    try {
      const { data: requests, error } = await supabase
        .from("ServiceRequests")
        .select("*")
        .eq(asProvider ? "provider_id" : "requester_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);

      set({
        requests: requests as ServiceRequest[],
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch requests",
        isLoading: false,
      });
    }
  },

  fetchRequestById: async (requestId: number) => {
    set({ isLoading: true, error: null });
    try {
      const { data: request, error } = await supabase
        .from("service_requests")
        .select("*")
        .eq("request_id", requestId)
        .single();

      if (error) throw new Error(error.message);

      return request as ServiceRequest;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch request",
        isLoading: false,
      });
      return null;
    }
  },

  fetchPendingRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: requests, error } = await supabase
        .from("ServiceRequests")
        .select("*")
        .eq("status", RequestStatus.PENDING)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);

      set({
        requests: requests as ServiceRequest[],
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch pending requests",
        isLoading: false,
      });
    }
  },

  updateRequestStatus: async (
    requestId: number,
    status: RequestStatus,
    notes?: string
  ) => {
    set({ isLoading: true, error: null });
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      // Add appropriate notes field based on status
      if (status === RequestStatus.COMPLETED) {
        updateData.completion_notes = notes;
      } else if (status === RequestStatus.CANCELLED) {
        updateData.cancellation_reason = notes;
      }

      const { data: updatedRequest, error } = await supabase
        .from("ServiceRequests")
        .update(updateData)
        .eq("request_id", requestId)
        .select()
        .single();

      if (error) throw new Error(error.message);

      set((state) => ({
        requests: state.requests.map((req) =>
          req.request_id === requestId ? { ...req, ...updatedRequest } : req
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update request status",
        isLoading: false,
      });
      throw error;
    }
  },
}));
