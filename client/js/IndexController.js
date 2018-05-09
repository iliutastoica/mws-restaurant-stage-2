port = '3000';
// <!-- Service Worker Registration -->
registerServiceWorker = () => {
  if (!navigator.serviceWorker) return;

  navigator.serviceWorker.register('/sw.js').then(function (reg) {
    console.log('Registration Worked!');
    if (!navigator.serviceWorker.controller) {
      return;
    }

  }).catch(function () {
    console.log('Registration failed!')
  });
}
registerServiceWorker();

// open Database
openDatabase = () => {
  return idb.open('restaurants', 1, upgradeDB => {
    switch (upgradeDB.oldVersion) {
      case 0:
        const store = upgradeDB.createObjectStore('restaurants', {keyPath: 'id'})
        store.createIndex('neighborhood', 'neighborhood')
    }
  })
}
const dbPromise = openDatabase();

fetch_url = '';
if (port) fetch_url = 'http://localhost:'+port+'/restaurants';
else fetch_url = 'http://localhost:3000/restaurants';
fetch(fetch_url)
  .then(function(response) {
    console.log(response)
    return response.json();
  })
  .then(function(restaurants) {
    console.log("Restaurants: ", restaurants)
    dbPromise.then(function(db) {
      if(!db) return;
      var tx = db.transaction('restaurants', 'readwrite');
      var store = tx.objectStore('restaurants');
      restaurants.map((restaurant)=>{
        store.put(restaurant)
      })
    })
  })
  .catch((err) => {
    console.log("Error fetching data.")
  });
