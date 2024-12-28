import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// Enum for submission status
export enum SubmissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

// DTO for creating a new submission
interface CreateSubmissionDTO {
  challenge_id: number;
  user_id: string;
  content: string;
  submission_url: string;
}

// Full submission interface including all fields
interface ChallengeSubmission extends Omit<CreateSubmissionDTO, 'user_id'> {
  submission_id: number;
  user_id: string;
  status: SubmissionStatus;
  created_at: string;
  updated_at: string;
  feedback?: string;
}

interface ChallengeSubmissionsState {
  submissions: ChallengeSubmission[];
  isLoading: boolean;
  error: string | null;
  addSubmission: (submissionData: CreateSubmissionDTO) => Promise<ChallengeSubmission | null>;
  fetchUserSubmissions: (userId: string) => Promise<void>;
  fetchChallengeSubmissions: (challengeId: number) => Promise<void>;
  updateSubmissionStatus: (
    submissionId: number, 
    status: SubmissionStatus, 
    feedback?: string
  ) => Promise<void>;
}

export const useChallengeSubmissions = create<ChallengeSubmissionsState>(
  (set, get) => ({
    submissions: [],
    isLoading: false,
    error: null,

    addSubmission: async (submissionData: CreateSubmissionDTO) => {
      set({ isLoading: true, error: null });
      try {
        // Validate submission data
        if (!submissionData.challenge_id || !submissionData.user_id || !submissionData.content) {
          throw new Error('Missing required submission fields');
        }

        const { data: newSubmission, error } = await supabase
          .from('challenge_submissions')
          .insert([{
            ...submissionData,
            status: SubmissionStatus.PENDING
          }])
          .select('*')
          .single();

        if (error) throw new Error(error.message);

        set((state) => ({
          submissions: [...state.submissions, newSubmission as ChallengeSubmission],
          isLoading: false
        }));

        return newSubmission as ChallengeSubmission;
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to add submission', 
          isLoading: false 
        });
        return null;
      }
    },

    fetchUserSubmissions: async (userId: string) => {
      set({ isLoading: true, error: null });
      try {
        const { data: submissions, error } = await supabase
          .from('challenge_submissions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);

        set({ 
          submissions: submissions as ChallengeSubmission[], 
          isLoading: false 
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch submissions', 
          isLoading: false 
        });
      }
    },

    fetchChallengeSubmissions: async (challengeId: number) => {
      set({ isLoading: true, error: null });
      try {
        const { data: submissions, error } = await supabase
          .from('challenge_submissions')
          .select('*')
          .eq('challenge_id', challengeId)
          .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);

        set({ 
          submissions: submissions as ChallengeSubmission[], 
          isLoading: false 
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch challenge submissions', 
          isLoading: false 
        });
      }
    },

    updateSubmissionStatus: async (submissionId: number, status: SubmissionStatus, feedback?: string) => {
      set({ isLoading: true, error: null });
      try {
        const { data: updatedSubmission, error } = await supabase
          .from('challenge_submissions')
          .update({ 
            status,
            feedback,
            updated_at: new Date().toISOString()
          })
          .eq('submission_id', submissionId)
          .select()
          .single();

        if (error) throw new Error(error.message);

        set((state) => ({
          submissions: state.submissions.map(sub => 
            sub.submission_id === submissionId 
              ? { ...sub, ...updatedSubmission } 
              : sub
          ),
          isLoading: false
        }));
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to update submission status', 
          isLoading: false 
        });
      }
    }
  })
);