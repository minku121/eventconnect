import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import prisma from "@/app/lib/prisma"

// This API will handle setting and retrieving certificate templates for events

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get("eventId")

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    // Verify the user is the event creator
    const event = await prisma.event.findUnique({
      where: {
        eventId: eventId,
      },
      select: {
        createdById: true,
        certificateTemplateId: true,
      },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    if (event.createdById !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ templateId: event.certificateTemplateId || null })
  } catch (error) {
    console.error("Error getting certificate template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { eventId, templateId } = await request.json()

    if (!eventId || !templateId) {
      return NextResponse.json({ error: "Event ID and template ID are required" }, { status: 400 })
    }

    // Verify the user is the event creator
    const event = await prisma.event.findUnique({
      where: {
        eventId: eventId,
      },
      select: {
        createdById: true,
      },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    if (event.createdById !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update the event with the selected template ID
    await prisma.event.update({
      where: {
        eventId: eventId,
      },
      data: {
        certificateTemplateId: templateId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error setting certificate template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
