// =========================================================================
// SFT PWA Service Worker (Auto-Updating & Zero-Stale Cache Engine)
// Version: 2026.08.28_v2
// =========================================================================

const CACHE_VERSION = 'sft-pwa-v20260828-single-icons-v2';
const PRECACHE_ASSETS = [
  './manifest.json',
  './image/icons/icon-192x192.png',
  './image/icons/icon-512x512.png'
];

// 1. INSTALL: Skip waiting immediately so new updates take effect instantly
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        console.warn('PWA Precache warning (non-fatal):', err);
      });
    })
  );
});

// 2. ACTIVATE: Claim all open clients immediately and clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_VERSION) {
            console.log('[PWA SW] Removing outdated cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    }).then(() => {
      return self.clients.matchAll({ type: 'window' }).then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'PWA_NEW_VERSION_ACTIVATED', version: CACHE_VERSION });
        });
      });
    })
  );
});

// 3. FETCH STRATEGY: Network-First for HTML/JS/CSS (Always get latest web update)
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // A. Never cache API endpoints or dynamic PHP scripts with query actions
  if (url.pathname.includes('/api/') || url.pathname.endsWith('.php')) {
    return;
  }

  // B. HTML Pages & Navigation: NETWORK-FIRST with offline fallback
  if (req.mode === 'navigate' || req.destination === 'document' || (req.headers.get('accept') && req.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(req, { cache: 'no-cache' })
        .then(response => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(req, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(req);
        })
    );
    return;
  }

  // C. JavaScript and CSS: NETWORK-FIRST (So APK always gets latest code immediately)
  if (req.destination === 'script' || req.destination === 'style' || url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    event.respondWith(
      fetch(req)
        .then(response => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(req, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(req);
        })
    );
    return;
  }

  // D. Static Assets (Images, Fonts): STALE-WHILE-REVALIDATE
  event.respondWith(
    caches.match(req).then(cachedResponse => {
      const fetchPromise = fetch(req).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(req, responseClone));
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// 4. MESSAGE: Allow clients to force skipWaiting
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

