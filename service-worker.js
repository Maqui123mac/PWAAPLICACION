const cacheName = "todo-cache-v1";
const assets = [
    "/index.html",
    "/style.css",
    "/app.js",
    "/manifest.json",
    "/images/icon-192.png",
    "/images/icon-512.png"
];

self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll(assets);
            })
            .then(() => self.skipWaiting())
            .catch(err => console.log("Falló registro de cache", err))
    );
});

self.addEventListener("activate", e => {
    const cacheWhitelist = [cacheName];
    e.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cName => {
                        if (!cacheWhitelist.includes(cName)) {
                            return caches.delete(cName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
      caches.match(e.request)
        .then(res => {
          
          if (res) {
            return res;
          }
          return fetch(e.request);
        })
    );
  });
  