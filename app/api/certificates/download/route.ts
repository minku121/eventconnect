import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import prisma from "@/app/lib/prisma"
import { generateCertificatePDF } from "@/app/lib/pdfGenerator"

// This is a simplified implementation that generates a basic certificate
// In a real application, you would use a PDF generation library like PDFKit
// to create a proper certificate based on the selected template

// Generate a certificate PDF for download
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get("eventId")
    const userId = searchParams.get("userId")

    if (!eventId || !userId) {
      return NextResponse.json({ error: "Event ID and User ID are required" }, { status: 400 })
    }

    // Authenticate: either the certificate owner or the event creator can access
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get certificate data
    const certificate = await prisma.certificate.findFirst({
      where: {
        eventId: eventId,
        userId: parseInt(userId),
      },
      include: {
        event: {
          include: {
            createdBy: {
              select: {
                name: true
              }
            }
          }
        },
        user: true,
      }
    })

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    // Check authorization - must be either the certificate owner or the event creator
    if (session.user.id !== parseInt(userId) && session.user.id !== certificate.event.createdById) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get the template ID (default to template 1 if not set)
    const templateId = certificate.event.certificateTemplateId || 1
    
    // Create certificate data
    const certificateData = {
      recipientName: certificate.user.name || 'Attendee',
      recipientEmail: certificate.user.email,
      eventName: certificate.event.name,
      eventDate: certificate.event.startTime,
      issueDate: certificate.createdAt,
      issuerName: certificate.event.createdBy?.name || 'Event Organizer',
      templateId: templateId,
    }

    // Generate the certificate (now returns HTML)
    const pdfBuffer = await generateCertificatePDF(certificateData)

    // Return the HTML content
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="certificate-${certificate.event.name}.html"`,
      },
    })
  } catch (error) {
    console.error("Error downloading certificate:", error);
    return NextResponse.json({ 
      error: "Error generating certificate", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
