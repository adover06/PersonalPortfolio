import { NextResponse } from "next/server";

/*
  Spotify "Now Playing" API route.

  Setup required:
  1. Go to https://developer.spotify.com/dashboard and create an app
  2. Set redirect URI to http://127.0.0.1:3000/callback
  3. Get your refresh token (one-time OAuth flow)
  4. Add to .env:
     SPOTIFY_CLIENT_ID=your_client_id
     SPOTIFY_CLIENT_SECRET=your_client_secret
     SPOTIFY_REFRESH_TOKEN=your_refresh_token
*/

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

async function getAccessToken(): Promise<string | null> {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) return null;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token ?? null;
}

export async function GET() {
  const token = await getAccessToken();

  if (!token) {
    return NextResponse.json({
      playing: false,
      configured: false,
      track: null,
    });
  }

  try {
    // Try currently playing first
    const res = await fetch(NOW_PLAYING_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 200) {
      const data = await res.json();
      if (data.item) {
        return NextResponse.json({
          playing: data.is_playing,
          configured: true,
          track: {
            name: data.item.name,
            artist: data.item.artists.map((a: { name: string }) => a.name).join(", "),
            album: data.item.album?.name,
            progress: data.progress_ms,
            duration: data.item.duration_ms,
          },
        });
      }
    }

    // Fall back to recently played
    const recentRes = await fetch(RECENTLY_PLAYED_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (recentRes.ok) {
      const recentData = await recentRes.json();
      const item = recentData.items?.[0]?.track;
      if (item) {
        return NextResponse.json({
          playing: false,
          configured: true,
          track: {
            name: item.name,
            artist: item.artists.map((a: { name: string }) => a.name).join(", "),
            album: item.album?.name,
            progress: item.duration_ms,
            duration: item.duration_ms,
          },
        });
      }
    }

    return NextResponse.json({ playing: false, configured: true, track: null });
  } catch {
    return NextResponse.json({ playing: false, configured: true, track: null });
  }
}
