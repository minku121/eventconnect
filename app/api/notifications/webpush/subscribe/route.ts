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

    // Get user ID from session
    const userId = Number(session.user.id);

    // Parse the push subscription from the request body
    const subscription = await request.json();
    
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: "Invalid subscription data" }, { status: 400 });
    }

    // Extract subscription details
    const { endpoint, keys } = subscription;
    const { p256dh, auth } = keys;
    
    // Check if this endpoint is already registered
    const existingSubscription = await prisma.webPushSubscription.findUnique({
      where: { endpoint },
    });

    if (existingSubscription) {
      // If subscription exists but for a different user, update the userId
      if (existingSubscription.userId !== userId) {
        await prisma.webPushSubscription.update({
          where: { id: existingSubscription.id },
          data: { userId },
        });
      }
      
      return NextResponse.json({ 
        message: "Subscription already exists", 
        subscriptionId: existingSubscription.id 
      });
    }

    // Create a new subscription
    const newSubscription = await prisma.webPushSubscription.create({
      data: {
        userId,
        endpoint,
        p256dh,
        auth,
        expirationTime: subscription.expirationTime?.toString() || null,
      },
    });

    return NextResponse.json({ 
      message: "Successfully subscribed to push notifications",
      subscriptionId: newSubscription.id
    });
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
    return NextResponse.json({ error: "Failed to subscribe to push notifications" }, { status: 500 });
  }
}
