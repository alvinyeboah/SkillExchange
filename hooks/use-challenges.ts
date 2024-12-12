import { create } from "zustand";
import { getChallenges as fetchChallengesApi } from "@/lib/api";

interface Challenge {
  challenge_id: number;
  title: string;
  description: string;
  reward_skillcoins: number;
  participants: number;
  timeLeft: string;
}

interface ChallengesState {
  challenges: Challenge[];
  isLoading: boolean;
  error: string | null;
  getChallenges: () => Promise<void>;
}

export const useChallenges = create<ChallengesState>((set) => ({
  challenges: [],
  isLoading: false,
  error: null,

  getChallenges: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchChallengesApi();
      set({ challenges: response, isLoading: false });
    } catch (error: any) {
      set({ error: "Failed to fetch challenges", isLoading: false });
    }
  },
}));
