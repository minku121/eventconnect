import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function handle() {
  const events = await prisma.event.findMany({
    where: {

        //@ts-ignore
      status: "ACTIVE",
      endTime: { lte: new Date() }
    }
  });

  for (const event of events) {
    await prisma.event.update({
      where: { id: event.id },
      //@ts-ignore
      data: { status: "ENDED" }
    });
    
    await prisma.notification.createMany({
 //@ts-ignore
        data: event.participants.map(userId => ({
        userId,
        type: "EVENT_ENDED",
        message: `Event "${event.name}" has automatically ended`
      }))
    });
  }
} 