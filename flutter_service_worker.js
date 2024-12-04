'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter.js": "76f08d47ff9f5715220992f993002504",
"CNAME": "0d27b8553de59d63eddb042dd864bae6",
"main.dart.js": "bf53a6bdd0e245861eb8d1d3c3233b95",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/AssetManifest.bin": "cb91af1245dd5386b4781c748da6c5b1",
"assets/fonts/MaterialIcons-Regular.otf": "6aa53c77a094de077189df444fea04ff",
"assets/assets/images/respect-zone_detail.png": "211465aea4f5c00c27647d4d21f75cbe",
"assets/assets/images/respect-zone_architecture.png": "a88e5b2ad665d077006aa40f81b566b5",
"assets/assets/images/respect-zone_recording.png": "11af7e57a8249efbef4c71eabb99e2d2",
"assets/assets/images/emoji.png": "209929ebb1a52a16493eb0026eef1cb3",
"assets/assets/images/fast-learn-it_architecture.png": "bd3adf91544403d9d62e8d5878e8eb14",
"assets/assets/images/fast-learn-it_main.png": "1584dc286b014714392260c32faef999",
"assets/assets/images/patturning_graph.png": "96a7684ca60020a61f2dafb372b6fcac",
"assets/assets/images/patturning_filtering.png": "b5d0772eb11b4031a10f29fc1e582a9f",
"assets/assets/images/patturning_architecture.png": "6a51eb27bed50333a51834e0bd91818f",
"assets/assets/icons/boaz_logo.png": "71f69a2f41d0c4efa4b093c08a3be244",
"assets/assets/icons/github_logo.png": "6cb56a0960b45a0b30e0f0e9612d9711",
"assets/assets/icons/patturning_logo.png": "3b44678bef3f0ece0a619baf22adcd80",
"assets/assets/icons/khuda_logo.png": "ae4fd01316be5e90854d98c56dcbde0e",
"assets/NOTICES": "c14fc9b4b028b30b39bf902a2e1e3e00",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.json": "1057021d755e874304aa70f6c83d9fd7",
"assets/web/icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"assets/web/icons/Icon-192.png": "9d796c9697fdbe1097975f2c572f9eee",
"assets/web/icons/Icon-512.png": "54bd1011221855a7ddca85790a1bd529",
"assets/web/icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"assets/web/favicon.png": "a374dd3e60213b29650c2519ee0eafd7",
"assets/AssetManifest.bin.json": "88ec3417c4a774d12f054fcf6bf0e5ae",
"index.html": "a4a024a01728d834bb74db7734e3fbed",
"/": "a4a024a01728d834bb74db7734e3fbed",
"manifest.json": "bbaf05455b1379f4d09bfc7e572416df",
"canvaskit/canvaskit.js": "de27f912e40a372c22a069c1c7244d9b",
"canvaskit/canvaskit.js.symbols": "ff204c6b77c9e5969d85d9bfbaa0c843",
"canvaskit/skwasm_st.js": "d1326ceef381ad382ab492ba5d96f04d",
"canvaskit/chromium/canvaskit.js": "73343b0c5d471d1114d7f02e06c1fdb2",
"canvaskit/chromium/canvaskit.js.symbols": "85275e659470daa080e014ffe17a1a59",
"canvaskit/chromium/canvaskit.wasm": "86233631b867ce8f74c2020077650d11",
"canvaskit/skwasm.js": "f2ad9363618c5f62e813740099a80e63",
"canvaskit/skwasm_st.js.symbols": "a564f5dfbd90292f0f45611470170fe1",
"canvaskit/skwasm.js.symbols": "c7cf698f802bc5e9e8e791f762ebdfe9",
"canvaskit/canvaskit.wasm": "2e9895626fe95683569ed951214f1eb8",
"canvaskit/skwasm.wasm": "c528f7ba97a317e25e547ea47c8a66d8",
"canvaskit/skwasm_st.wasm": "3179a61ea4768a679dbbe30750d75214",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-192.png": "9d796c9697fdbe1097975f2c572f9eee",
"icons/Icon-512.png": "54bd1011221855a7ddca85790a1bd529",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"favicon.png": "a374dd3e60213b29650c2519ee0eafd7",
"version.json": "0325640b78b9f97959290dc5ebb8b3ed",
"flutter_bootstrap.js": "d1c91f93e31df98450dd0f49b9805b3e"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
