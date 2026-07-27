// Minimal offline cache. Navigations: network-first (so new deploys show up),
// falling back to cache. Assets: cache-first (hashed filenames are safe to keep).
const CACHE = "pfz-v1";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;

  const put = (r) => {
    const copy = r.clone();
    caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
    return r;
  };

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then(put)
        .catch(() => caches.match(req).then((r) => r || caches.match(self.registration.scope))),
    );
    return;
  }

  event.respondWith(caches.match(req).then((cached) => cached || fetch(req).then(put)));
});
