const CACHE_NAME = "nexus-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",

    "./css/style.css",

    "./js/app.js",
    "./js/dashboard.js",
    "./js/notas.js",
    "./js/conquistas.js",
    "./js/projetos.js",
    "./js/aniversariantes.js",
    "./js/storage.js",

    "./assets/img/logo-nexus.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});