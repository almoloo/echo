import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "Unknown";

  console.log("IP:", ip);

  return new Response(ip);
}
