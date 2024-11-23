import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// Add this interface before the reduce function
interface ParticipationMap {
  [key: number]: {
    participants: number;
    avgProgress: number;
  }
}

export async function GET(req: Request) {
  try {
    // First, fetch basic challenge information
    const [challenges] = await pool.query<RowDataPacket[]>(`
      SELECT 
        c.challenge_id,
        c.title,
        c.description,
        c.reward_skillcoins,
        c.difficulty,
        c.category,
        c.skills,
        c.start_date,
        c.end_date,
        c.created_at
      FROM Challenges c
      ORDER BY c.start_date DESC
    `);

    // Then, fetch participation counts separately
    const [participationCounts] = await pool.query<RowDataPacket[]>(`
      SELECT 
        challenge_id,
        COUNT(DISTINCT user_id) as participant_count,
        AVG(progress) as avg_progress
      FROM ChallengeParticipation
      GROUP BY challenge_id
    `);

    // Create a map of participation data
    const participationMap = participationCounts.reduce<ParticipationMap>((acc, curr) => {
      acc[curr.challenge_id] = {
        participants: curr.participant_count,
        avgProgress: curr.avg_progress || 0
      };
      return acc;
    }, {});

    // Process the challenges
    const processedChallenges = challenges.map(challenge => {
      const now = new Date();
      const startDate = new Date(challenge.start_date);
      const endDate = new Date(challenge.end_date);

      let status;
      if (now < startDate) {
        status = 'upcoming';
      } else if (now > endDate) {
        status = 'completed';
      } else {
        status = 'active';
      }

      // Parse skills if it's stored as JSON string
      let skills = challenge.skills;
      try {
        if (typeof challenge.skills === 'string') {
          skills = JSON.parse(challenge.skills);
        }
      } catch (e) {
        skills = [];
      }

      const participation = participationMap[challenge.challenge_id] || {
        participants: 0,
        avgProgress: 0
      };

      return {
        ...challenge,
        status,
        skills,
        participants: participation.participants,
        progress: Math.round(participation.avgProgress),
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        timeLeft: getTimeLeft(startDate, endDate, status)
      };
    });

    return NextResponse.json(processedChallenges, { status: 200 });
  } catch (error: any) {
    console.error('Challenge fetch error:', error);
    return NextResponse.json(
      { message: "Failed to fetch challenges", error: error.message },
      { status: 500 }
    );
  }
}

// Helper function to calculate time left
function getTimeLeft(startDate: Date, endDate: Date, status: string): string {
  const now = new Date();
  let timeLeft = '';

  if (status === 'upcoming') {
    const daysToStart = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    timeLeft = `Starts in ${daysToStart} days`;
  } else if (status === 'active') {
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    timeLeft = `${daysLeft} days left`;
  } else {
    timeLeft = 'Completed';
  }

  return timeLeft;
}

export async function POST(req: Request) {
  try {
    const {
      title,
      description,
      reward_skillcoins,
      difficulty,
      category,
      skills,
      start_date,
      end_date
    } = await req.json();

    // Store skills as a JSON string
    const skillsJson = JSON.stringify(skills);

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO Challenges (
        title, description, reward_skillcoins, difficulty, 
        category, skills, start_date, end_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        reward_skillcoins,
        difficulty,
        category,
        skillsJson,
        start_date,
        end_date
      ]
    );

    return NextResponse.json(
      {
        message: "Challenge created successfully",
        challenge: {
          challenge_id: result.insertId,
          title,
          description,
          reward_skillcoins,
          difficulty,
          category,
          skills,
          start_date,
          end_date,
          status: 'upcoming',
          participants: 0,
          progress: 0
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Challenge creation error:', error);
    return NextResponse.json(
      { message: "Failed to create challenge", error: error.message },
      { status: 500 }
    );
  }
}
