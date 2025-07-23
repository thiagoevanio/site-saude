const CACHE_NAME = 'calcule-sua-saude-cache-v1';
const DYNAMIC_CACHE_NAME = 'calcule-sua-saude-dynamic-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/style.css',
  '/css/calculadoras.css',
  '/js/main.js',
  '/js/calculator-utils.js',
  '/js/bem-estar.js',
  '/js/corporais.js',
  '/js/especificas.js',
  '/js/fitness.js',
  '/js/nutricionais.js',
  '/calculadoras/bem-estar.html',
  '/calculadoras/corporais.html',
  '/calculadoras/especificas.html',
  '/calculadoras/fitness.html',
  '/calculadoras/nutricionais.html',
  '/politica-de-privacidade.html',
  '/favicon.png',
  '/icons/icon-72x72.png',
  '/icons/icon-144x144.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png'
];

// Instalar Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Todos os recursos foram cacheados');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Erro ao cachear recursos:', error);
      })
  );
});

// Ativar Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Ativando...');
  const cacheWhitelist = [CACHE_NAME, DYNAMIC_CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Ativado e pronto');
      return self.clients.claim();
    })
  );
});

// Interceptar requisições
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Estratégia Cache First para recursos estáticos
  if (urlsToCache.includes(url.pathname) || 
      request.destination === 'style' || 
      request.destination === 'script' || 
      request.destination === 'image') {
    
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            console.log('Service Worker: Servindo do cache:', request.url);
            return response;
          }
          
          return fetch(request)
            .then(fetchResponse => {
              // Cachear dinamicamente novos recursos
              if (fetchResponse.status === 200) {
                const responseClone = fetchResponse.clone();
                caches.open(DYNAMIC_CACHE_NAME)
                  .then(cache => {
                    cache.put(request, responseClone);
                  });
              }
              return fetchResponse;
            })
            .catch(() => {
              // Fallback para páginas offline
              if (request.destination === 'document') {
                return caches.match('/offline.html');
              }
            });
        })
    );
  }
  
  // Estratégia Network First para APIs e recursos dinâmicos
  else if (url.origin === location.origin) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE_NAME)
              .then(cache => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then(response => {
              return response || caches.match('/offline.html');
            });
        })
    );
  }
  
  // Para recursos externos (CDN), usar estratégia Stale While Revalidate
  else {
    event.respondWith(
      caches.match(request)
        .then(response => {
          const fetchPromise = fetch(request)
            .then(fetchResponse => {
              if (fetchResponse.status === 200) {
                const responseClone = fetchResponse.clone();
                caches.open(DYNAMIC_CACHE_NAME)
                  .then(cache => {
                    cache.put(request, responseClone);
                  });
              }
              return fetchResponse;
            })
            .catch(() => response);

          return response || fetchPromise;
        })
    );
  }
});

// Limpar cache antigo periodicamente
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    });
  }
});

