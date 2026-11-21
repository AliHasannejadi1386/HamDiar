const CACHE = "hamdiyar-web-6";
const SHELL = [
  "./",
  "./index.html",
  "./style.css?v=1.4.0",
  "./game.css?v=1.4.0",
  "./zero-world.css?v=1.4.0",
  "./casual-arcade.css?v=1.4.0",
  "./app.js?v=1.4.0",
  "./model.js?v=1.4.0",
  "./report-media.js",
  "./data.js",
  "./data.js?v=1.4.0",
  "./icons.js?v=1.4.0",
  "./zero.js",
  "./zero-world.js?v=1.4.0",
  "./zero-world-data.js?v=1.4.0",
  "./casual-arcade.js",
  "./casual-games.js",
  "./qr.js",
  "./manifest.webmanifest",
  "./fonts/vazirmatn.woff2",
  "./fonts/vazirmatn-latin.woff2",
  "./assets/mark.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable.png",
  "./assets/neighborhood.webp",
  "./assets/zero-team.webp",
  "./assets/zero-cleanup.webp",
  "./assets/zero-robot.webp",
  "./assets/zero-collectibles.webp",
  "./assets/zero-lanterns.webp",
  "./assets/teaser-poster.webp",
  "./assets/kiosk.jpg",
  "./assets/cafe.jpg",
  "./assets/recycle.jpg",
  "./assets/skills.jpg",
  "./assets/workshop.jpg",
  "./assets/alley-before.jpg",
  "./assets/alley-after.jpg",
];
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("hamdiyar-web-") && key !== CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (
    request.method !== "GET" ||
    !request.url.startsWith(self.registration.scope) ||
    request.headers.has("range") ||
    new URL(request.url).pathname.endsWith(".mp4")
  )
    return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match("./index.html")));
    return;
  }
  event.respondWith(
    caches.match(request).then((response) => response || fetch(request)),
  );
});
