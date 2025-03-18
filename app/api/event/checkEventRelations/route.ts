import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id: parseInt(body.eventId) },
      include: {
        attendees: { select: { userId: true }, take: 1 },
        certificates: { select: { id: true }, take: 1 }
      }
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized to delete this event
    if (existingEvent.createdById !== session?.user.id) {
      return NextResponse.json(
        { error: "Forbidden - You can only delete your own events" },
        { status: 403 }
      );
    }

    const hasAttendees = existingEvent.attendees.length > 0;
    const hasCertificates = existingEvent.certificates.length > 0;

    return NextResponse.json({
      hasAttendees,
      hasCertificates,
      eventName: existingEvent.name
    });

  } catch (error) {
    console.error("Error checking event relations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
