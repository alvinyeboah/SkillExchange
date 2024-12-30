import { create } from "zustand";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

interface User {
  user_id: number;
  username: string;
  avatar_url: string;
}

interface Participant {
  challenge_id: string;
  user_id: number;
  progress: number;
  joined_at: string;
}

// Base challenge type for creation
interface BaseChallenge {
  title: string;
  description?: string;
  reward_skillcoins: number;
  difficulty?: string;
  category?: string;
  start_date: string;
  end_date: string;
  skills?: string[] | string;
}

// Extended challenge type with additional data
interface ChallengeParticipant {
  username: string;
  avatar_url: string;
  progress: number;
  joined_at: string;
}

interface ChallengeWinner {
  name: string;
  avatar: string;
  user_id: number;
}

interface Challenge extends BaseChallenge {
  challenge_id: string;
  participantsCount: number;
  progress?: number;
  winner?: ChallengeWinner;
  topParticipants?: ChallengeParticipant[];
  status: "active" | "upcoming" | "completed";
}

interface ChallengesState {
  challenges: Challenge[];
  activeChallenges: Challenge[];
  upcomingChallenges: Challenge[];
  completedChallenges: Challenge[];
  isLoading: boolean;
  error: string | null;
  setChallenges: (challenges: Challenge[]) => void;
  fetchChallenges: () => Promise<void>;
  createChallenge: (challenge: BaseChallenge) => Promise<void>;
  participateInChallenge: (
    challengeId: string,
    userId: string
  ) => Promise<void>;
}

const normalizeSkills = (skills: string | string[] | undefined): string[] => {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  return skills.split(/\s*,\s*/);
};

const getChallengeStatus = (startDate: string, endDate: string) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return "upcoming";
  if (now > end) return "completed";
  return "active";
};

const sortByStartDate = (a: Challenge, b: Challenge) =>
  new Date(a.start_date).getTime() - new Date(b.start_date).getTime();

export const useChallengesStore = create<ChallengesState>((set, get) => ({
  challenges: [],
  activeChallenges: [],
  upcomingChallenges: [],
  completedChallenges: [],
  isLoading: false,
  error: null,

  setChallenges: (challenges) => {
    const active: Challenge[] = [];
    const upcoming: Challenge[] = [];
    const completed: Challenge[] = [];

    challenges.forEach((challenge) => {
      const status = getChallengeStatus(
        challenge.start_date,
        challenge.end_date
      );
      challenge.skills = normalizeSkills(challenge.skills);

      // Capitalize the difficulty
      if (challenge.difficulty) {
        challenge.difficulty =
          challenge.difficulty.charAt(0).toUpperCase() +
          challenge.difficulty.slice(1);
      }

      if (status === "active") {
        const now = new Date().getTime();
        const start = new Date(challenge.start_date).getTime();
        const end = new Date(challenge.end_date).getTime();
        const progress = Math.round(
          Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100))
        );
        active.push({ ...challenge, progress });
      } else if (status === "upcoming") {
        upcoming.push(challenge);
      } else if (status === "completed") {
        completed.push(challenge);
      }
    });

    set({
      challenges,
      activeChallenges: active.sort(sortByStartDate),
      upcomingChallenges: upcoming.sort(sortByStartDate),
      completedChallenges: completed.sort(sortByStartDate),
    });
  },

  fetchChallenges: async () => {
    const { setChallenges } = get();
    set({ isLoading: true, error: null });

    try {
      const supabase = createClient();
      const [
        { data: challenges, error: challengesError },
        { data: participants, error: participantsError },
        { data: users, error: usersError },
      ] = await Promise.all([
        supabase.from("Challenges").select("*"),
        supabase.from("ChallengeParticipation").select("*"),
        supabase.from("Users").select("user_id, username, avatar_url"),
      ]);

      if (challengesError || participantsError || usersError) {
        throw new Error("Failed to fetch data");
      }

      const userMap = new Map(users.map((user:User) => [user.user_id, user]));
      const processedChallenges: Challenge[] = challenges.map((challenge:any) => {
        const challengeParticipants = participants.filter(
          (p:Challenge) => p.challenge_id === challenge.challenge_id
        );
        const uniqueParticipants = new Set(
          challengeParticipants.map((p:any) => p.user_id)
        );
        const topParticipants = challengeParticipants
          .map((p:Participant) => {
            const user = userMap.get(p.user_id);
            return {
              username: user?.username || "Unknown User",
              avatar_url: user?.avatar_url || "",
              progress: p.progress,
              joined_at: p.joined_at,
            };
          })
          .sort((a, b) => b.progress - a.progress)
          .slice(0, 3);

        return {
          ...challenge,
          challenge_id: challenge.challenge_id,
          participantsCount: uniqueParticipants.size,
          topParticipants,
          status: getChallengeStatus(challenge.start_date, challenge.end_date),
        };
      });

      setChallenges(processedChallenges);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
        challenges: [],
        activeChallenges: [],
        upcomingChallenges: [],
        completedChallenges: [],
      });
      toast.error(`Failed to fetch challenges: ${error.message}`);
    }
  },

  createChallenge: async (challenge: BaseChallenge) => {
    set({ isLoading: true, error: null });

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("Challenges")
        .insert([
          {
            title: challenge.title,
            description: challenge.description || "",
            reward_skillcoins: challenge.reward_skillcoins,
            difficulty: challenge.difficulty,
            category: challenge.category,
            skills: Array.isArray(challenge.skills)
              ? challenge.skills.join(",")
              : challenge.skills,
            start_date: challenge.start_date,
            end_date: challenge.end_date,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      await get().fetchChallenges();
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Failed to create challenge: ${error.message}`);
    }
  },

  participateInChallenge: async (challengeId: string, userId: string) => {
    try {
      const supabase = createClient();

      // Check if user is already participating
      const { data: existingParticipation } = await supabase
        .from("ChallengeParticipation")
        .select()
        .eq("challenge_id", challengeId)
        .eq("user_id", userId)
        .single();

      if (existingParticipation) {
        toast.error("You are already participating in this challenge");
        return;
      }

      const { error } = await supabase.from("ChallengeParticipation").insert([
        {
          challenge_id: challengeId,
          user_id: userId,
          progress: 0,
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }

      await get().fetchChallenges();
      toast.success("Successfully joined the challenge");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  },
}));
