import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

/*
  Stores user-set gradient theme with a 1-hour TTL.
  Falls back to default when expired or missing.
*/

const THEME_FILE = path.join(process.cwd(), ".theme.json");
const TTL_MS = 60 * 60 * 1000; // 1 hour

const DEFAULT_THEME = {
  gradient: "from-cyan-400 via-blue-400 to-purple-500",
  label: "Default (Cyan → Blue → Purple)",
  setBy: null as string | null,
  setAt: 0,
};

type ThemeData = typeof DEFAULT_THEME;

async function readTheme(): Promise<ThemeData> {
  try {
    const raw = await readFile(THEME_FILE, "utf-8");
    const data: ThemeData = JSON.parse(raw);
    // Check TTL
    if (Date.now() - data.setAt > TTL_MS) {
      return DEFAULT_THEME;
    }
    return data;
  } catch {
    return DEFAULT_THEME;
  }
}

export async function GET() {
  const theme = await readTheme();
  const timeLeft = theme.setAt > 0
    ? Math.max(0, TTL_MS - (Date.now() - theme.setAt))
    : 0;

  return NextResponse.json({
    ...theme,
    isDefault: theme.setAt === 0 || Date.now() - theme.setAt > TTL_MS,
    expiresIn: Math.round(timeLeft / 60000), // minutes
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { gradient, label, setBy } = body;

    if (!gradient || typeof gradient !== "string") {
      return NextResponse.json({ error: "Missing gradient" }, { status: 400 });
    }

    const theme: ThemeData = {
      gradient,
      label: label || gradient,
      setBy: setBy || "anonymous",
      setAt: Date.now(),
    };

    await writeFile(THEME_FILE, JSON.stringify(theme, null, 2));
    return NextResponse.json({ ok: true, ...theme });
  } catch {
    return NextResponse.json({ error: "Failed to save theme" }, { status: 500 });
  }
}
