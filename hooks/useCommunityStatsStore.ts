import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";

interface User {
  user_id: string; // Changed to text to match schema
  username: string;
  name: string;
  skillcoins: number;
  avatar_url: string | null;
  rating: number;
}

interface Challenge {
  challenge_id: number;
  title: string;
  description: string;
  reward_skillcoins: number;
  difficulty: string;
  category: string;
  skills: string;
  start_date: string;
  end_date: string;
}

interface Review {
  review_id: number;
  service_id: number;
  reviewer_id: string;
  provider_id: string;
  rating: number;
  content: string;
  created_at: string;
}

interface CommunityStats {
  activeUsers: number;
  topProviders: User[];
  topSkills: Array<{ skill: string; usage_count: number }>;
  totalSkillcoins: number;
  rankedUsers: User[];
  availableChallenges: Challenge[];
  recentReviews: Review[];
}

interface CommunityStore {
  communityStats: CommunityStats;
  isLoading: boolean;
  error: string | null;
  fetchCommunityStats: () => Promise<void>;
}

export const useCommunityStore = create<CommunityStore>((set) => ({
  communityStats: {
    activeUsers: 0,
    topProviders: [],
    topSkills: [],
    totalSkillcoins: 0,
    rankedUsers: [],
    availableChallenges: [],
    recentReviews: [],
  },
  isLoading: false,
  error: null,

  fetchCommunityStats: async () => {
    set({ isLoading: true });
    try {
      const supabase = createClient();
      const { data: userData, error: userError } = await supabase
        .from("Users")
        .select("user_id, username, name, skillcoins, avatar_url, rating")
        .order("skillcoins", { ascending: false })
        .limit(10);

      if (userError) throw userError;
      const { data: challengesData, error: challengesError } = await supabase
        .from("Challenges") // Updated table name
        .select(
          "challenge_id, title, description, reward_skillcoins, difficulty, category, skills, start_date, end_date"
        )
        .gte("end_date", new Date().toISOString());

      if (challengesError) throw challengesError;

      // Calculate total skillcoins
      const totalSkillcoins = userData.reduce(
        (total: number, user: User) => total + (user.skillcoins || 0),
        0
      );

      // Extract and count skills from challenges
      const skillsMap = new Map<string, number>();
      challengesData.forEach((challenge: Challenge) => {
        challenge.skills.split(",").forEach((skill) => {
          const trimmedSkill = skill.trim();
          skillsMap.set(trimmedSkill, (skillsMap.get(trimmedSkill) || 0) + 1);
        });
      });

      const topSkills = Array.from(skillsMap.entries())
        .map(([skill, usage_count]) => ({ skill, usage_count }))
        .sort((a, b) => b.usage_count - a.usage_count);

      // Get active users count from Users table instead of Activity
      const { count: activeUsersCount, error: usersError } = await supabase
        .from("Users")
        .select("*", { count: "exact", head: true });

      if (usersError) throw usersError;

      // Fetch recent reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("Reviews")
        .select(
          `
          review_id,
          service_id,
          reviewer_id,
          provider_id,
          rating,
          content,
          created_at
        `
        )
        .order("created_at", { ascending: false })
        .limit(10);

      if (reviewsError) throw reviewsError;

      set({
        communityStats: {
          activeUsers: activeUsersCount || 0,
          topProviders: userData,
          totalSkillcoins,
          topSkills,
          rankedUsers: userData,
          availableChallenges: challengesData,
          recentReviews: reviewsData,
        },
        error: null,
      });
    } catch (err) {
      set({
        error: "Failed to fetch community stats",
        communityStats: {
          activeUsers: 0,
          topProviders: [],
          topSkills: [],
          totalSkillcoins: 0,
          rankedUsers: [],
          availableChallenges: [],
          recentReviews: [],
        },
      });
      console.error("Error fetching community stats:", err);
    } finally {
      set({ isLoading: false });
    }
  },
}));
