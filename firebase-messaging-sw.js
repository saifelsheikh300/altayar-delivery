importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBuKW9vBGj_q1LIE5QrRtFmpsJ5Ifg6D4w",
  authDomain: "altayar-delivery.firebaseapp.com",
  projectId: "altayar-delivery",
  storageBucket: "altayar-delivery.firebasestorage.app",
  messagingSenderId: "244765017519",
  appId: "1:244765017519:web:62ded292f78c9be40c5b5a"
});

const messaging = firebase.messaging();

// استقبال الإشعار لما التطبيق في الخلفية أو مقفول
messaging.onBackgroundMessage(payload => {
  console.log('Background message:', payload);
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || '🛵 الطيار ديليفري', {
    body: body || 'طلب جديد وصل!',
    icon: icon || '/altayar-delivery/icon-192.png',
    badge: '/altayar-delivery/icon-192.png',
    tag: 'new-order',
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200],
    data: payload.data || {}
  });
});

// لما تضغط على الإشعار يفتح التطبيق
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('orders') && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/altayar-delivery/orders.html');
    })
  );
});
