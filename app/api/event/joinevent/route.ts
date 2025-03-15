import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (!body.eventId) {
        return NextResponse.json(
            { error: "Missing EventId field" },
            { status: 400 }
        );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const event = await prisma.event.findUnique({
            where: { eventId: body.eventId },
            include: {
                participants: {
                    where: {
                        id: session.user.id
                    }
                }
            }
        });

        if (!event) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            );
        }

        // Check if user is already a participant
        if (event.participants.length > 0) {
            return NextResponse.json(
                { error: "You have already joined this event" },
                { status: 400 }
            );
        }

        if (!event.ispublic) {
            if (!body.pin) {
                return NextResponse.json(
                    { error: "PIN required for private event" },
                    { status: 400 }
                );
            }
            
            if (event.eventPin !== body.pin) {
                return NextResponse.json(
                    { error: "Invalid PIN" },
                    { status: 401 }
                );
            }
        }

        // Check if event has participant limit
        if (event.islimited && event.participantCount >= event.maxParticipants!) {
            return NextResponse.json(
                { error: "Event has reached maximum participants" },
                { status: 403 }
            );
        }

        if (new Date() > event.endTime) {
            return NextResponse.json(
                { error: "This event has already ended" },
                { status: 400 }
            );
        }

        // Update event and user in transaction
        const [updatedEvent, updatedUser] = await prisma.$transaction([
            prisma.event.update({
                where: { eventId: body.eventId },
                data: {
                    participants: {
                        connect: { id: session.user.id }  
                    },
                    participantCount: { increment: 1 }
                }
            }),
            prisma.user.update({
                where: { id: session.user.id },
                data: { eventsJoined: { increment: 1 } }
            })
        ]);

        // Create notification and activity
        await prisma.notification.create({
            data: {
                userId: (session.user.id),
                type: "EVENT_JOINED",
                message: `You've joined event: ${event.name}`
            }
        });

        await prisma.activity.create({
            data: {
                userId: (session.user.id),
                type: "EVENT_JOINED",
                description: `Joined event: ${event.name}`
            }
        });

        return NextResponse.json(
            { success: true, event: updatedEvent, user: updatedUser },
            { status: 200 }
        );

    } catch (error) {
        console.error("Join event error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}