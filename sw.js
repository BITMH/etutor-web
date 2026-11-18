/* AUTO-GENERATED DARIPADA src/features/mobile-app/sw-template.js OLEH scripts/build-frontend.mjs */
const BUILD_VERSION = "v20261118074416";
const SHELL_CACHE = "etutor-shell-" + BUILD_VERSION;

const SHELL_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./animations.js",
  "./config.js",
  "./favicon.svg",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(function (cache) {
      return Promise.allSettled(
        SHELL_ASSETS.map(function (assetUrl) {
          return cache.add(assetUrl);
        })
      );
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== SHELL_CACHE) {
            return caches.delete(key);
          }
          return Promise.resolve(false);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

function isBypassedRequest(url) {
  const path = url.pathname || "";
  if (path.indexOf("/api") === 0 || path.indexOf("/auth/") !== -1 || path.indexOf("/v1/") === 0) {
    return true;
  }
  return false;
}

self.addEventListener("fetch", function (event) {
  const req = event.request;
  if (!req || req.method !== "GET") return;

  let url;
  try {
    url = new URL(req.url);
  } catch (e) {
    return;
  }
  if (url.origin !== self.location.origin || isBypassedRequest(url)) {
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).then(function (networkRes) {
        if (networkRes && networkRes.ok && networkRes.type === "basic") {
          const copy = networkRes.clone();
          caches.open(SHELL_CACHE).then(function (cache) {
            cache.put("./index.html", copy);
          }).catch(function () {});
        }
        return networkRes;
      }).catch(function () {
        return caches.match("./index.html").then(function (cached) {
          return cached || caches.match("./");
        });
      })
    );
    return;
  }

  const extMatch = /\.(css|js|svg|png|webmanifest|ico|woff2?)$/i.test(url.pathname);
  if (!extMatch) return;

  event.respondWith(
    caches.match(req).then(function (cached) {
      const fetchPromise = fetch(req).then(function (networkRes) {
        if (networkRes && networkRes.ok && networkRes.type === "basic") {
          const copy = networkRes.clone();
          caches.open(SHELL_CACHE).then(function (cache) {
            cache.put(req, copy);
          }).catch(function () {});
        }
        return networkRes;
      }).catch(function () {
        return cached;
      });
      return cached || fetchPromise;
    })
  );
});
