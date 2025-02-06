import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
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
      where: { id: parseInt(body.id) },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    if (existingEvent.createdById !== session?.user.id) {
      return NextResponse.json(
        { error: "Forbidden - You can only delete your own events" },
        { status: 403 }
      );
    }

    
    await prisma.eventAnalytics.deleteMany({
      where: { eventId: existingEvent.id }
    });

    // Delete the event
    await prisma.event.delete({
      where: { id: existingEvent.id }
    });

    await prisma.activity.create({
      data: {
        userId: session.user.id,
        type: "EVENT_DELETION", 
        description: `Deleted event: ${existingEvent.name}`
      }
    });

    return NextResponse.json(
      { success: true, message: "Event deleted successfully" }
    );

  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 