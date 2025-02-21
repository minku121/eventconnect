import { generateToken04 } from "@/lib/zegoTokenGenerator";
import { NextResponse, NextRequest } from "next/server";


export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const meetingId = searchParams.get("meetingId");

    if (!meetingId) {
      console.error("Missing meetingId");
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    const appID = Number(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_SERVER_SECRET;

    if (!appID || isNaN(appID) || !serverSecret) {
      console.error("Zego credentials are missing or invalid.");
      return NextResponse.json(
        { error: "Zego credentials not configured properly" },
        { status: 500 }
      );
    }

    console.log("Generating token for:", meetingId);

    const effectiveTimeInSeconds = 3600; // Token valid for 1 hour
    const userID = `user_${Math.floor(Math.random() * 10000)}`;

    const token = generateToken04(
      appID,
      userID,
      serverSecret,
      effectiveTimeInSeconds,
      meetingId
    );

    console.log("Generated token:", token);

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Token generation error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: "Failed to generate token", details: errorMessage },
      { status: 500 }
    );
  }
}
