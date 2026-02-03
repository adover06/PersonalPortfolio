"use client";

import * as React from "react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { MorphingText } from "@/components/ui/morphing-text"
import { HyperText } from "@/components/ui/hyper-text"

type ContributionDay = {
  date: string;
  count: number;
  level: number; // 0..4
};

type GithubPayload = {
  window?: { from: string; to: string; days: number };
  totalContributions: number;
  activeDays: number;
  maxDay: number;
  contributions: ContributionDay[];
};

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// GitHub calendar is weeks (columns) x 7 days (rows).
// We receive daily list; we’ll rebuild into weeks by grouping by 7 in date order.
function toWeeks(contributions: ContributionDay[]) {
  // contributions already in chronological order from GitHub calendar response
  return chunk(contributions, 7);
}



const levelClass: Record<number, string> = {
  0: "bg-neutral-800/70",
  1: "bg-emerald-900/80",
  2: "bg-emerald-800",
  3: "bg-emerald-600",
  4: "bg-emerald-400",
};

export function GithubActivityCard({
  year,
  className = "",
}: {
  year?: number;
  className?: string;
}) {
  const [data, setData] = React.useState<GithubPayload | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();

    (async () => {
      const res = await fetch(`/api/github?window=6m`, { signal: controller.signal });
      if (!res.ok) return;
      const json = (await res.json()) as GithubPayload;
      setData(json);
    })().catch(() => {});

    return () => controller.abort();
  }, [year]);

  const weeks = React.useMemo(() => (data ? toWeeks(data.contributions) : []), [data]);

  return (
    <section className={`bg-black text-white py-20 sm:py-24 flex justify-center ${className}`}>
      <div className="mx-auto max-w-6xl px-6 w-full">
        <header className="mb-6 sm:mb-8 flex justify-center">
          <HyperText>Contributions</HyperText>
        </header>
        <div className="rounded-3xl border border-white/10 bg-neutral-950/40 p-6 lg:p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_rgba(0,0,0,0.6)]">
          <div className="grid gap-8 lg:grid-cols-[2fr,1fr] items-start">
            {/* Heatmap */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/30 p-5">
              <div className="grid grid-flow-col gap-0.5 sm:gap-1 pb-2">
                {/* weeks = columns */}
                {weeks.length === 0 ? (
                  <div className="text-sm text-neutral-400">Loading…</div>
                ) : (
                  weeks.map((week, wi) => (
                    <div key={wi} className="grid grid-rows-7 gap-0.5 sm:gap-1">
                      {week.map((day, di) => (
                        <div
                          key={`${wi}-${di}`}
                          title={`${day.date}: ${day.count} contributions`}
                          className={[
                            "h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-[4px]",
                            "ring-[0.75px] ring-white/5",
                            levelClass[day.level] ?? levelClass[0],
                          ].join(" ")}
                        />
                      ))}
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 tracking-[0.35em] text-sm text-neutral-300">
                {data ? (
                  <>
                    {data.totalContributions} CONTRIBUTIONS IN <br />
                    LAST 6 MONTHS
                  </>
                ) : (
                  <>
                    — CONTRIBUTIONS IN <br />
                    LAST 6 MONTHS
                  </>
                )}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-2 text-xs text-neutral-400 mt-4">
                <span>Less</span>
                <span className="h-3 w-3 rounded-[4px] bg-neutral-800/70 ring-1 ring-white/5" />
                <span className="h-3 w-3 rounded-[4px] bg-emerald-900/80 ring-1 ring-white/5" />
                <span className="h-3 w-3 rounded-[4px] bg-emerald-800 ring-1 ring-white/5" />
                <span className="h-3 w-3 rounded-[4px] bg-emerald-600 ring-1 ring-white/5" />
                <span className="h-3 w-3 rounded-[4px] bg-emerald-400 ring-1 ring-white/5" />
                <span>More</span>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-6">
              <StatRow
                label="Total"
                value={data?.totalContributions ?? 0}
                suffix="contributions"
              />
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatRow({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div className="text-sm text-neutral-400">{label}</div>
      <div className="flex items-baseline gap-2">
        <NumberTicker
          value={value}
          className="text-6xl font-medium tracking-tight text-neutral-100"
        />
        {suffix ? <span className="text-sm text-neutral-400">{suffix}</span> : null}
      </div>
    </div>
  );
}
