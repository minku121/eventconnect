'use server';

import prisma from '@/app/lib/prisma';

export const getEventInfo = async (eventId: string, userId: number) => {
  try {
    const event = await prisma.event.findUnique({
      where: { eventId },
      select: {
        id: true,
        name: true,
        description:true,
        location:true,
        image:true,
        startTime:true,
        createdAt:true,
        ispublic:true,
        maxParticipants:true,
        participantCount:true,
        status:true,
        participants:{
          select:{
            id:true,
            email:true,
            name:true
          }
        },
        meetingStarted:true,
        meetingId: true,
        islimited:true,
        isOnline:true,
        createdBy: {
          select: {
            id: true,
            name: true,
            
          }
        },
        
      }
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return event;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw new Error('Failed to fetch event details');
  }
};

