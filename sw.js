const CACHE_NAME = 'shrinkpdf-v2';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/merge.html',
  '/split.html',
  '/rotate.html',
  '/reorder.html',
  '/images-to-pdf.html',
  '/pdf-to-images.html',
  '/about.html',
  '/guides.html',
  '/privacy.html',
  '/contact.html',
  '/404.html',
  '/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  '/manifest.json',
  '/en-01-below1mb.html',
  '/en-02-email.html',
  '/en-03-quality.html',
  '/en-04-nolimit.html',
  '/en-05-largefile.html',
  '/en-06-malaysia.html',
  '/en-07-toolarge.html',
  '/en-08-scanned.html',
  '/en-09-mobile.html',
  '/en-10-whylarge.html',
  '/en-11-comparison.html',
  '/en-12-university.html',
  '/en-13-windows.html',
  '/en-14-mac.html',
  '/en-15-quality.html',
  '/en-16-word.html'
];

const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js'
];

// Install: pre-cache everything
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      const corePromises = CORE_ASSETS.map(url =>
        cache.add(url).catch(() => console.warn('[SW] Failed to cache:', url))
      );
      const cdnPromises = CDN_ASSETS.map(url =>
        cache.add(new Request(url, { mode: 'cors' }))
          .catch(() => console.warn('[SW] Failed to cache CDN:', url))
      );
      return Promise.all([...corePromises, ...cdnPromises]);
    }).then(() => self.skipWaiting())
  );
});

// Activate: delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch strategy:
// - Core + CDN assets → cache-first (works offline)
// - Google Fonts → network-first, fall back to cache
// - Everything else → network-first, fall back to cache
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  const isCoreAsset = CORE_ASSETS.some(a =>
    url.pathname === a || (a === '/' && url.pathname === '/index.html')
  );
  const isCDNAsset = CDN_ASSETS.some(cdn => request.url.startsWith(cdn));
  const isFont = url.hostname.includes('fonts.google') || url.hostname.includes('fonts.gstatic');

  if (isCoreAsset || isCDNAsset) {
    // Cache-first: fast + offline-safe
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(res => {
          if (res.ok) {
            caches.open(CACHE_NAME).then(c => c.put(request, res.clone()));
          }
          return res;
        }).catch(() => {
          if (request.mode === 'navigate') return caches.match('/404.html');
        });
      })
    );
    return;
  }

  // Network-first for fonts and other requests
  event.respondWith(
    fetch(request).then(res => {
      if (res.ok) {
        caches.open(CACHE_NAME).then(c => c.put(request, res.clone()));
      }
      return res;
    }).catch(() => caches.match(request).then(cached => {
      if (cached) return cached;
      if (request.mode === 'navigate') return caches.match('/404.html');
    }))
  );
});
