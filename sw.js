const CACHE_NAME = 'family-flow-v4-cache-v1';
const ASSETS = ['./family-flow-v4.html','./assets/manifest.webmanifest','./assets/sw.js'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => { const clone = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone)); return response; }).catch(() => caches.match('./family-flow-v4.html'))));
});
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title:'Family Flow', body:'Новое семейное уведомление', url:'./family-flow-v4.html' };
  event.waitUntil(self.registration.showNotification(data.title, { body: data.body, icon: data.icon || undefined, badge: data.badge || undefined, data:{ url:data.url || './family-flow-v4.html' } }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.url || './family-flow-v4.html'));
});
