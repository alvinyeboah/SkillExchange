"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/utils/supabase/client";

export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  avatar_url?: string;
  bio?: string;
  skills?: string[];
  role?: string;
  created_at: string;
  skillcoins: number;
  ratings?: {
    rating: number;
    count: number;
    average: number;
  };
  transactions?: {
    id: string;
    amount: number;
    type: 'credit' | 'debit';
    description: string;
    created_at: string;
  }[];
  activeChallenges?: {
    id: string;
    title: string;
    description: string;
    reward: number;
    status: 'active' | 'completed';
    deadline: string;
    created_at: string;
  }[];
  completedChallenges?: {
    id: string;
    title: string;
    description: string;
    reward: number;
    status: 'active' | 'completed';
    deadline: string;
    created_at: string;
  }[];
  services?: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    created_at: string;
  }[];
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
  refreshUserData: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (user: User) => void;
}

const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isInitialized: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw new Error(error.message);

          // Get user profile data
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          set({
            user: {
              id: data.user.id,
              email: data.user.email!,
              ...profile,
            },
            isLoading: false,
            isInitialized: true,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
          set({ user: null, isLoading: false });
          window.location.href = "/auth/signin";
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      checkAuth: async () => {
        const supabase = createClient();
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            const { data: profile } = await supabase
              .from("Users")
              .select("*")
              .eq("user_id", user.id)
              .single();

            set({
              user: {
                id: user.id,
                email: user.email!,
                ...profile,
              },
              isInitialized: true,
            });
          } else {
            set({ user: null, isInitialized: true });
          }
        } catch (error) {
          set({ user: null, isInitialized: true });
          window.location.href = "/auth/signin";
        }
      },

      setUser: (user: User | null) => set({ user }),
      clearError: () => set({ error: null }),
      refreshUserData: async () => {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          set({
            user: {
              id: user.id,
              email: user.email!,
              ...profile,
            },
          });
        }
      },
      updateUser: (user: User) => set({ user }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.checkAuth();
        }
      },
    }
  )
);

export { useAuth };
