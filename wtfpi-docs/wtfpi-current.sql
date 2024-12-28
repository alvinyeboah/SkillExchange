-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE notification_type AS ENUM ('email', 'push', 'sms');
CREATE TYPE notification_status AS ENUM ('unread', 'read');
CREATE TYPE notification_frequency AS ENUM ('realtime', 'daily', 'weekly');
CREATE TYPE profile_visibility AS ENUM ('public', 'private', 'friends');
CREATE TYPE service_status AS ENUM ('active', 'inactive', 'draft');
CREATE TYPE service_availability AS ENUM ('available', 'in_progress', 'completed');
CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');
CREATE TYPE deliverable_status AS ENUM ('submitted', 'accepted', 'revision_requested');
CREATE TYPE vote_type AS ENUM ('upvote', 'downvote');
CREATE TYPE activity_type AS ENUM ('post', 'share');
CREATE TYPE activity_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE member_role AS ENUM ('member', 'moderator', 'admin');
CREATE TYPE requirement_type AS ENUM ('skill_level', 'challenges_completed', 'services_provided');

-- Create tables
CREATE TABLE "Users" (
    "user_id" text PRIMARY KEY,
    "name" VARCHAR(30) NOT NULL,
    "username" VARCHAR(50) UNIQUE NOT NULL,
    "bio" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) UNIQUE NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "skillcoins" INTEGER DEFAULT 10,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" VARCHAR(50) DEFAULT 'user',
    "status" user_status NOT NULL DEFAULT 'active',
    "avatar_url" VARCHAR(255),
    "rating" DECIMAL(3,2) DEFAULT 0.00
);

CREATE TABLE "UserSettings" (
    "setting_id" SERIAL PRIMARY KEY,
    "user_id" text NOT NULL,
    "email_notifications" BOOLEAN DEFAULT TRUE,
    "push_notifications" BOOLEAN DEFAULT TRUE,
    "sms_notifications" BOOLEAN DEFAULT FALSE,
    "notification_frequency" notification_frequency DEFAULT 'realtime',
    "language" VARCHAR(10) DEFAULT 'en',
    "profile_visibility" profile_visibility DEFAULT 'public',
    "show_online_status" BOOLEAN DEFAULT TRUE,
    "allow_messages_from_strangers" BOOLEAN DEFAULT TRUE,
    "data_usage_consent" BOOLEAN DEFAULT FALSE,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE
);

CREATE TABLE "Services" (
    "service_id" SERIAL PRIMARY KEY,
    "user_id" text NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "category" VARCHAR(10) NOT NULL,
    "description" TEXT NOT NULL,
    "skillcoin_price" INTEGER NOT NULL,
    "delivery_time" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" service_status NOT NULL DEFAULT 'active',
    "tags" TEXT,
    "requirements" TEXT,
    "revisions" INTEGER DEFAULT 1,
    "service_status" service_availability DEFAULT 'available',
    "winner" text REFERENCES "Users"("user_id") ON DELETE SET NULL,
    FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE
);

CREATE TABLE "ServiceRequests" (
    "request_id" SERIAL PRIMARY KEY,
    "service_id" INTEGER NOT NULL,
    "requester_id" text NOT NULL,
    "provider_id" text NOT NULL,
    "status" request_status DEFAULT 'pending',
    "requirements" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("service_id") REFERENCES "Services"("service_id") ON DELETE CASCADE,
    FOREIGN KEY ("requester_id") REFERENCES "Users"("user_id") ON DELETE CASCADE,
    FOREIGN KEY ("provider_id") REFERENCES "Users"("user_id") ON DELETE CASCADE
);

CREATE TABLE "ServiceDeliverables" (
    "deliverable_id" SERIAL PRIMARY KEY,
    "request_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "status" deliverable_status DEFAULT 'submitted',
    "feedback" TEXT,
    "submitted_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("request_id") REFERENCES "ServiceRequests"("request_id") ON DELETE CASCADE
);

CREATE TABLE "Challenges" (
    "challenge_id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "reward_skillcoins" INTEGER NOT NULL,
    "difficulty" VARCHAR(50) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "skills" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "winner" text REFERENCES "Users"("user_id") ON DELETE SET NULL
);

CREATE TABLE "ChallengeParticipation" (
    "participation_id" SERIAL PRIMARY KEY,
    "challenge_id" INTEGER NOT NULL,
    "user_id" text NOT NULL,
    "progress" INTEGER DEFAULT 0,
    "joined_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("challenge_id") REFERENCES "Challenges"("challenge_id") ON DELETE CASCADE,
    FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE
);

CREATE TABLE "ChallengeSubmissions" (
    "submission_id" SERIAL PRIMARY KEY,
    "challenge_id" INTEGER NOT NULL,
    "user_id" text NOT NULL,
    "content" TEXT NOT NULL,
    "submission_url" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'pending',
    "feedback" TEXT,
    "submitted_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("challenge_id") REFERENCES "Challenges"("challenge_id") ON DELETE CASCADE,
    FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE
);

CREATE TABLE "ChallengeVotes" (
    "vote_id" SERIAL PRIMARY KEY,
    "submission_id" INTEGER NOT NULL,
    "voter_id" text NOT NULL,
    "vote_type" vote_type NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("submission_id") REFERENCES "ChallengeSubmissions"("submission_id") ON DELETE CASCADE,
    FOREIGN KEY ("voter_id") REFERENCES "Users"("user_id") ON DELETE CASCADE
);

CREATE TABLE "Achievements" (
    "achievement_id" SERIAL PRIMARY KEY,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "icon_url" VARCHAR(255),
    "requirement_type" requirement_type NOT NULL,
    "requirement_value" INTEGER NOT NULL,
    "skillcoins_reward" INTEGER DEFAULT 0
);

CREATE TABLE "UserAchievements" (
    "user_id" text NOT NULL,
    "achievement_id" INTEGER NOT NULL,
    "earned_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("user_id", "achievement_id"),
    FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE,
    FOREIGN KEY ("achievement_id") REFERENCES "Achievements"("achievement_id") ON DELETE CASCADE
);

CREATE TABLE "Communities" (
    "community_id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "creator_id" text NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("creator_id") REFERENCES "Users"("user_id") ON DELETE CASCADE
);

CREATE TABLE "CommunityMembers" (
    "community_id" INTEGER NOT NULL,
    "user_id" text NOT NULL,
    "role" member_role DEFAULT 'member',
    "joined_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("community_id", "user_id"),
    FOREIGN KEY ("community_id") REFERENCES "Communities"("community_id") ON DELETE CASCADE,
    FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE
);

CREATE TABLE "CommunityPosts" (
    "post_id" SERIAL PRIMARY KEY,
    "community_id" INTEGER NOT NULL,
    "author_id" text NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("community_id") REFERENCES "Communities"("community_id") ON DELETE CASCADE,
    FOREIGN KEY ("author_id") REFERENCES "Users"("user_id") ON DELETE CASCADE
);

CREATE TABLE "Activity" (
    "id" SERIAL PRIMARY KEY,
    "user_id" text NOT NULL,
    "activity_type" activity_type NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" activity_status NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE
);

CREATE TABLE "Notifications" (
    "notification_id" SERIAL PRIMARY KEY,
    "user_id" text NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "type" notification_type NOT NULL,
    "status" notification_status DEFAULT 'unread',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE
);

CREATE TABLE "Ratings" (
    "rating_id" SERIAL PRIMARY KEY,
    "service_id" INTEGER NOT NULL,
    "user_id" text NOT NULL,
    "rating_value" INTEGER,
    "review" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("service_id") REFERENCES "Services"("service_id") ON DELETE CASCADE,
    FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE
);

CREATE TABLE "Transactions" (
    "transaction_id" SERIAL PRIMARY KEY,
    "from_user_id" text NOT NULL,
    "to_user_id" text NOT NULL,
    "service_id" INTEGER NOT NULL,
    "skillcoins_transferred" INTEGER NOT NULL,
    "transaction_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" VARCHAR(50) NOT NULL,
    "type" VARCHAR(15) NOT NULL,
    FOREIGN KEY ("from_user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE,
    FOREIGN KEY ("to_user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE,
    FOREIGN KEY ("service_id") REFERENCES "Services"("service_id") ON DELETE CASCADE
);

CREATE TABLE "PaymentTransactions" (
    "id" SERIAL PRIMARY KEY,
    "user_id" text NOT NULL,
    "amount" INTEGER NOT NULL,
    "reference" VARCHAR(255) NOT NULL,
    "transaction_id" VARCHAR(255) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE
);

CREATE TABLE "Donations" (
    "donation_id" SERIAL PRIMARY KEY,
    "from_user_id" text NOT NULL,
    "to_user_id" text NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("from_user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE,
    FOREIGN KEY ("to_user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE
);

CREATE TABLE "Reminders" (
    "id" SERIAL PRIMARY KEY,
    "user_id" text NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "reference_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "datetime" TIMESTAMP NOT NULL,
    "notified" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE
);

CREATE TABLE "SkillProgress" (
    "progress_id" SERIAL PRIMARY KEY,
    "user_id" text NOT NULL,
    "skill_category" VARCHAR(50) NOT NULL,
    "tasks_completed" INTEGER DEFAULT 0,
    "skill_level" INTEGER DEFAULT 1,
    "last_updated" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE
);

CREATE TABLE "Reviews" (
    "review_id" SERIAL PRIMARY KEY,
    "service_id" INTEGER NOT NULL,
    "reviewer_id" text NOT NULL,
    "provider_id" text NOT NULL,
    "rating" INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("service_id") REFERENCES "Services"("service_id") ON DELETE CASCADE,
    FOREIGN KEY ("reviewer_id") REFERENCES "Users"("user_id") ON DELETE CASCADE,
    FOREIGN KEY ("provider_id") REFERENCES "Users"("user_id") ON DELETE CASCADE
);

-- Create Skills table to store all available skills
CREATE TABLE "Skills" (
    "skill_id" SERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL UNIQUE,
    "category" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create UserSkills junction table for many-to-many relationship
CREATE TABLE "UserSkills" (
    "user_id" text NOT NULL,
    "skill_id" INTEGER NOT NULL,
    "proficiency_level" INTEGER CHECK (proficiency_level BETWEEN 1 AND 5),
    "endorsed_count" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("user_id", "skill_id"),
    FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE,
    FOREIGN KEY ("skill_id") REFERENCES "Skills"("skill_id") ON DELETE CASCADE
);



-- Insert some sample skills
INSERT INTO "Skills" (name, category, description) VALUES
    ('JavaScript', 'Programming', 'Modern JavaScript/ECMAScript programming'),
    ('Python', 'Programming', 'Python programming language'),
    ('React', 'Frontend', 'React.js library for building user interfaces'),
    ('Node.js', 'Backend', 'Server-side JavaScript runtime'),
    ('PostgreSQL', 'Database', 'Advanced open source database'),
    ('AWS', 'Cloud', 'Amazon Web Services cloud platform'),
    ('UI Design', 'Design', 'User Interface Design'),
    ('Docker', 'DevOps', 'Containerization platform'),
    ('TypeScript', 'Programming', 'Typed JavaScript programming'),
    ('GraphQL', 'API', 'API query language');


-- Create indexes for performance
CREATE INDEX idx_participation_challenge ON "ChallengeParticipation"("challenge_id");
CREATE INDEX idx_participation_user ON "ChallengeParticipation"("user_id");
CREATE INDEX idx_challenge_dates ON "Challenges"("start_date", "end_date");
CREATE INDEX idx_reviews_service ON "Reviews"("service_id");
CREATE INDEX idx_reviews_provider ON "Reviews"("provider_id");
CREATE INDEX idx_user_skills ON "UserSkills"("user_id");
CREATE INDEX idx_skills_category ON "Skills"("category");