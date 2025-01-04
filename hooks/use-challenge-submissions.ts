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
  submitChallenge: (submissionData: CreateSubmissionDTO) => Promise<void>;
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

    submitChallenge: async (submissionData: CreateSubmissionDTO) => {
      set({ isLoading: true, error: null });
      try {
        // First, check if user has already submitted for this challenge
        const { data: existingSubmissions } = await supabase
          .from('ChallengeSubmissions')
          .select('*')
          .eq('challenge_id', submissionData.challenge_id)
          .eq('user_id', submissionData.user_id);
  
        if (existingSubmissions && existingSubmissions.length > 0) {
          throw new Error('You have already submitted to this challenge');
        }
  
        // Get challenge details to verify submission is within timeframe
        const { data: challenge } = await supabase
          .from('Challenges')
          .select('*')
          .eq('challenge_id', submissionData.challenge_id)
          .single();
  
        if (!challenge) {
          throw new Error('Challenge not found');
        }
  
        const now = new Date();
        const endDate = new Date(challenge.end_date);
        if (now > endDate) {
          throw new Error('Challenge submission period has ended');
        }
  
        // Create the submission
        const { data: submission, error } = await supabase
          .from('ChallengeSubmissions')
          .insert([{
            ...submissionData,
            status: SubmissionStatus.PENDING,
            submitted_at: new Date().toISOString()
          }])
          .select()
          .single();
  
        if (error) throw error;
  
        // Create notification for challenge moderators
        await supabase
          .from('Notifications')
          .insert([{
            user_id: challenge.creator_id, // Assuming challenge has a creator_id
            title: 'New Challenge Submission',
            message: `New submission received for challenge: ${challenge.title}`,
            type: 'push',
            status: 'unread'
          }]);
  
        set((state) => ({
          submissions: [...state.submissions, submission as ChallengeSubmission],
          isLoading: false
        }));
  
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to submit challenge',
          isLoading: false
        });
        throw error;
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