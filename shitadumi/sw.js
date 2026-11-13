"use strict";
const CACHE="shitadumi-pwa-v10";
const SHELL=["./","./index.html","./styles.css","./app.js","./mock-exams.html","./mock-exams.json","./manifest.webmanifest","./icon.svg","../questions.json","./pwa/","./pwa/index.html","./opinion/","./opinion/index.html","./opinion/opinion.js","./articles/","./articles/index.html","./articles/sano-shooh/","./articles/seiran-taito/","./articles/tips/study-plan/","./articles/tips/mock-review/","./articles/tips/final-weeks/","./releases/","./releases/index.html"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("shitadumi-pwa-")&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
 const request=event.request;if(request.method!=="GET")return;
 const url=new URL(request.url);if(url.origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cached=await caches.match(request);if(cached)return cached;
  try{const response=await fetch(request);if(response.ok){const cache=await caches.open(CACHE);cache.put(request,response.clone()).catch(()=>{});}return response;}
  catch(error){if(request.mode==="navigate"){const path=url.pathname;if(path.endsWith("/mock-exams.html"))return (await caches.match("./mock-exams.html"))||(await caches.match("./index.html"));if(path.endsWith("/pwa/"))return (await caches.match("./pwa/index.html"))||(await caches.match("./index.html"));return (await caches.match("./index.html"))||Response.error();}return Response.error();}
 })());
});
