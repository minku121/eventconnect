import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    
    if (!body.id || !body.name || !body.location || !body.dateTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
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
      where: { id: body.id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    if (existingEvent.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Convert datetime to proper Date object (already handles ISO strings)
    const eventDateTime = new Date(body.dateTime);
    if (isNaN(eventDateTime.getTime())) {
      return NextResponse.json(
        { error: "Invalid datetime format" },
        { status: 400 }
      );
    }

    // Update event in database
    const updatedEvent = await prisma.event.update({
      where: { id: body.id },
      data: {
        name: body.name,
        description: body.description,
        image: body.image,
        location: body.location,
        dateTime: eventDateTime,
        islimited: body.islimited,
        maxParticipants: body.islimited ? body.maxParticipants : null,
        ispublic: body.ispublic,
        eventPin: body.ispublic ? null : body.eventPin,
        meetingId: body.isOnline ? (existingEvent.meetingId || crypto.randomUUID()) : null,
      },
    });

    await prisma.activity.create({
      data: {
        userId: session.user.id,
        type: "EVENT_EDIT",
        description: `Edited event: ${updatedEvent.name}`
      }
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}