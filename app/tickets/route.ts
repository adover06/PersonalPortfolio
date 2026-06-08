import { NextResponse } from "next/server";

const PAYLOAD = [
  false,
  {
    generatedAt: "2025-12-14T22:30:00Z",
    visitorCenters: [
      {
        centerId: "001-YOSEMITE",
        name: "Yosemite Valley",
        city: "Yosemite Village",
        timeZone: "America/Los_Angeles",
        distanceMiles: "12.3",
        ticketPrices: { adult: "35.00", child: "0.00", senior: "N/A" },
      },
      {
        centerId: "002-YELLOWSTONE",
        name: "Yellowstone",
        city: "Mammoth",
        timeZone: "America/Denver",
        distanceMiles: "847.5",
        ticketPrices: { adult: "35.00", child: "0.00", senior: "20.00" },
      },
      {
        centerId: "003-ACADIA",
        name: "Acadia",
        city: "Bar Harbor",
        timeZone: "America/New_York",
        distanceMiles: "2951.1",
        ticketPrices: { adult: "35.00", child: "0.00", senior: "N/A" },
      },
      {
        centerId: "004-SAGUARO",
        name: "Saguaro",
        city: "Tucson",
        timeZone: "America/Phoenix",
        distanceMiles: "731.8",
        ticketPrices: { adult: "25.00", child: "0.00", senior: "15.00" },
      },
    ],
    metadata: {
      serverInstance: "aws-us-west-2-cluster-b",
      latency: "38ms",
      api_version: "v2.0-deprecated",
    },
  },
] as const;

export async function GET() {
  return NextResponse.json(PAYLOAD);
}
