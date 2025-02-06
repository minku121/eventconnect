import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/app/lib/prisma'
import { authOptions } from '@/app/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    
    // Validation
    if (!body.name || !body.description || !body.dateTime) {
      return new NextResponse('Missing required fields', { status: 400 })
    }
    
    const eventDate = new Date(body.dateTime)
    if (isNaN(eventDate.getTime())) {
      return new NextResponse('Invalid date format', { status: 400 })
    }

    // Handle event pin logic
    const eventPin = body.ispublic ? null : body.eventPin
    if (eventPin && eventPin.length < 4) {
      return new NextResponse('Event PIN must be at least 4 characters', { status: 400 })
    }

    const eventData = {
      name: body.name,
      description: body.description,
      location: body.location,
      dateTime: eventDate,
      image: body.image,
      ispublic: body.ispublic,
      islimited: body.islimited,
      maxParticipants: body.islimited ? body.maxParticipants : null,
      isOnline: body.isOnline,
      eventPin: eventPin,
      createdById: Number(session.user.id), // Changed from parseInt to Number
      participantCount: 0, // Initialize with 0 participants
      eventId: undefined // Let Prisma handle the UUID default
    }

    const event = await prisma.event.create({
      data: {
        ...eventData,
        participants: {
          connect: { id: session.user.id }
        },
        analytics: {
          create: { totalJoined: 0 }
        }
      },
      include: {
        analytics: true
      }
    })

    // Update user's events created count
    await prisma.user.update({
      where: { id: session.user.id },
      data: { eventsCreated: { increment: 1 } }
    })

    // Create activity and notification
    await prisma.activity.create({
      data: {
        userId: Number(session.user.id),
        type: "EVENT_CREATION",
        description: `Created new event: ${body.name}`
      }
    });

    await prisma.notification.create({
      data: {
        userId: Number(session.user.id),
        type: "EVENT_JOINED", // Or "OTHER" if you prefer
        message: `Successfully created event: ${body.name}`
      }
    });

    return NextResponse.json(event, { status: 201 })

  } catch (error: any) {
    console.error('[EVENT_CREATION_ERROR]', error)
    if (error.code === 'P2002') {
      return new NextResponse('Event with similar details already exists', { status: 409 })
    }
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 })
  }
}
