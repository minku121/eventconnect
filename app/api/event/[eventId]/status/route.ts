import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(
  request: NextRequest
) {
  try {
    // Get eventId from request body instead of URL params
    const body = await request.json();
    const { eventId } = body;

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    // Get the event status
    const event = await prisma.event.findUnique({
      where: { eventId },
      select: { 
        status: true,
        meetingStarted: true
      }
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Return the event status
    return NextResponse.json({
      status: event.status,
      meetingStarted: event.meetingStarted
    });
    
  } catch (error) {
    console.error("Error fetching event status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
