// service-worker.js
self.addEventListener('push', event => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/favicon.ico',
    badge: '/favicon-32x32.png',
    data: {
      url: data.url || 'https://eventconnectweb.xyz/account/notifications'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  const notification = event.notification;
  notification.close();
  
  event.waitUntil(
    clients.openWindow(notification.data.url)
  );
});
