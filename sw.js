const C='trouble-v10',A=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!=='trouble-share').map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
 if(e.request.method==='POST'&&u.origin===location.origin&&u.pathname.endsWith('/share')){
  e.respondWith((async()=>{try{const f=await e.request.formData(),c=await caches.open('trouble-share');
   for(const k of await c.keys())await c.delete(k);
   let n=0;for(const file of f.getAll('media')){if(file&&file.size)await c.put(new URL('shared/'+(n++),self.registration.scope).href,new Response(file,{headers:{'Content-Type':file.type||'image/jpeg'}}));}
   const text=[f.get('title'),f.get('text'),f.get('url')].filter(Boolean).join('\n');
   if(text)await c.put(new URL('shared-text',self.registration.scope).href,new Response(JSON.stringify({text}),{headers:{'Content-Type':'application/json'}}));
  }catch(_){}
  return Response.redirect(new URL('./?share=1',self.registration.scope).href,303);})());return;}
 if(e.request.method!=='GET'||u.origin!==location.origin)return;
 e.respondWith(fetch(e.request).then(r=>{const k=r.clone();caches.open(C).then(c=>c.put(e.request,k));return r;}).catch(()=>caches.match(e.request)));});
