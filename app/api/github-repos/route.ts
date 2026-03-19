import { NextResponse } from "next/server";

/*
  Fetches public repo data for the btop process list.
  Each repo becomes a "process" with commit activity as CPU%.
*/

const USERNAME = "adover06";

type RepoData = {
  name: string;
  full_name: string;
  created_at: string;
  pushed_at: string;
  size: number; // KB
  stargazers_count: number;
  language: string | null;
  description: string | null;
};

export async function GET() {
  try {
    // Fetch public repos
    const reposRes = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?sort=pushed&per_page=15&type=owner`,
      {
        headers: { Accept: "application/vnd.github.v3+json" },
        next: { revalidate: 1800 }, // cache 30 min
      }
    );

    if (!reposRes.ok) throw new Error("GitHub API failed");

    const repos: RepoData[] = await reposRes.json();

    // Fetch recent events for commit frequency
    const eventsRes = await fetch(
      `https://api.github.com/users/${USERNAME}/events/public?per_page=100`,
      {
        headers: { Accept: "application/vnd.github.v3+json" },
        next: { revalidate: 1800 },
      }
    );

    const commitCounts: Record<string, number> = {};
    if (eventsRes.ok) {
      const events = await eventsRes.json();
      // Count push events per repo in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      for (const event of events) {
        if (event.type === "PushEvent" && new Date(event.created_at) > thirtyDaysAgo) {
          const repoName = event.repo?.name?.split("/")[1] || event.repo?.name;
          const commits = event.payload?.commits?.length || 1;
          commitCounts[repoName] = (commitCounts[repoName] || 0) + commits;
        }
      }
    }

    // Calculate total commits for CPU% scaling
    const totalCommits = Object.values(commitCounts).reduce((a, b) => a + b, 0) || 1;

    const processes = repos.slice(0, 12).map((repo, i) => {
      const repoCommits = commitCounts[repo.name] || 0;
      const cpuPct = totalCommits > 0 ? Math.round((repoCommits / totalCommits) * 80) : 0;
      const memPct = Math.min(Math.round(repo.size / 500), 30); // rough size-based MEM
      const pid = new Date(repo.created_at).getFullYear();
      const pushedAt = new Date(repo.pushed_at);
      const hoursAgo = Math.round((Date.now() - pushedAt.getTime()) / 3600000);

      return {
        pid,
        name: repo.name,
        cpu: Math.max(cpuPct, repoCommits > 0 ? 1 : 0),
        mem: Math.max(memPct, 1),
        commits: repoCommits,
        language: repo.language,
        description: repo.description,
        lastPush: hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.round(hoursAgo / 24)}d ago`,
        stars: repo.stargazers_count,
      };
    });

    // Sort by CPU (activity) descending
    processes.sort((a, b) => b.cpu - a.cpu);

    return NextResponse.json({
      totalRepos: repos.length,
      totalCommits30d: totalCommits,
      processes,
    });
  } catch {
    return NextResponse.json({
      totalRepos: 0,
      totalCommits30d: 0,
      processes: [],
    });
  }
}
