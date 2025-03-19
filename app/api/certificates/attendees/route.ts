import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import prisma from "@/app/lib/prisma"

// Get attendees for an event with certificate status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get eventId from query parameters
    const searchParams = request.nextUrl.searchParams
    const eventId = searchParams.get('eventId')

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    // Verify the event exists
    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
      include: {
        createdBy: {
          select: {
            id: true,
          }
        }
      }
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Verify the requesting user is the event creator
    if (event.createdById !== Number(session.user.id)) {
      return NextResponse.json({ error: "Unauthorized: Only the event creator can view attendees" }, { status: 403 })
    }

    // Get all attendees for this event through the User model
    const attendees = await prisma.user.findMany({
      where: {
        eventAttendees: {
          some: {
            eventId: eventId
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    // Also get certificates to match with attendees
    const certificates = await prisma.certificate.findMany({
      where: { eventId: eventId },
      select: { 
        id: true, 
        userId: true,
        createdAt: true
      }
    })

    // Format the attendees data
    const processedAttendees = attendees.map(attendee => {
      const certificate = certificates.find(cert => cert.userId === attendee.id)
      
      return {
        id: attendee.id,
        name: attendee.name,
        email: attendee.email,
        hasCertificate: Boolean(certificate),
        certificateId: certificate?.id,
        certificateIssueDate: certificate?.createdAt,
      }
    })

    return NextResponse.json({ attendees: processedAttendees })
  } catch (error) {
    console.error("Error fetching attendees:", error instanceof Error ? error.message : "Unknown error")
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
