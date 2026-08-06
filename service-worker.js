const CACHE_NAME = 'cashcontrol-v2';

// APP_SHELL mit nur lokalen Assets – keine fremden Hosts
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Beim Installieren: App-Shell in den Cache legen
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Lokale Assets müssen alle da sein
      return cache.addAll(APP_SHELL).then(() => {
        // Tailwind separat und fehlertolerant cachen
        return cache.add('https://cdn.tailwindcss.com').catch(() => {
          // Fehler ignorieren – Tailwind-Ausfall sprengt Installation nicht mehr
        });
      });
    })
  );
  self.skipWaiting();
});

// Alte Caches beim Aktivieren aufräumen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Message-Listener für SKIP_WAITING
self.addEventListener('message', (event) => {
  // Beide Formen akzeptieren, damit ein abweichender Aufrufer das Update nicht verschluckt
  const data = event.data;
  if (data === 'SKIP_WAITING' || (data && data.type === 'SKIP_WAITING')) {
    self.skipWaiting();
  }
});

// Fetch-Strategie:
// - Navigationsanfragen: network-first (neue Versionen erreichen Nutzer)
// - Alle anderen: cache-first (offline-Erlebnis)
self.addEventListener('fetch', (event) => {
  const isNavigationRequest = event.request.mode === 'navigate';

  if (isNavigationRequest) {
    // Network-first für Navigationsanfragen
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Erfolgreiche Antwort cachen
          if (response.ok && event.request.method === 'GET') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          // Netzwerkfehler – aus Cache liefern (Fallback: index.html)
          return caches.match(event.request).then((cached) => {
            return cached || caches.match('./index.html');
          });
        })
    );
  } else {
    // Cache-first für alle anderen Anfragen
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          // Nur GET und nur bei erfolgreicher Antwort cachen
          if (event.request.method === 'GET' && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        }).catch(() => cached);
      })
    );
  }
});
