// ═══════════════════════════════════════
// Service Worker — الطيار ديليفري
// بيشتغل في الخلفية حتى لو التطبيق مقفول
// ═══════════════════════════════════════

const CACHE_NAME = 'altayar-v2';
const CACHE_URLS = [
  '/altayar-delivery/',
  '/altayar-delivery/index.html',
  '/altayar-delivery/login.html',
  '/altayar-delivery/orders.html',
  '/altayar-delivery/admin.html',
  '/altayar-delivery/manifest.json',
  '/altayar-delivery/icon-192.png',
  '/altayar-delivery/icon-512.png'
];

// ── Install: كاش الملفات الأساسية ──
self.addEventListener('install', e => {
  console.log('SW: Installing...');
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_URLS).catch(err => {
        console.warn('Cache partial fail:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: امسح الكاش القديم ──
self.addEventListener('activate', e => {
  console.log('SW: Activating...');
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: Network First (عشان التحديثات تظهر فوراً) ──
self.addEventListener('fetch', e => {
  // Firebase requests — مش نكاشها
  if (e.request.url.includes('firebase') ||
      e.request.url.includes('googleapis') ||
      e.request.url.includes('gstatic')) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then(response => {
        // حدّث الكاش بالنسخة الجديدة
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => {
        // لو مفيش نت، جيب من الكاش
        return caches.match(e.request);
      })
  );
});

// ── Push Notifications (FCM) ──
self.addEventListener('push', e => {
  console.log('SW: Push received', e);
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch(err) {}

  const title   = data.notification?.title || '🛵 الطيار ديليفري';
  const body    = data.notification?.body  || 'طلب جديد وصل!';
  const icon    = '/altayar-delivery/icon-192.png';
  const badge   = '/altayar-delivery/icon-192.png';
  const tag     = data.data?.orderId || 'new-order';

  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      tag,
      renotify: true,
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 200],
      data: data.data || {},
      actions: [
        { action: 'view',    title: '👁️ عرض الطلب' },
        { action: 'dismiss', title: '✕ إغلاق' }
      ]
    })
  );
});

// ── Notification Click ──
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'dismiss') return;

  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // لو التطبيق مفتوح، ركّز عليه
      for (const client of list) {
        if (client.url.includes('altayar-delivery') && 'focus' in client) {
          return client.focus();
        }
      }
      // لو مقفول، افتحه
      return clients.openWindow('/altayar-delivery/orders.html');
    })
  );
});

// ── تحديث تلقائي ──
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
