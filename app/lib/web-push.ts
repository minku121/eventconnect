import webpush from 'web-push';

// Configure web push with VAPID keys
// In production, these should be stored as environment variables
export function configureWebPush() {
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:contact@eventconnectweb.xyz';

  if (!vapidPublicKey || !vapidPrivateKey) {
    console.error('VAPID keys are not configured.');
    return false;
  }

  webpush.setVapidDetails(
    vapidSubject,
    vapidPublicKey,
    vapidPrivateKey
  );

  return true;
}

// Send a push notification to a single subscription
export async function sendPushNotification(
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
    expirationTime?: number | null;
  },
  payload: {
    title: string;
    body: string;
    url?: string;
    [key: string]: any;
  }
) {
  try {
    // Ensure web push is configured
    configureWebPush();

    // Create the push subscription object
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
      expirationTime: subscription.expirationTime,
    };

    // Send the notification
    return await webpush.sendNotification(
      pushSubscription,
      JSON.stringify(payload)
    );
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
}

// Format subscription data from database to web-push format
export function formatSubscription(dbSubscription: {
  endpoint: string;
  p256dh: string;
  auth: string;
  expirationTime?: string | null;
}) {
  return {
    endpoint: dbSubscription.endpoint,
    keys: {
      p256dh: dbSubscription.p256dh,
      auth: dbSubscription.auth,
    },
    expirationTime: dbSubscription.expirationTime ? new Date(dbSubscription.expirationTime).getTime() : null,
  };
}
