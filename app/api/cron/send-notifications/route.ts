import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { formatSubscription, sendPushNotification, configureWebPush } from "@/app/lib/web-push";

// This is a protected route that should be triggered by a cron job service
// Authentication happens through a secure API key
export async function GET(request: NextRequest) {
  try {
    // Secure this endpoint with an API key
    const apiKey = request.headers.get("x-api-key");
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret || apiKey !== cronSecret) {
      console.error("Unauthorized cron job attempt");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Configure web push before sending notifications
    if (!configureWebPush()) {
      return NextResponse.json({ error: "Web push not configured properly" }, { status: 500 });
    }

    console.log("Starting notification cron job...");
    
 
    // Find all unread notifications that haven't been pushed yet
    const unsentNotifications = await prisma.notification.findMany({
      where: {
        read: false,
        // You could add a 'pushed' boolean field to the Notification model
        // and filter by where: { pushed: false } here
      },
      include: {
        user: true
      },
      take: 100 // Process in batches to avoid timeout
    });

    console.log(`Found ${unsentNotifications.length} unsent notifications`);

    if (unsentNotifications.length === 0) {
      return NextResponse.json({ message: "No new notifications to send" });
    }

    // Send push notifications for each notification to all subscribed devices
    const results = await Promise.allSettled(
      unsentNotifications.flatMap(async notification => {
        // Get user's push subscriptions
        const subscriptions = await prisma.webPushSubscription.findMany({
          where: { userId: notification.userId }
        });
        
        // Skip if user has no push subscriptions
        if (!subscriptions || subscriptions.length === 0) {
          return [];
        }

        // Generate a title based on notification type
        let title = "EventConnect";
        switch (notification.type) {
          case "EVENT_JOINED":
            title = "New Event Participant";
            break;
          case "EVENT_CREATED":
            title = "New Event Created";
            break;
          case "NEW_MESSAGE":
            title = "New Message";
            break;
          case "CERTIFICATE_AVAILABLE":
            title = "Certificate Available";
            break;
          default:
            title = "EventConnect Notification";
        }

        // Send to all user devices
        return subscriptions.map(async (subscription: { id: number, endpoint: string, p256dh: string, auth: string, expirationTime?: string | null }) => {
          try {
            const formattedSubscription = formatSubscription(subscription);
            
            await sendPushNotification(formattedSubscription, {
              title,
              body: notification.message,
              url: "/account/notifications",
              notificationId: notification.id
            });

            // Mark this notification as pushed
            // await prisma.notification.update({
            //   where: { id: notification.id },
            //   data: { pushed: true }
            // });
            
            return { 
              success: true, 
              notificationId: notification.id,
              userId: notification.userId
            };
          } catch (error: any) {
            console.error(`Push notification error: ${error.message}`);
            
            // If subscription has expired, remove it
            if (error.statusCode === 410) {
              await prisma.webPushSubscription.delete({
                where: { id: subscription.id }
              }).catch((e: Error) => console.error("Error cleaning up subscription:", e));
            }
            
            return { 
              success: false, 
              notificationId: notification.id,
              userId: notification.userId,
              error: error.message
            };
          }
        });
      })
    );

    // Count successes and failures
    const succeeded = results.filter(r => r.status === 'fulfilled' && (r.value as any).success).length;
    const failed = results.length - succeeded;

    return NextResponse.json({
      message: `Processed ${unsentNotifications.length} notifications. Sent ${succeeded} push notifications, ${failed} failed.`,
      success: true
    });
  } catch (error) {
    console.error("Error in notification cron job:", error);
    return NextResponse.json({ 
      error: "Failed to process notifications",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
