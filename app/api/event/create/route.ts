import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';

export async function POST(req: Request) {
  try {
    // Get the session to verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the incoming request body
    const body = await req.json();

    // Check for required fields
    const { name, description, location, eventDateTime, image, ispublic, islimited, maxParticipants, isOnline, eventPin } = body;

    if (!name || !description || !eventDateTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate event date and time
    const eventDate = new Date(eventDateTime);
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    // Ensure the event date is in the future
    if (eventDate < new Date()) {
      return NextResponse.json({ error: 'Event date must be in the future' }, { status: 400 });
    }

    // Validate event PIN for private events
    if (!ispublic && (!eventPin || eventPin.length < 6)) {
      return NextResponse.json({ error: 'Event PIN must be at least 6 characters' }, { status: 400 });
    }

    // Validate max participants if limited
    if (islimited && (!maxParticipants || maxParticipants < 1)) {
      return NextResponse.json({ error: 'Max participants must be at least 1' }, { status: 400 });
    }

    // Set default image if none provided
    const coverImage = image || 'https://i.sstatic.net/y9DpT.jpg';

    // Generate unique event ID
    const eventId = crypto.randomUUID();

    // Create the event
    const event = await prisma.event.create({
      data: {
        name,
        description,
        location: isOnline ? 'Online' : location,
        startTime: eventDate,
        endTime: new Date(eventDate.getTime() + 60 * 60 * 1000), // Default 1-hour duration
        image: coverImage,
        ispublic,
        islimited,
        maxParticipants: islimited ? maxParticipants : null,
        isOnline,
        eventPin: ispublic ? null : eventPin,
        createdById: session.user.id,
        participantCount: 0,
        eventId,
        meetingStarted: false,
        meetingId: isOnline ? crypto.randomUUID() : null,
        zegoAppId: process.env.ZEGO_APP_ID,
        zegoServerSecret: process.env.ZEGO_SERVER_SECRET,
        status: 'SCHEDULED',
      },
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: { eventsCreated: { increment: 1 } },
    });

  
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        type: 'EVENT_CREATION',
        description: `Created new event: ${body.name}`,
      },
    });

    
    return NextResponse.json({ message: 'Event created successfully', event }, { status: 201 });

  } catch (error) {
    console.error('Event creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
