import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

   
    
    // Verify the event exists
    const event = await prisma.event.findUnique({
      where: { eventId: eventId },
      include: {
        createdBy: {
          select: {
            id: true,
          },
        },
      },
    });
    
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    
    // Verify the requesting user is the event creator
    if (event.createdBy.id !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized: Only the event creator can view attendees" },
        { status: 403 }
      );
    }
    
    // Get all attendees for this event
    const attendeeRegistrations = await prisma.eventAttendee.findMany({
      where: { eventId: eventId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    // Also get certificates to match with attendees
    const certificates = await prisma.certificate.findMany({
      where: { eventId: eventId },
      select: {
        id: true,
        userId: true,
        createdAt: true,
      },
    });
    
    // Format the attendees data
    const attendees = attendeeRegistrations.map((registration) => {
      const certificate = certificates.find(
        (cert) => cert.userId === registration.userId
      );
      
      return {
        id: registration.user.id,
        name: registration.user.name,
        email: registration.user.email,
        hasCertificate: Boolean(certificate),
        certificateId: certificate?.id,
        certificateIssueDate: certificate?.createdAt,
      };
    });
    
    return NextResponse.json({ attendees });
  } catch (error) {
    console.error(
      "Error fetching attendees:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}