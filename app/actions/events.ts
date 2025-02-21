'use server';

import prisma from '@/app/lib/prisma';

export const getEventById = async (eventId: string, userId: number) => {
  try {
    const event = await prisma.event.findUnique({
      where: { eventId },
      select: {
        id: true,
        name: true,
        meetingId: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            
          }
        },
        participants: { where: { id: userId } },
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

