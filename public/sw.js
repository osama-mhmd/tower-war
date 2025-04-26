const shellFiles = [
  "/sw.js",
  "/offline.html",
  "https://fonts.googleapis.com/css2?family=Jaro:opsz@6..72&display=swap",
];

const cacheName = "app-v01";

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(cacheName);
        console.log("[Service Worker] Caching all: shellFiles");
        await cache.addAll(shellFiles);
        console.log("[Service Worker] Cached successfully");
      } catch (err) {
        console.error("[Service Worker] Cache failed", err);
      }
    })()
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
  e.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((name) => {
          if (name !== cacheName) {
            console.log(`[Service Worker] Deleting old cache: ${name}`);
            return caches.delete(name);
          }
        })
      );
      self.clients.claim();
      console.log("[Service Worker] Activate completed");
    })()
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      console.log("[Service Worker]: Cache First Mode");
      const cachedFile = await caches.match(e.request);
      console.log(`[Service Worker]: Fetching Cached: ${e.request.url}`);
      if (cachedFile) {
        return cachedFile;
      }
      console.log(`[Service Worker]: Fetching Online: ${e.request.url}`);
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      if (response.ok) {
        cache.put(e.request, response.clone());
        return response;
      }
      const offlineHTML = await caches.match("/offline.html");
      console.log(`[Service Worker]: Returning offline.html`);
      if (offlineHTML) return offlineHTML;
      return new Response();
    })()
  );
});
