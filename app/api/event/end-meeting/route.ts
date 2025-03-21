import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { eventId } = await req.json();

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { eventId },
      include: { createdBy: true }
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.createdById !== session?.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update event status to ENDED
    const updatedEvent = await prisma.event.update({
      where: { eventId },
      data: { 
        status: "ENDED",
        meetingId: null,
        endTime: new Date(),
        meetingStarted: false
      }
    });

    // Get all participants to create notifications
    const participants = await prisma.user.findMany({
      where: {
        joinedEvents: {
          some: { eventId }
        }
      },
      select: { id: true }
    });

    // Create a notification for each participant that the meeting has ended
    if (participants.length > 0) {
      await prisma.notification.createMany({
        data: participants.map(({ id }) => ({
          userId: id,
          type: "OTHER",
          message: `Meeting for event "${updatedEvent.name}" has ended. Thank you for participating.`,
          read: false
        }))
      });

      // Update attendance records for all participants who were still in the meeting
      await prisma.eventAttendee.updateMany({
        where: {
          eventId: eventId,
          leftAt: null // Only update records where user hasn't left yet
        },
        data: {
          leftAt: new Date(), // Mark as left at the current time
        }
      });
    }

    // Calculate and update analytics for the event
    const attendees = await prisma.eventAttendee.findMany({
      where: { eventId }
    });

    // Calculate total unique participants that joined
    const totalJoined = attendees.length;
    
    // Calculate average duration in minutes
    let totalDurationMs = 0;
    attendees.forEach(attendee => {
      totalDurationMs += attendee.totalDuration || 0;
    });
    const averageDuration = totalJoined > 0 ? (totalDurationMs / totalJoined) / 60000 : 0; // Convert to minutes

    // Update the event analytics
    await prisma.eventAnalytics.upsert({
      where: { eventId },
      update: {
        totalJoined,
        averageDuration,
      },
      create: {
        eventId,
        totalJoined,
        averageDuration,
      }
    });

    return NextResponse.json({
      success: true,
      message: "Meeting has been ended successfully",
      event: updatedEvent
    });
  } catch (error) {
    console.error("Error in end-meeting route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}