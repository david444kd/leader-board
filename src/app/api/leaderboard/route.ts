import { NextResponse } from "next/server";

interface LeaderResponse {
  leaders: Leader[];
}

interface Leader {
  Rank: number;
  Name: string;
  Age: number;
  Score: number;
}

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  age: number;
  score: number;
}

export const GET = async () => {
  try {
    const response = await fetch(process.env.GOOGLESHEET_URL!);

    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }

    const data: LeaderResponse = await response.json();

    const entries: LeaderboardEntry[] = data.leaders.map((leader) => ({
      id: `${leader.Rank}-${leader.Name}`,
      rank: leader.Rank,
      name: leader.Name,
      age: leader.Age,
      score: leader.Score,
    }));

    return NextResponse.json(entries, {
      headers: { cache: "no-store" },
    });
  } catch (error) {
    console.error("Error", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard data" },
      { status: 500, headers: { cache: "no-store" } }
    );
  }
};
