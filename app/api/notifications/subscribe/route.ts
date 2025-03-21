import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Check user authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();
    const { eventId } = body;

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    // Get the user ID from the session
    const userId = Number(session.user.id);

    // Check if the event exists
    const event = await prisma.event.findUnique({
      where: { eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if user is already subscribed to this event
    // Since there's no eventId in the Notification model, we'll search using the message content
    const existingSubscription = await prisma.notification.findFirst({
      where: {
        userId,
        message: { contains: `Event "${event.name}" is starting soon` },
        type: "OTHER",
      },
    });

    if (existingSubscription) {
      // User is already subscribed
      return NextResponse.json({ 
        message: "You are already subscribed to notifications for this event",
        subscribed: true 
      });
    }

    // Create a new notification
    await prisma.notification.create({
      data: {
        userId,
        message: `Reminder: Event "${event.name}" is starting soon`,
        type: "OTHER",
        read: false,
      },
    });

    return NextResponse.json({ 
      message: "Successfully subscribed to event notifications",
      subscribed: true 
    });
  } catch (error) {
    console.error("Error subscribing to notifications:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
