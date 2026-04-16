// TEDxFDU Dashboard — Service Worker
// Cache-first for assets, network-first for navigation
// Supabase API calls always bypass cache

const CACHE = 'tedx-v2'

// Hosts that should never be cached (live data / sync)
const PASSTHROUGH_HOSTS = ['supabase.co', 'supabase.com']

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(['/'])).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  const url = new URL(request.url)

  // Never cache Supabase or other live API calls — let them pass through
  if (PASSTHROUGH_HOSTS.some((h) => url.hostname.endsWith(h))) return

  // Only cache same-origin requests
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    // Network-first for HTML navigation, fall back to cached shell offline
    e.respondWith(
      fetch(request)
        .then((res) => {
          caches.open(CACHE).then((c) => c.put(request, res.clone()))
          return res
        })
        .catch(() => caches.match('/'))
    )
  } else {
    // Cache-first for assets (JS, CSS, fonts, images)
    e.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((res) => {
            caches.open(CACHE).then((c) => c.put(request, res.clone()))
            return res
          })
      )
    )
  }
})
