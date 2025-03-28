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

    // Parse the endpoint from the request body
    const body = await request.json();
    const { endpoint } = body;
    
    if (!endpoint) {
      return NextResponse.json({ error: "Endpoint is required" }, { status: 400 });
    }

    // Check if the subscription exists
    const existingSubscription = await prisma.WebPushSubscription.findUnique({
      where: { endpoint },
    });

    if (!existingSubscription) {
      return NextResponse.json({ message: "Subscription not found" }, { status: 404 });
    }

    // Ensure the user owns this subscription
    if (existingSubscription.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the subscription
    await prisma.WebPushSubscription.delete({
      where: { id: existingSubscription.id },
    });

    return NextResponse.json({ message: "Successfully unsubscribed from push notifications" });
  } catch (error) {
    console.error("Error unsubscribing from push notifications:", error);
    return NextResponse.json({ error: "Failed to unsubscribe from push notifications" }, { status: 500 });
  }
}
