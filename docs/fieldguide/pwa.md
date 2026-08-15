# PWA Quickstart

A minimum progressive web app needs installation metadata and a service worker. This guide adds install support and a safe offline page.

It does not make D1 data available offline or cache authenticated responses.

## 1. Add the icons

Export two square PNG files from `public/favicon.svg`:

- `public/icons/pwa-192.png` at 192 by 192 pixels
- `public/icons/pwa-512.png` at 512 by 512 pixels

Keep important artwork inside the central safe area. A maskable icon can receive a circle or rounded-square crop.

## 2. Add the web app manifest

Create `public/manifest.webmanifest`:

```json
{
  "name": "Your Application",
  "short_name": "Your App",
  "description": "A short application description.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#111827",
  "icons": [
    {
      "src": "/icons/pwa-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/pwa-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

Use the same theme color in the manifest and the page metadata.

## 3. Add an offline page

Create `public/offline.html`. Keep this page static and free of private data.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Offline</title>
  </head>
  <body>
    <main>
      <h1>You are offline</h1>
      <p>Reconnect to load this application.</p>
    </main>
  </body>
</html>
```

## 4. Add the service worker

Create `public/sw.js`:

```js
const CACHE_NAME = 'app-shell-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([OFFLINE_URL, '/icons/pwa-192.png']),
    ),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => caches.match(OFFLINE_URL)),
  );
});
```

When you change the cached offline files, change `CACHE_NAME`.

CAUTION: Do not cache auth APIs, administrator pages, or authenticated HTML. A shared cache can expose data from one user to another user.

## 5. Register the application files

Add these elements to the `<head>` in `src/layouts/BaseLayout.astro`:

```astro
<link rel="manifest" href="/manifest.webmanifest" />
<meta name="theme-color" content="#111827" />
<link rel="apple-touch-icon" href="/icons/pwa-192.png" />
```

Add this script before the closing `</body>` tag:

```astro
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
</script>
```

## 6. Test the application

Deploy the application to an HTTPS origin. Install it from a supported browser, then load it without a network connection.

[PWABuilder](https://www.pwabuilder.com/) can inspect the deployed application and prepare store packages. Store submission adds separate policy and review work.

Read the web.dev guide for [PWA store packaging](https://web.dev/articles/pwas-in-app-stores) before you submit a package.

For more detail, read the web.dev guides for [web app manifests](https://web.dev/learn/pwa/web-app-manifest) and [service workers](https://web.dev/learn/pwa/service-workers).
