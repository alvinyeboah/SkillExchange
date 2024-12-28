import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";

// Initialize Supabase client
const supabase = createClient();

interface Achievement {
  achievement_id: number;
  title: string;
  description: string;
  skillcoins_reward: number;
}

interface UserAchievement {
  id: number;
  user_id: string;
  achievement_id: number;
  earned_at: string;
  achievement: Achievement;
}

interface AchievementsState {
  achievements: UserAchievement[];
  isLoading: boolean;
  error: string | null;
  fetchAchievements: (userId: string) => Promise<void>;
  earnAchievement: (userId: string, achievementId: number) => Promise<void>;
}

export const useAchievements = create<AchievementsState>((set) => ({
  achievements: [],
  isLoading: false,
  error: null,

  fetchAchievements: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: userAchievements, error } = await supabase
        .from("user_achievements")
        .select(
          `
          id,
          user_id,
          achievement_id,
          earned_at,
          achievement:achievements (
            achievement_id,
            title,
            description,
            skillcoins_reward
          )
        `
        )
        .eq("user_id", userId);

      if (error) throw error;

      set({
        achievements: userAchievements.map((ua) => ({
          ...ua,
          achievement: ua.achievement[0],
        })) as UserAchievement[],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: "Failed to fetch achievements",
        isLoading: false,
      });
    }
  },

  earnAchievement: async (userId: string, achievementId: number) => {
    set({ isLoading: true, error: null });
    try {
      // First, check if the user already has this achievement
      const { data: existingAchievement } = await supabase
        .from("user_achievements")
        .select()
        .eq("user_id", userId)
        .eq("achievement_id", achievementId)
        .single();

      if (existingAchievement) {
        throw new Error("Achievement already earned");
      }

      // Insert the new achievement
      const { error: insertError } = await supabase
        .from("user_achievements")
        .insert([
          {
            user_id: userId,
            achievement_id: achievementId,
            earned_at: new Date().toISOString(),
          },
        ]);

      if (insertError) throw insertError;

      // Get the achievement details to update the local state
      const { data: newAchievement, error: fetchError } = await supabase
        .from("user_achievements")
        .select(
          `
          id,
          user_id,
          achievement_id,
          earned_at,
          achievement:achievements (
            achievement_id,
            title,
            description,
            skillcoins_reward
          )
        `
        )
        .eq("user_id", userId)
        .eq("achievement_id", achievementId)
        .single();

      if (fetchError) throw fetchError;

      set((state) => ({
        achievements: [
          ...state.achievements,
          {
            ...newAchievement,
            achievement: newAchievement.achievement[0],
          } as UserAchievement,
        ],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to earn achievement",
        isLoading: false,
      });
    }
  },
}));
