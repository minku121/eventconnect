import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { formatSubscription, sendPushNotification } from "@/app/lib/web-push";

export async function POST(request: NextRequest) {
  try {
    // This endpoint requires admin or internal API key authentication
    // In production, implement proper API key validation

    const session = await getServerSession(authOptions);
    const isInternalRequest = request.headers.get("x-api-key") === process.env.INTERNAL_API_KEY;

    // Allow requests with valid session (admin check) or internal API key
    if (!isInternalRequest && (!session?.user || session.user.id !== 1)) { // Assuming admin has ID 1
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse notification data
    const body = await request.json();
    const { userId, title, message, url, notificationType } = body;

    if (!userId || !title || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find all push subscriptions for this user
    const subscriptions = await prisma.webPushSubscription.findMany({
      where: { userId: Number(userId) },
    });

    if (subscriptions.length === 0) {
      return NextResponse.json({ 
        message: "No push subscriptions found for this user",
        stored: false
      });
    }

    // Create notification in database
    const notification = await prisma.notification.create({
      data: {
        userId: Number(userId),
        message,
        type: notificationType || "OTHER",
        read: false,
      },
    });

    // Send push notification to all user's subscriptions
    const results = await Promise.allSettled(
      subscriptions.map(async (sub: { id: number, endpoint: string, p256dh: string, auth: string, expirationTime?: string | null }) => {
        try {
          const formattedSubscription = formatSubscription(sub);
          
          await sendPushNotification(formattedSubscription, {
            title,
            body: message,
            url: url || "/account/notifications",
            notificationId: notification.id
          });
          
          return { success: true, endpoint: sub.endpoint };
        } catch (error: any) {
          // If subscription has expired or is invalid, delete it
          if (error.statusCode === 410) { // Gone status
            await prisma.webPushSubscription.delete({
              where: { id: sub.id },
            });
          }
          
          return { 
            success: false, 
            endpoint: sub.endpoint, 
            error: error.message 
          };
        }
      })
    );

    const successCount = results.filter((r: PromiseSettledResult<{success: boolean, endpoint: string, error?: string}>) => r.status === 'fulfilled' && (r.value as any).success).length;
    const failCount = results.length - successCount;

    return NextResponse.json({
      message: `Notification sent to ${successCount} devices, failed on ${failCount} devices`,
      notificationId: notification.id,
      stored: true,
      results: results.map((r: PromiseSettledResult<any>) => r.status === 'fulfilled' ? r.value : r.reason)
    });
  } catch (error) {
    console.error("Error sending push notification:", error);
    return NextResponse.json({ error: "Failed to send push notification" }, { status: 500 });
  }
}
