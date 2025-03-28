"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast'; 
import {
  isPushNotificationSupported,
  registerServiceWorker,
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications
} from '@/app/lib/push-notifications';

interface PushNotificationContextType {
  isSupported: boolean;
  isSubscribed: boolean;
  permissionStatus: NotificationPermission | null;
  isLoading: boolean;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  subscribeToEvent: (eventId: string) => Promise<boolean>;
}

const PushNotificationContext = createContext<PushNotificationContextType>({
  isSupported: false,
  isSubscribed: false,
  permissionStatus: null,
  isLoading: true,
  subscribe: async () => false,
  unsubscribe: async () => false,
  subscribeToEvent: async () => false,
});

export const usePushNotifications = () => useContext(PushNotificationContext);

export function PushNotificationProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [serviceWorkerRegistration, setServiceWorkerRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Initialize push notification support on component mount
  useEffect(() => {
    const initialize = async () => {
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      const supported = isPushNotificationSupported();
      setIsSupported(supported);

      if (!supported) {
        setIsLoading(false);
        return;
      }

      // Check current permission status
      if ('Notification' in window) {
        setPermissionStatus(Notification.permission);
      }

      try {
        // Register service worker
        const registration = await registerServiceWorker();
        setServiceWorkerRegistration(registration);

        // Check if already subscribed
        if (registration) {
          const subscription = await registration.pushManager.getSubscription();
          setIsSubscribed(!!subscription);
        }
      } catch (error) {
        console.error('Error initializing push notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [session]);

  // Subscribe to push notifications
  const subscribe = async (): Promise<boolean> => {
    if (!isSupported || !session?.user) {
      return false;
    }

    try {
      setIsLoading(true);

      // Request permission if not granted
      if (permissionStatus !== 'granted') {
        const granted = await requestNotificationPermission();
        setPermissionStatus(granted ? 'granted' : 'denied');
        
        if (!granted) {
          toast({
            title: "Permission Denied",
            description: "You need to allow notifications in your browser settings.",
            variant: "destructive"
          });
          return false;
        }
      }

      // Subscribe to push notifications
      const subscription = await subscribeToPushNotifications();
      setIsSubscribed(!!subscription);

      if (subscription) {
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive notifications from EventConnect."
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      toast({
        title: "Subscription Failed",
        description: error instanceof Error ? error.message : "Failed to enable notifications",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Unsubscribe from push notifications
  const unsubscribe = async (): Promise<boolean> => {
    if (!isSupported || !session?.user) {
      return false;
    }

    try {
      setIsLoading(true);
      const result = await unsubscribeFromPushNotifications();
      setIsSubscribed(!result);
      
      if (result) {
        toast({
          title: "Notifications Disabled",
          description: "You will no longer receive notifications from EventConnect."
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      toast({
        title: "Error",
        description: "Failed to disable notifications",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Subscribe to a specific event
  const subscribeToEvent = async (eventId: string): Promise<boolean> => {
    if (!isSupported || !session?.user) {
      return false;
    }

    try {
      // First ensure the user is subscribed to push notifications
      if (!isSubscribed) {
        const subscribed = await subscribe();
        if (!subscribed) return false;
      }

      // Then subscribe to the specific event
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe to event notifications');
      }

      const data = await response.json();
      
      toast({
        title: "Event Notification Set",
        description: "You'll be notified when this event starts."
      });
      
      return true;
    } catch (error) {
      console.error('Error subscribing to event:', error);
      toast({
        title: "Subscription Failed",
        description: "Failed to set notification for this event",
        variant: "destructive"
      });
      return false;
    }
  };

  return (
    <PushNotificationContext.Provider
      value={{
        isSupported,
        isSubscribed,
        permissionStatus,
        isLoading,
        subscribe,
        unsubscribe,
        subscribeToEvent,
      }}
    >
      {children}
    </PushNotificationContext.Provider>
  );
}
