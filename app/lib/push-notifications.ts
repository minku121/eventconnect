// Function to convert a base64 string to a Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

// Check if service workers are supported
export function isPushNotificationSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

// Register the service worker
export async function registerServiceWorker() {
  if (!isPushNotificationSupported()) {
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

// Subscribe to push notifications
export async function subscribeToPushNotifications() {
  if (!isPushNotificationSupported()) {
    throw new Error('Push notifications are not supported by your browser');
  }
  
  try {
    // Get the service worker registration
    let registration = await navigator.serviceWorker.ready;
    
    // Get the push subscription
    let subscription = await registration.pushManager.getSubscription();
    
    // If a subscription exists, return it
    if (subscription) {
      return subscription;
    }
    
    // Otherwise, create a new subscription
    // Your VAPID public key should be set in your environment variables
    // This is a placeholder and should be replaced with your actual public key
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) {
      throw new Error('VAPID public key is not defined');
    }
    
    const options = {
      applicationServerKey: urlBase64ToUint8Array(publicKey),
      userVisibleOnly: true
    };
    
    subscription = await registration.pushManager.subscribe(options);
    
    // Send the subscription to your server
    await saveSubscription(subscription);
    
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    throw error;
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPushNotifications() {
  if (!isPushNotificationSupported()) {
    return false;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      return true;
    }
    
    // Delete the subscription from your server
    await deleteSubscription(subscription);
    
    // Unsubscribe
    const result = await subscription.unsubscribe();
    return result;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return false;
  }
}

// Save subscription to the server
async function saveSubscription(subscription: PushSubscription) {
  const response = await fetch('/api/notifications/webpush/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  });
  
  if (!response.ok) {
    throw new Error('Failed to save push notification subscription');
  }
  
  return response.json();
}

// Delete subscription from the server
async function deleteSubscription(subscription: PushSubscription) {
  const response = await fetch('/api/notifications/webpush/unsubscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ endpoint: subscription.endpoint }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete push notification subscription');
  }
  
  return response.json();
}

// Request permission for notifications
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    return false;
  }
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}
