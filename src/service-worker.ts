/// <reference lib="webworker" />
/// <reference types="vite/client" />

import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

import type { PrecacheEntry } from "workbox-precaching";

declare let self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<PrecacheEntry | string>;
};

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request }) =>
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "worker",
  new StaleWhileRevalidate({
    cacheName: "static-resources",
  }),
);

/** Must match precached `index.html` URL (includes Vite `base`, e.g. `/repo/` on GitHub Pages). */
const precachedIndexUrl = new URL(
  "index.html",
  `${self.location.origin}${import.meta.env.BASE_URL}`,
).href;

registerRoute(new NavigationRoute(createHandlerBoundToURL(precachedIndexUrl)));

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    void self.skipWaiting();
  }
});
