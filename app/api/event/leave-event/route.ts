import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { eventId, reason = 'unspecified' } = await request.json();

    // For beacon API requests that might not have a session
    const userId = session?.user?.id;
    
    if (!userId && !request.headers.get('x-sendbeacon')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    // Handle beacon API requests which might come from beforeunload event
    const isBeacon = request.headers.get('x-sendbeacon') === 'true';
    
    console.log(`Recording leave event for user ${userId} from event ${eventId}. Reason: ${reason}. Beacon: ${isBeacon}`);

    // Only proceed if we have a valid userId
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const existingAttendance = await prisma.eventAttendee.findUnique({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId
        }
      }
    });

    if (!existingAttendance) {
      return NextResponse.json({ error: "Attendance record not found" }, { status: 404 });
    }

    if (existingAttendance.leftAt) {
      return NextResponse.json({ error: "User has already left the event" }, { status: 400 });
    }

    // Calculate duration since last join
    const duration = (new Date().getTime() - existingAttendance.joinedAt.getTime()) / (1000 * 60);

    // Store the reason in the console log rather than trying to add it to the database
    console.log(`User ${userId} left event ${eventId} for reason: ${reason}`);

    const updatedAttendance = await prisma.eventAttendee.update({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId
        }
      },
      data: {
        leftAt: new Date(),
        totalDuration: {
          increment: duration
        }
      }
    });

    return NextResponse.json({ success: true, data: updatedAttendance });
  } catch (error) {
    console.error("Error recording leave event:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}