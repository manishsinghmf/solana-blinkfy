import { NextResponse } from "next/server";

const DEFAULT_API_URL = "http://localhost:3001";
const ACTIONS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Content-Encoding, Accept-Encoding, x-blockchain-ids, x-action-version",
};

export function GET() {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL).replace(/\/$/, "");

  return NextResponse.json(
    {
      rules: [
        {
          pathPattern: "/*",
          apiPath: "/api/actions/*",
        },
        {
          pathPattern: "/api/actions/**",
          apiPath: `${apiUrl}/api/actions/**`,
        },
      ],
    },
    {
      headers: ACTIONS_HEADERS,
    },
  );
}

export const OPTIONS = GET;
