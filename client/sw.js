var staticCacheName = 'restaurant-v1';
var imageCacheName = 'mws-image';
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
    'data/restaurants.json'
];
var allCaches = [
    staticCacheName,
    imageCacheName
];

// install cache from serviceWorker
self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// activate cache from serviceWorker
self.addEventListener('activate', function (event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
            cacheNames.filter(function(cacheName) {
                return cacheName.startsWith('restaurant-') &&
                   !allCaches.includes(cacheName)
            }).map(function(cacheName) {
                return caches.delete(cacheName);
            })
        );
      })
    );
});


self.addEventListener('fetch', function(event) {
    var requestUrl = new URL(event.request.url);

    if(requestUrl.pathname.startsWith("/img")) {
        event.respondWith(servePhoto(event.request));
        return;
    }
    
    event.respondWith(
        caches.match(event.request).then(function(response) {
            // console.log('resonse from cache', response);
            if(response) return response;
            // console.log('fetch event request', event.request);
            return fetch(event.request);
    })
    );
});

function servePhoto(request) {

    var storageUrlRep = request.url.replace(/-\w+\.jpg$/, '');

    return caches.open(imageCacheName).then(function(cache) {
        return cache.match(storageUrlRep).then(function (response) {
            // console.log('response',response);
            if(response) return response;

            return fetch(request).then(function(networkResponse) {
                // console.log('networkResponse', networkResponse)
                cache.put(storageUrlRep, networkResponse.clone());
                return networkResponse
            })
        })
    })

}
