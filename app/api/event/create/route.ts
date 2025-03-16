import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/app/lib/prisma'
import { authOptions } from '@/app/lib/auth'
import { error } from 'console'

export async function POST(req: Request) {
  try {
    // Checkpoint 1: Verify server session
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Checkpoint 2: Validate request body
    const body = await req.json()
    if (!body) {
      return new NextResponse('Invalid request body', { status: 400 })
    }

    // Checkpoint 3: Validate required fields
    const requiredFields = ['name', 'description', 'eventDateTime']
    const missingFields = requiredFields.filter(field => !body[field])
    if (missingFields.length > 0) {
      return new NextResponse(`Missing required fields: ${missingFields.join(', ')}`, { status: 400 })
    }

    // Checkpoint 4: Validate date format
    const eventDate = new Date(body.eventDateTime)
    if (isNaN(eventDate.getTime())) {
      return new NextResponse('Invalid date format', { status: 400 })
    }

    // Checkpoint 5: Validate future date
    const now = new Date()
    if (eventDate < now) {
      return new NextResponse('Event date must be in the future', { status: 400 })
    }

    // Checkpoint 6: Handle event pin validation
    const eventPin = body.ispublic ? null : body.eventPin
    if (eventPin) {
      if (eventPin.length < 6) {
    return NextResponse.json({ message: 'Event pin contain at least 6  characters' }, { status: 400 });
      }
      if (!/\d/.test(eventPin)) {
        return NextResponse.json({ message: 'Event pin contain at least a number' }, { status: 400 });
      }
      if (!/[a-zA-Z]/.test(eventPin)) {
        return NextResponse.json({ message: 'Event pin must contain a letter' }, { status: 400 });
      }
    }

    if (new Date(body.startTime) < new Date()) {
      return NextResponse.json({ message: 'Event start time cannot be in the past' }, { status: 400 });
    }

    // Checkpoint 7: Validate maxParticipants if event is limited
    if (body.islimited && (!body.maxParticipants || body.maxParticipants < 1)) {
      return new NextResponse('Max participants must be at least 1 for limited events', { status: 400 })
    }

    // Checkpoint 8: Validate location for offline events
    if (!body.isOnline && !body.location) {
      return new NextResponse('Location is required for offline events', { status: 400 })
    }

    const eventData = {
      name: body.name,
      description: body.description,
      location: body.isOnline ? "Online" : body.location,
      startTime: eventDate,
      endTime: new Date(eventDate.getTime() + 60 * 60 * 1000), // Default 1 hour duration
      image: body.image,
      ispublic: body.ispublic,
      islimited: body.islimited,
      maxParticipants: body.islimited ? body.maxParticipants : null,
      isOnline: body.isOnline,
      eventPin: eventPin,
      createdById: Number(session.user.id),
      participantCount: 0,
      eventId: undefined,
      meetingStarted: false,
      meetingId: body.isOnline ? crypto.randomUUID() : null,
      zegoAppId: process.env.ZEGO_APP_ID,
      zegoServerSecret: process.env.ZEGO_SERVER_SECRET,
      status: 'SCHEDULED'
    }
    const event = await prisma.$transaction(async (prisma) => {
      const newEvent = await prisma.event.create({
        //@ts-ignore
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

      // Checkpoint 10: Update user's events created count
      await prisma.user.update({
        where: { id: session.user.id },
        data: { eventsCreated: { increment: 1 } }
      })

      // Checkpoint 11: Create activity log
      await prisma.activity.create({
        data: {
          userId: Number(session.user.id),
          type: "EVENT_CREATION",
          description: `Created new event: ${body.name}`
        }
      })

      // Checkpoint 12: Create notification
      await prisma.notification.create({
        data: {
          userId: Number(session.user.id),
          //@ts-ignore
          type: "EVENT_CREATED", 
          message: `Successfully created event: ${body.name}`
        }
      })

      return newEvent
    })

    return NextResponse.json(event, { status: 201 })

  } catch (error: any) {
    console.error('[EVENT_CREATION_ERROR]', error)
    // Checkpoint 13: Handle unique constraint violation
    if (error.code === 'P2002') {
      return new NextResponse('Event with similar details already exists', { status: 409 })
    }
    // Checkpoint 14: Handle other errors
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 })
  }
}
