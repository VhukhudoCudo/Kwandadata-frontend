// Minimal service worker — its only job is to make the app eligible for
// "Add to Home Screen" / install prompts on Chrome/Android. It deliberately
// does NOT cache anything, so it never serves stale data or interferes with
// API calls — it just passes every request straight through to the network.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});