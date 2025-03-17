import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { eventId, isPaid, participants, price } = await req.json();
    
    // Generate certificates
    const certificates = await prisma.$transaction(
      participants.map((userId: any) => 
        prisma.certificate.create({
          data: {
            eventId: eventId,
            userId,
            downloadUrl: `/api/certificates/generate?event=${eventId}&user=${userId}`,
            isPaid,
            price: isPaid ? price : null
          }
        })
      )
    );

    // Create notifications
    await prisma.notification.createMany({
      data: participants.map((userId: any) => ({
        userId,
        type: "CERTIFICATE_AVAILABLE",
        message: `Certificate available for event: ${eventId}` + 
          (isPaid ? ` (Payment required: $${price})` : " - Free download available")
      }))
    });

    return NextResponse.json({ success: true, certificates });
  } catch (error) {
    console.error('Certificate distribution error:', error);
    return NextResponse.json(
      { error: "Failed to distribute certificates" },
      { status: 500 }
    );
  }
} 