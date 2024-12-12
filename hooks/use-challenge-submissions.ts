import { create } from "zustand";
import { createChallengeSubmission } from "@/lib/api";

interface ChallengeSubmission {
  submission_id: number;
  challenge_id: number;
  user_id: number;
  content: string;
  submission_url: string;
  status: string;
}

interface ChallengeSubmissionsState {
  submissions: ChallengeSubmission[];
  isLoading: boolean;
  error: string | null;
  addSubmission: (submissionData: any) => Promise<void>;
}

export const useChallengeSubmissions = create<ChallengeSubmissionsState>(
  (set) => ({
    submissions: [],
    isLoading: false,
    error: null,

    addSubmission: async (submissionData) => {
      set({ isLoading: true, error: null });
      try {
        await createChallengeSubmission(submissionData);
      } catch (error: any) {
        set({ error: "Failed to add submission", isLoading: false });
      }
    },
  })
);
