import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();


export async function GET(request: NextRequest) {
  try {
    console.log(process.env.NEXTAUTH_URL);
    
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.id) {
      return NextResponse.json(
        { error: "Not authenticated or token invalid" },
        { status: 401 }
      );
    }

    const userId = token.id; 

   
    const events = await prisma.event.findMany({
      where: {
        createdById: userId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        location: true,
        createdAt: true,
        startTime:true,
        islimited:true,
        maxParticipants: true,
        ispublic: true,
        isOnline:true,
        meetingId:true,
        eventId:true,
        eventPin:true,
        participantCount:true,
        meetingStarted: true
      }
    });

    const eventsWithISOString = events.map(event => ({
      ...event,
     
    }));

    return NextResponse.json(eventsWithISOString);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
      
    );
  }
}
