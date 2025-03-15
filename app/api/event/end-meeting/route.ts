import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const { eventId } = await req.json();

  const event = await prisma.event.findUnique({
    where: { eventId },
    include: { createdBy: true }
  });

  if (!event || event.createdById !== session?.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updatedEvent = await prisma.event.update({
    where: { eventId },
    data: { 
      status: "ENDED",
      meetingId: null,
      endedAt: new Date()
    }
  });

  // Create notification for participants
  await prisma.notification.createMany({
    //@ts-ignore
    data: updatedEvent.participants.map((userId: number) => ({
      userId,
      type: "MEETING_ENDED",
      message: `Meeting for event ${updatedEvent.name} has ended`
    }))
  });

  return NextResponse.json(updatedEvent);
} 