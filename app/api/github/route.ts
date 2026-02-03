import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 1 hour

type ContributionDay = {
  date: string; // YYYY-MM-DD
  count: number;
  level: number;
};

type ApiContribution = {
  date: string;
  count: number;
  level: number;
};

type ApiResponse = {
  total: Record<string, number>;
  contributions: ApiContribution[];
};

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

async function fetchYear(username: string, year: number) {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`,
    { headers: { "User-Agent": "Portfolio/1.0" } }
  );
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return (await res.json()) as ApiResponse;
}

export async function GET() {
  try {
    const username = "adover06";

    const end = new Date(); // today
    const start = addDays(end, -182); // inclusive window: 365 days
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    // Fetch both years if needed
    const [a, b] = await Promise.all([
      fetchYear(username, startYear),
      startYear === endYear ? Promise.resolve(null) : fetchYear(username, endYear),
    ]);

    const all = [
      ...a.contributions,
      ...(b?.contributions ?? []),
    ]
      .map((day) => ({
        date: day.date,
        count: day.count,
        level: day.level,
      }))
      // ensure sorted
      .sort((x, y) => x.date.localeCompare(y.date));

    const startISO = toISODate(start);
    const endISO = toISODate(end);

    const contributions = all.filter(
      (d) => d.date >= startISO && d.date <= endISO
    );

    const totalContributions = contributions.reduce((sum, d) => sum + d.count, 0);

    return NextResponse.json({
      username,
      from: startISO,
      to: endISO,
      contributions,
      totalContributions,
    });
  } catch (error) {
    console.error("Failed to fetch GitHub contributions:", error);
    return NextResponse.json(
      { contributions: [], totalContributions: 0 },
      { status: 200 }
    );
  }
}
