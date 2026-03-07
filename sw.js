Const CACHE_NAME = 'dsssb-pro-cache-v1';

// Aapke index.html ke hisaab se sabhi zaroori files aur CDN links
const urlsToCache = [
  '/',
  '/index.html',
  '/cbt.html', // Aapka Mock Test player page
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://telegram.org/js/telegram-web-app.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js',
  'https://dsssbsmartnotes.github.io/llogo.png' // Aapka app icon
];

// Install Event: Files ko cache mein save karta hai
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Pura cache fail na ho agar koi external link down ho
        return Promise.allSettled(urlsToCache.map(url => cache.add(url))); 
      })
  );
});

// Fetch Event: Agar net nahi hai toh cached files dikhata hai
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Agar file cache mein hai toh wo return karo, warna network se fetch karo
        return response || fetch(event.request);
      })
  );
});

// Activate Event: Purane cache ko delete karta hai agar version update ho
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
