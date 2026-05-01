export const OFFLINE_READY_EVENT = "offline-ready";

const SERVICE_WORKER_URL = `${import.meta.env.BASE_URL}service-worker.js`;

function isServiceWorkerSupported(): boolean {
  return typeof navigator !== "undefined" && "serviceWorker" in navigator;
}

function dispatchOfflineReadyEvent(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new Event(OFFLINE_READY_EVENT));
}

function dispatchIfControllingPage(): void {
  if (typeof navigator === "undefined") {
    return;
  }
  if (!navigator.serviceWorker.controller) {
    return;
  }
  dispatchOfflineReadyEvent();
}

/**
 * Registers the production service worker and emits a browser event when
 * offline-ready mode is active for the current page.
 */
export function registerOfflineServiceWorker(isProduction = import.meta.env.PROD): void {
  if (!isProduction || !isServiceWorkerSupported()) {
    return;
  }

  const onControllerChange = () => {
    dispatchIfControllingPage();
  };

  navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
  void navigator.serviceWorker
    .register(SERVICE_WORKER_URL, { updateViaCache: "none" })
    .then(() => navigator.serviceWorker.ready)
    .then(() => {
      dispatchIfControllingPage();
    })
    .catch(() => {
      // Keep app functional even if SW registration fails.
    });
}

export function isOfflineReadyForCurrentPage(): boolean {
  if (!isServiceWorkerSupported()) {
    return false;
  }
  return Boolean(navigator.serviceWorker.controller);
}
