const CACHE_NAME = 'localfood-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/bundle.js',
    '/styles.css',
    // Ajoutez ici d'autres fichiers que vous souhaitez mettre en cache
];

// Installer le Service Worker et mettre en cache les ressources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activer le Service Worker et nettoyer les anciens caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (cacheWhitelist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

// Intercepter les requêtes et servir les fichiers depuis le cache
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response; // Si la ressource est dans le cache, la retourner
                }
                return fetch(event.request); // Sinon, la récupérer depuis le réseau
            })
    );
});
