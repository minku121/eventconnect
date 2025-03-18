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

    // Add a confirmDeletion flag to the body to confirm deletion of attendees and certificates
    const confirmDeletion = body.confirmDeletion === true;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id: parseInt(body.id) },
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

    if (existingEvent.createdById !== session?.user.id) {
      return NextResponse.json(
        { error: "Forbidden - You can only delete your own events" },
        { status: 403 }
      );
    }

    const hasAttendees = existingEvent.attendees.length > 0;
    const hasCertificates = existingEvent.certificates.length > 0;

    // If event has attendees or certificates and deletion isn't explicitly confirmed
    if ((hasAttendees || hasCertificates) && !confirmDeletion) {
      return NextResponse.json({
        requiresConfirmation: true,
        hasAttendees,
        hasCertificates,
        message: "This event has attendees or certificates. Explicit confirmation required to delete."
      }, { status: 428 }); // 428 Precondition Required
    }
    
    // Delete related attendees first
    await prisma.eventAttendee.deleteMany({
      where: { eventId: existingEvent.eventId }
    });
    
    // Delete any certificates associated with the event
    await prisma.certificate.deleteMany({
      where: { eventId: existingEvent.eventId }
    });
    
    await prisma.eventAnalytics.deleteMany({
      where: { eventId: existingEvent.eventId }
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