const CACHE="study-shell-v17-performance-seo";
const FILES=[
  "./","./index.html","./styles.css","./app.js","./manifest.webmanifest",
  "./assets/study-icon.svg","./motivation.html","./motivation.css",
  "./summary.html","./summary.css","./summary.js",
  "./public-exam.html","./public-exam.css","./public-exam.js",
  "./private.html","./private.css","./private.js",
  "./private-motivation.html","./private-motivation.css","./release-notes.html"
];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener("notificationclick",event=>{event.notification.close();event.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{for(const client of list){if("focus"in client)return client.focus()}return clients.openWindow("./#taskHub")}))});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  event.respondWith(caches.match(event.request).then(cached=>{
    if(cached)return cached;
    return fetch(event.request).then(response=>{
      if(response.ok&&new URL(event.request.url).origin===location.origin){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}
      return response;
    }).catch(()=>event.request.mode==="navigate"?caches.match("./index.html"):Promise.reject(new Error("Offline resource not cached")));
  }));
});
