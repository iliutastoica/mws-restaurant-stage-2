var CACHE_NAME = 'restaurant-cache-1';
var urlsToCache = [
    '/',
    'index.html',
    'restaurant.html',
    'css/styles.css',
    'css/normalize.css',
    'js/dbhelper.js',
    'js/main.js',
    'js/idb.js',
    'js/IndexController.js',
    'js/restaurant_info.js',
    'data/restaurants.json',
    'img/1.jpg',
    'img/2.jpg',
    'img/3.jpg',
    'img/4.jpg',
    'img/5.jpg',
    'img/6.jpg',
    'img/7.jpg',
    'img/8.jpg',
    'img/9.jpg',
    'img/10.jpg'
];

// install cache from serviceWorker
self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// activate cache from serviceWorker
self.addEventListener('activate',  event => {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName) {
            return cacheName.startsWith('restaurant-') &&
                   cacheName != CACHE_NAME;
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );
});


self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch:true}).then(response => {
      return response || fetch(event.request);
    })
    .catch(err => console.log(err, event.request))
  );
});
