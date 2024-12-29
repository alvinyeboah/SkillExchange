// Enum Types
export type UserStatus = "active" | "inactive" | "suspended";
export type NotificationType = "email" | "push" | "sms";
export type NotificationStatus = "unread" | "read";
export type NotificationFrequency = "realtime" | "daily" | "weekly";
export type ProfileVisibility = "public" | "private" | "friends";
export type ServiceStatus = "active" | "inactive" | "draft";
export type ServiceAvailability = "available" | "in_progress" | "completed";
export type RequestStatus = "pending" | "accepted" | "rejected" | "completed";
export type DeliverableStatus = "submitted" | "accepted" | "revision_requested";
export type VoteType = "upvote" | "downvote";
export type ActivityType = "post" | "share";
export type ActivityStatus = "pending" | "completed" | "failed";
export type MemberRole = "member" | "moderator" | "admin";
export type RequirementType =
  | "skill_level"
  | "challenges_completed"
  | "services_provided";

// Table Interfaces
export interface User {
  user_id: string;
  name: string;
  username: string;
  bio: string;
  email: string;
  password_hash: string;
  skillcoins: number;
  created_at: string;
  updated_at: string;
  role: string;
  status: UserStatus;
  avatar_url?: string;
  rating: number;
}

export interface UserSettings {
  setting_id: number;
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  notification_frequency: NotificationFrequency;
  language: string;
  profile_visibility: ProfileVisibility;
  show_online_status: boolean;
  allow_messages_from_strangers: boolean;
  data_usage_consent: boolean;
  created_at: string;
  updated_at: string;
}

export interface Skill {
    skill_id: string;  // Change this from number to string
    name: string;
    category: string;
    description: string;
    proficiency_level: number;
    endorsed_count: number;
  }
  
export interface Service {
  service_id: number;
  user_id: string;
  title: string;
  category: string;
  description: string;
  skillcoin_price: number;
  delivery_time: number;
  created_at: string;
  updated_at: string;
  status: ServiceStatus;
  tags?: string;
  requirements?: string;
  revisions: number;
  service_status: ServiceAvailability;
  winner?: string;
}

export interface ServiceRequest {
  request_id: number;
  service_id: number;
  requester_id: string;
  provider_id: string;
  status: RequestStatus;
  requirements?: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceDeliverable {
  deliverable_id: number;
  request_id: number;
  content: string;
  status: DeliverableStatus;
  feedback?: string;
  submitted_at: string;
}

export interface Challenge {
  challenge_id: number;
  title: string;
  description: string;
  reward_skillcoins: number;
  difficulty: string;
  category: string;
  skills: string;
  start_date: string;
  end_date: string;
  created_at: string;
  winner?: string;
}

export interface ChallengeParticipation {
  participation_id: number;
  challenge_id: number;
  user_id: string;
  progress: number;
  joined_at: string;
}

export interface ChallengeSubmission {
  submission_id: number;
  challenge_id: number;
  user_id: string;
  content: string;
  submission_url?: string;
  status: string;
  feedback?: string;
  submitted_at: string;
}

export interface ChallengeVote {
  vote_id: number;
  submission_id: number;
  voter_id: string;
  vote_type: VoteType;
  created_at: string;
}

export interface Achievement {
  achievement_id: number;
  title: string;
  description: string;
  icon_url?: string;
  requirement_type: RequirementType;
  requirement_value: number;
  skillcoins_reward: number;
}

export interface UserAchievement {
  user_id: string;
  achievement_id: number;
  earned_at: string;
}

export interface Community {
  community_id: number;
  name: string;
  description?: string;
  creator_id: string;
  created_at: string;
}

export interface CommunityMember {
  community_id: number;
  user_id: string;
  role: MemberRole;
  joined_at: string;
}

export interface CommunityPost {
  post_id: number;
  community_id: number;
  author_id: string;
  content: string;
  created_at: string;
}

export interface Activity {
  id: number;
  user_id: string;
  activity_type: ActivityType;
  description?: string;
  created_at: string;
  status: ActivityStatus;
}

export interface Notification {
  notification_id: number;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  created_at: string;
}

export interface Rating {
  rating_id: number;
  service_id: number;
  user_id: string;
  rating_value?: number;
  review?: string;
  created_at: string;
}

export interface Transaction {
  transaction_id: number;
  from_user_id: string;
  to_user_id: string;
  service_id: number;
  skillcoins_transferred: number;
  transaction_date: string;
  description: string;
  type: string;
}

export interface PaymentTransaction {
  id: number;
  user_id: string;
  amount: number;
  reference: string;
  transaction_id: string;
  status: string;
  created_at: string;
}

export interface Donation {
  donation_id: number;
  from_user_id: string;
  to_user_id: string;
  amount: number;
  created_at: string;
}

export interface Reminder {
  id: number;
  user_id: string;
  type: string;
  reference_id: number;
  title: string;
  datetime: string;
  notified: boolean;
  created_at: string;
  updated_at: string;
}

export interface SkillProgress {
  progress_id: number;
  user_id: string;
  skill_category: string;
  tasks_completed: number;
  skill_level: number;
  last_updated: string;
}

// Database type that includes all tables
export interface Database {
  Users: User;
  UserSettings: UserSettings;
  Services: Service;
  ServiceRequests: ServiceRequest;
  ServiceDeliverables: ServiceDeliverable;
  Challenges: Challenge;
  ChallengeParticipation: ChallengeParticipation;
  ChallengeSubmissions: ChallengeSubmission;
  ChallengeVotes: ChallengeVote;
  Achievements: Achievement;
  UserAchievements: UserAchievement;
  Communities: Community;
  CommunityMembers: CommunityMember;
  CommunityPosts: CommunityPost;
  Activity: Activity;
  Notifications: Notification;
  Ratings: Rating;
  Transactions: Transaction;
  PaymentTransactions: PaymentTransaction;
  Donations: Donation;
  Reminders: Reminder;
  SkillProgress: SkillProgress;
}
