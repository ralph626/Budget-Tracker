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
  "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
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

self.addEventListener("fetch", (ev) => {
  ev.respondWith(
    caches.match(ev.request).then((found) => {
      if (!found || found.status !== 200) {
        return found;
      }
      let local = found.clone();
      caches.open(cacheName).then((cache) => {
        cache.put(ev.request, local);
      });
      return found;
    })
  );
});
