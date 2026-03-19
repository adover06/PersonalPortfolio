import { NextResponse } from "next/server";

// Open-Meteo API — free, no key needed
// San Jose, CA coordinates
const LAT = 37.3382;
const LON = -121.8863;

export async function GET() {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&temperature_unit=fahrenheit&timezone=America/Los_Angeles`,
      { next: { revalidate: 600 } } // cache 10 min
    );

    if (!res.ok) throw new Error("Weather API failed");

    const data = await res.json();
    const current = data.current;

    // Map WMO weather codes to descriptions
    const weatherCodes: Record<number, string> = {
      0: "Clear", 1: "Mostly Clear", 2: "Partly Cloudy", 3: "Overcast",
      45: "Foggy", 48: "Fog", 51: "Light Drizzle", 53: "Drizzle",
      55: "Heavy Drizzle", 61: "Light Rain", 63: "Rain", 65: "Heavy Rain",
      71: "Light Snow", 73: "Snow", 75: "Heavy Snow", 80: "Rain Showers",
      95: "Thunderstorm",
    };

    return NextResponse.json({
      temp: Math.round(current.temperature_2m),
      condition: weatherCodes[current.weather_code] || "Unknown",
      humidity: current.relative_humidity_2m,
      wind: Math.round(current.wind_speed_10m),
      location: "San Jose, CA",
    });
  } catch {
    return NextResponse.json({
      temp: 72,
      condition: "Clear",
      humidity: 45,
      wind: 8,
      location: "San Jose, CA",
    });
  }
}
