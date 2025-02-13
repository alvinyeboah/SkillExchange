"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/utils/supabase/client";
import { Skill } from "@/types/database.types";

export interface ConsolidatedUser {
  user_id: string;
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
    achievement_id: number;
    title: string;
    description: string;
    icon_url: string;
    earned_at: string;
    requirement_type: string;
    requirement_value: number;
    skillcoins_reward: number;
  }[];
  skillProgress?: {
    skill_category: string;
    tasks_completed: number;
    skill_level: number;
    last_updated: string;
  }[];
  services?: {
    service_id: number;
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
    requests?: {
      request_id: number;
      requester_id: string;
      status: "pending" | "accepted" | "rejected" | "completed";
      requirements: string;
      created_at: string;
      updated_at: string;
      requester: {
        username: string;
        avatar_url?: string;
      };
    }[];
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
  skills?: {
    skill_id: number;
    name: string;
    category: string;
    description: string;
    proficiency_level: number;
    endorsed_count: number;
  }[];
}

interface RegisterParams {
  email: string;
  password: string;
  username: string;
  name: string;
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
  register: (params: RegisterParams) => Promise<boolean>;
  addSkill: (newSkill: Skill) => Promise<void>; // New function
}

const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isInitialized: false,

      login: async (email: string, password: string) => {
        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          // Fetch complete user data after successful authentication
          const { data: userData, error: userError } = await supabase
            .from("Users")
            .select("*")
            .eq("user_id", data.user?.id)
            .single();

          // Fetch related data
          const [
            { data: settings },
            { data: achievements },
            { data: servicesData },
            { data: skills },
            { data: requestedServices },
            { data: challengeParticipation },
          ] = await Promise.all([
            supabase
              .from("UserSettings")
              .select("*")
              .eq("user_id", data.user?.id)
              .single(),
            supabase
              .from("UserAchievements")
              .select(
                `
                achievement_id,
                earned_at,
                Achievements (
                  title,
                  description,
                  icon_url,
                  requirement_type,
                  requirement_value,
                  skillcoins_reward
                )
              `
              )
              .eq("user_id", data.user?.id),
            supabase
              .from("Services")
              .select(
                `
                *,
                requests:ServiceRequests(
                  request_id,
                  requester_id,
                  status,
                  requirements,
                  created_at,
                  updated_at,
                  requester:Users!ServiceRequests_requester_id_fkey(
                    username,
                    avatar_url
                  )
                )
              `
              )
              .eq("user_id", data.user?.id),
            supabase
              .from("UserSkills")
              .select(
                `
                proficiency_level,
                endorsed_count,
                Skills (
                  skill_id,
                  name,
                  category,
                  description
                )
              `
              )
              .eq("user_id", data.user?.id),
            supabase
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
                Services (
                  title,
                  description,
                  skillcoin_price,
                  delivery_time,
                  status
                )
              `
              )
              .eq("requester_id", data.user?.id),
            supabase
              .from("ChallengeParticipation")
              .select(
                `
                challenge_id,
                progress,
                joined_at,
                Challenges (
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
              .eq("user_id", data.user?.id),
          ]);

          // Transform the skills data before consolidating
          const transformedSkills = skills?.map((skill: any) => ({
            skill_id: skill.Skills.skill_id,
            name: skill.Skills.name,
            category: skill.Skills.category,
            description: skill.Skills.description,
            proficiency_level: skill.proficiency_level,
            endorsed_count: skill.endorsed_count,
          }));

          // Transform services data to include requests
          const services = servicesData?.map((service: any) => ({
            ...service,
            requests: service.requests || [],
          }));

          // Transform requested services data
          const transformedRequestedServices = requestedServices?.map(
            (request: any) => ({
              request_id: request.request_id,
              service_id: request.service_id,
              provider_id: request.provider_id,
              status: request.status,
              requirements: request.requirements,
              created_at: request.created_at,
              updated_at: request.updated_at,
              service: request.Services,
            })
          );

          // Transform challenge participation data
          const transformedChallengeParticipation = challengeParticipation?.map(
            (participation: any) => ({
              challenge_id: participation.challenge_id,
              progress: participation.progress,
              joined_at: participation.joined_at,
              challenge: participation.Challenges,
            })
          );

          // Combine all data
          const consolidatedUser = {
            ...userData,
            settings,
            achievements,
            services,
            skills: transformedSkills,
            requestedServices: transformedRequestedServices,
            challengeParticipation: transformedChallengeParticipation,
          } as ConsolidatedUser;

          set({ user: consolidatedUser, isLoading: false });
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

          if (!session?.user) {
            set({ user: null, isInitialized: true });
            return;
          }

          // Fetch all data in parallel
          const userId = session.user.id;
          const [
            userData,
            settings,
            achievements,
            servicesData,
            skills,
            requestedServices,
            challengeParticipation,
          ] = await Promise.all([
            supabase.from("Users").select("*").eq("user_id", userId).single(),
            supabase
              .from("UserSettings")
              .select("*")
              .eq("user_id", userId)
              .single(),
            supabase.from("Achievements").select("*").eq("user_id", userId),
            supabase
              .from("Services")
              .select(
                `
                *,
                requests:ServiceRequests(
                  request_id,
                  requester_id,
                  status,
                  requirements,
                  created_at,
                  updated_at,
                  requester:Users!ServiceRequests_requester_id_fkey(
                    username,
                    avatar_url
                  )
                )
              `
              )
              .eq("user_id", userId),
            supabase
              .from("UserSkills")
              .select(
                `
                proficiency_level,
                endorsed_count,
                Skills (skill_id, name, category, description)
              `
              )
              .eq("user_id", userId),
            supabase
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
                Services (
                  title,
                  description,
                  skillcoin_price,
                  delivery_time,
                  status
                )
              `
              )
              .eq("requester_id", userId),
            supabase
              .from("ChallengeParticipation")
              .select(
                `
                challenge_id,
                progress,
                joined_at,
                Challenges (
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
              .eq("user_id", userId),
          ]);

          // Transform services data to include requests
          const services = servicesData.data?.map((service: any) => ({
            ...service,
            requests: service.requests || [],
          }));

          // Transform requested services data
          const transformedRequestedServices = requestedServices.data?.map(
            (request: any) => ({
              request_id: request.request_id,
              service_id: request.service_id,
              provider_id: request.provider_id,
              status: request.status,
              requirements: request.requirements,
              created_at: request.created_at,
              updated_at: request.updated_at,
              service: request.Services,
            })
          );

          // Transform challenge participation data
          const transformedChallengeParticipation =
            challengeParticipation.data?.map((participation: any) => ({
              challenge_id: participation.challenge_id,
              progress: participation.progress,
              joined_at: participation.joined_at,
              challenge: participation.Challenges,
            }));

          // Process and set user data
          set({
            user: {
              ...userData.data,
              settings: settings.data,
              achievements: achievements.data,
              services,
              skills: skills.data,
              requestedServices: transformedRequestedServices,
              challengeParticipation: transformedChallengeParticipation,
            },
            isInitialized: true,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "An unknown error occurred",
            isInitialized: true,
          });
        }
      },
      updateUser: (user: ConsolidatedUser) => set({ user }),

      register: async ({
        email,
        password,
        username,
        name,
      }: RegisterParams): Promise<boolean> => {
        set({ isLoading: true, error: null });
        try {
          const supabase = createClient();

          // Check if username or email already exists
          const { data: existingUser, error: checkError } = await supabase
            .from("Users")
            .select("username, email")
            .or(`username.eq.${username},email.eq.${email}`)
            .single();

          if (existingUser) {
            if (existingUser.email === email) {
              throw new Error("Email already registered");
            }
            if (existingUser.username === username) {
              throw new Error("Username already taken");
            }
          }
          const { data: authData, error: authError } =
            await supabase.auth.signUp({
              email,
              password,
            });

          if (authError) throw new Error(authError.message);
          if (!authData.user) throw new Error("Registration failed");

          // Create user profile in Users table
          const { error: profileError } = await supabase.from("Users").insert([
            {
              user_id: authData.user?.id,
              email,
              username,
              name,
              bio: "",
              role: "user",
              status: "active",
              rating: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

          if (profileError) throw new Error(profileError.message);

          // Create default user settings
          const { error: settingsError } = await supabase
            .from("UserSettings")
            .insert([
              {
                user_id: authData.user?.id,
                email_notifications: true,
                push_notifications: false,
                sms_notifications: false,
                notification_frequency: "daily",
                language: "en",
                profile_visibility: "public",
                show_online_status: true,
                allow_messages_from_strangers: true,
              },
            ]);

          if (settingsError) throw new Error(settingsError.message);
          set({ isLoading: false });
          return true;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      addSkill: async (newSkill: Skill) => {
        const { user, updateUser } = get();
        if (!user?.user_id) throw new Error("User not authenticated");

        try {
          const supabase = createClient();

          // First check if skill exists
          let { data: existingSkill, error: skillError } = await supabase
            .from("Skills")
            .select("skill_id")
            .eq("name", newSkill.name)
            .single();

          let skillId;

          if (!existingSkill) {
            // Create new skill
            const { data: newSkillData, error: createError } = await supabase
              .from("Skills")
              .insert({
                name: newSkill.name,
                category: newSkill.category,
                description: newSkill.description,
              })
              .select("skill_id")
              .single();

            if (createError) throw createError;
            skillId = newSkillData.skill_id;
          } else {
            skillId = existingSkill.skill_id;
          }

          // Add user skill relationship
          const { error: userSkillError } = await supabase
            .from("UserSkills")
            .insert({
              user_id: user.user_id,
              skill_id: skillId,
              proficiency_level: newSkill.proficiency_level,
              endorsed_count: 0,
            });

          if (userSkillError) throw userSkillError;

          // Update local state
          const updatedSkills = [...(user.skills || []), newSkill];
          updateUser({
            ...user,
            skills: updatedSkills,
          });
        } catch (error: any) {
          throw new Error(`Failed to add skill: ${error.message}`);
        }
      },
    }),
    {
      name: "auth-storage",
      storage:
        typeof window !== "undefined"
          ? {
              getItem: (name) => {
                const str = localStorage.getItem(name);
                return str ? JSON.parse(str) : null;
              },
              setItem: (name, value) => {
                localStorage.setItem(name, JSON.stringify(value));
              },
              removeItem: (name) => localStorage.removeItem(name),
            }
          : undefined,
    }
  )
);

export { useAuth };
