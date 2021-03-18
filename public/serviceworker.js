if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("serviceworker.js").then((reg) => {
      console.log("serviceworker running");
    });
  });
}

const cacheFiles = [
  "/",
  "font-awesome/css/font-awesome.css",
  // "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
  "index.js",
  "serviceworker.js",
  "manifest.webmanifest",
  "icons/icon-192x192.png",
  "db.js",
  "font-awesome/fonts/fontawesome-webfont.woff2?v=4.7.0",
  "font-awesome/fonts/fontawesome-webfont.woff?v=4.7.0",
];

const cacheName = "budgetTracker";

self.addEventListener("install", (ev) => {
  ev.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      }
      return fetch(event.request, { credentials: "include" }).then(function (
        response
      ) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        let responseToCache = response.clone();

        caches.open(cacheName).then(function (cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (cacheName) {})
          .map(function (cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

// self.addEventListener("fetch", (ev) => {
//   if (ev.request.method !== "GET") return;

//   ev.respondWith(async () => {
//     const cache = await caches.open(cacheName);
//     const cachedResponse = await cache.match(ev.request);
//     if (cachedResponse) {
//       // ev.waitUntil(cache.add(ev.request));
//       return cachedResponse;
//     }
//     return fetch(ev.request);
//   });
// });
