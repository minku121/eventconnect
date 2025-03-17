import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { eventId } = await req.json();

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { eventId },
      include: { createdBy: true }
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.createdById !== session?.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedEvent = await prisma.event.update({
      where: { eventId },
      data: { 
        status: "ENDED",
        meetingId: null,
        endTime: new Date(),
        meetingStarted: false
      }
    });

   
    const participants = await prisma.user.findMany({
      where: {
        joinedEvents: {
          some: { eventId }
        }
      },
      select: { id: true }
    });

   
    if (participants.length > 0) {
      await prisma.notification.createMany({
        data: participants.map(({ id }) => ({
          userId: id,
          type: "OTHER",
          message: `Meeting for event ${updatedEvent.name} has ended`,
          read: false
        }))
      });
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error in end-meeting route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}