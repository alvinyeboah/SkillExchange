"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/utils/supabase/client";

export interface ConsolidatedUser {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar_url?: string;
  bio: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  created_at: string;
  updated_at: string;
  skillcoins: number;
  rating: number;
  settings?: {
    email_notifications: boolean;
    push_notifications: boolean;
    sms_notifications: boolean;
    notification_frequency: "realtime" | "daily" | "weekly";
    language: string;
    profile_visibility: "public" | "private" | "friends";
    show_online_status: boolean;
    allow_messages_from_strangers: boolean;
  };
  achievements?: {
    id: number;
    title: string;
    description: string;
    icon_url: string;
    earned_at: string;
    requirement_value: number;
    requirement_type: string;
    skillcoins_reward: number;
  }[];
  skillProgress?: {
    skill_category: string;
    tasks_completed: number;
    skill_level: number;
    last_updated: string;
  }[];
  services?: {
    id: number;
    title: string;
    description: string;
    skillcoin_price: number;
    delivery_time: number;
    status: "active" | "inactive" | "draft";
    service_status: "available" | "in_progress" | "completed";
    created_at: string;
    updated_at: string;
    category: string;
    tags: string;
    requirements: string;
    revisions: number;
  }[];
  challengeParticipation?: {
    challenge_id: number;
    progress: number;
    joined_at: string;
    challenge: {
      title: string;
      description: string;
      reward_skillcoins: number;
      difficulty: string;
      category: string;
      start_date: string;
      end_date: string;
    };
  }[];
  completedChallengesCount?: number;
  notifications?: {
    id: number;
    title: string;
    message: string;
    type: "email" | "push" | "sms";
    status: "unread" | "read";
    created_at: string;
  }[];
  activity?: {
    id: number;
    activity_type: "post" | "share";
    description: string;
    created_at: string;
    status: "pending" | "completed" | "failed";
  }[];
  requestedServices?: {
    request_id: number;
    service_id: number;
    provider_id: string;
    status: "pending" | "accepted" | "rejected" | "completed";
    requirements: string;
    created_at: string;
    updated_at: string;
    service: {
      title: string;
      description: string;
      skillcoin_price: number;
      delivery_time: number;
      status: string;
    };
  }[];
}

interface AuthState {
  user: ConsolidatedUser | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: ConsolidatedUser | null) => void;
  clearError: () => void;
  refreshUserData: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (user: ConsolidatedUser) => void;
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

          // Authenticate user
          const { data: authData, error: authError } =
            await supabase.auth.signInWithPassword({
              email,
              password,
            });

          if (authError) throw new Error(authError.message);

          // Fetch user's basic information
          const { data: userData, error: userError } = await supabase
            .from("Users")
            .select(
              `
              user_id,
              name,
              username,
              bio,
              email,
              skillcoins,
              created_at,
              updated_at,
              role,
              status,
              avatar_url,
              rating
            `
            )
            .eq("user_id", authData.user.id)
            .single();

          if (userError) throw new Error(userError.message);

          // Fetch user settings
          const { data: settingsData } = await supabase
            .from("UserSettings")
            .select(
              `
              email_notifications,
              push_notifications,
              sms_notifications,
              notification_frequency,
              language,
              profile_visibility,
              show_online_status,
              allow_messages_from_strangers
            `
            )
            .eq("user_id", authData.user.id)
            .single();

          // Fetch user achievements
          const { data: achievementsData } = await supabase
            .from("UserAchievements")
            .select(
              `
            earned_at,
            requirement_value,
            requirement_type,
            skillcoins_reward,
            achievement:Achievements (
              id,
              title,
              description,
              icon_url
            )
          `
            )
            .eq("user_id", authData.user.id);

          // Fetch skill progress
          const { data: skillProgressData } = await supabase
            .from("SkillProgress")
            .select(
              `
              skill_category,
              tasks_completed,
              skill_level,
              last_updated
            `
            )
            .eq("user_id", authData.user.id);

          // Fetch user services
          const { data: servicesData } = await supabase
            .from("Services")
            .select(
              `
              service_id,
              title,
              description,
              skillcoin_price,
              delivery_time,
              status,
              service_status,
              created_at,
              updated_at,
              category,
              tags,
              requirements,
              revisions
            `
            )
            .eq("user_id", authData.user.id);

          // Fetch challenge participations
          const { data: challengeData } = await supabase
            .from("ChallengeParticipation")
            .select(
              `
            challenge_id,
            progress,
            joined_at,
            challenge:Challenges (
              title,
              description,
              reward_skillcoins,
              difficulty,
              category,
              start_date,
              end_date
            )
          `
            )
            .eq("user_id", authData.user.id);

          // Fetch notifications
          const { data: notificationsData } = await supabase
            .from("Notifications")
            .select(
              `
              notification_id,
              title,
              message,
              type,
              status,
              created_at
            `
            )
            .eq("user_id", authData.user.id)
            .order("created_at", { ascending: false })
            .limit(20);

          const { data: activityData } = await supabase
            .from("Activity")
            .select(
              `
              id,
              activity_type,
              description,
              created_at,
              status
            `
            )
            .eq("user_id", authData.user.id)
            .order("created_at", { ascending: false })
            .limit(20);

          // Fetch requested services
          const { data: requestedServicesData } = await supabase
            .from("ServiceRequests")
            .select(
              `
              request_id,
              service_id,
              provider_id,
              status,
              requirements,
              created_at,
              updated_at,
              service:Services (
                title,
                description,
                skillcoin_price,
                delivery_time,
                status
              )
            `
            )
            .eq("requester_id", authData.user.id);

          // Combine all data
          const user: ConsolidatedUser = {
            id: userData.user_id,
            email: userData.email,
            username: userData.username,
            name: userData.name,
            bio: userData.bio,
            avatar_url: userData.avatar_url,
            role: userData.role,
            status: userData.status,
            created_at: userData.created_at,
            updated_at: userData.updated_at,
            skillcoins: userData.skillcoins,
            rating: userData.rating,
            settings: settingsData || undefined,
            achievements: achievementsData?.map((achievement: any) => ({
              id: achievement.achievement.achievement_id,
              title: achievement.achievement.title,
              description: achievement.achievement.description,
              icon_url: achievement.achievement.icon_url,
              earned_at: achievement.earned_at,
              requirement_value: achievement.requirement_value,
              requirement_type: achievement.requirement_type,
              skillcoins_reward: achievement.skillcoins_reward,
            })),
            skillProgress: skillProgressData || undefined,
            services: servicesData?.map((service) => ({
              id: service.service_id,
              title: service.title,
              description: service.description,
              skillcoin_price: service.skillcoin_price,
              delivery_time: service.delivery_time,
              status: service.status,
              service_status: service.service_status,
              created_at: service.created_at,
              updated_at: service.updated_at,
              category: service.category,
              tags: service.tags,
              requirements: service.requirements,
              revisions: service.revisions,
            })),
            challengeParticipation: challengeData?.map(
              (participation: any) => ({
                challenge_id: participation.challenge_id,
                progress: participation.progress,
                joined_at: participation.joined_at,
                challenge: {
                  title: participation.challenge.title,
                  description: participation.challenge.description,
                  reward_skillcoins: participation.challenge.reward_skillcoins,
                  difficulty: participation.challenge.difficulty,
                  category: participation.challenge.category,
                  start_date: participation.challenge.start_date,
                  end_date: participation.challenge.end_date,
                },
              })
            ),
            completedChallengesCount:
              challengeData?.filter(
                (participation: any) => participation.progress === 100
              ).length || 0,
            notifications: notificationsData?.map((notification) => ({
              id: notification.notification_id,
              title: notification.title,
              message: notification.message,
              type: notification.type,
              status: notification.status,
              created_at: notification.created_at,
            })),
            activity: activityData?.map((activity) => ({
              id: activity.id,
              activity_type: activity.activity_type,
              description: activity.description,
              created_at: activity.created_at,
              status: activity.status,
            })),
            requestedServices: requestedServicesData?.map((request: any) => ({
              request_id: request.request_id,
              service_id: request.service_id,
              provider_id: request.provider_id,
              status: request.status,
              requirements: request.requirements,
              created_at: request.created_at,
              updated_at: request.updated_at,
              service: {
                title: request.service.title,
                description: request.service.description,
                skillcoin_price: request.service.skillcoin_price,
                delivery_time: request.service.delivery_time,
                status: request.service.status,
              },
            })),
          };

          set({
            user,
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

      setUser: (user: ConsolidatedUser | null) => set({ user }),
      clearError: () => set({ error: null }),
      refreshUserData: async () => {
        const { login } = get();
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user?.email) {
          await login(user.email, ""); // This will refresh all user data
        }
      },

      checkAuth: async () => {
        const supabase = createClient();
        try {
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (error) throw error;

          if (session?.user) {
            // Fetch complete user data from your database
            const { data: userData, error: userError } = await supabase
              .from("Users")
              .select("*")
              .eq("user_id", session.user.id)
              .single();

            if (userError) throw userError;

            set({
              user: userData as ConsolidatedUser,
              isInitialized: true,
            });
          } else {
            set({ user: null, isInitialized: true });
          }
        } catch (error) {
          set({ user: null, isInitialized: true });
          if (!window.location.pathname.startsWith("/auth/")) {
            window.location.href = "/auth/signin";
          }
        }
      },

      updateUser: (user: ConsolidatedUser) => set({ user }),
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
