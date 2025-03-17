import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { eventId } = await request.json();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    const existingAttendance = await prisma.eventAttendee.findUnique({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: session.user.id
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

    const updatedAttendance = await prisma.eventAttendee.update({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: session.user.id
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
    console.error("Error recording attendance:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 