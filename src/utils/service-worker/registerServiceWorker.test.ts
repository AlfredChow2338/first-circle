import { describe, expect, it, vi } from "vitest";

import {
  isOfflineReadyForCurrentPage,
  OFFLINE_READY_EVENT,
  registerOfflineServiceWorker,
} from "./registerServiceWorker";

type MockServiceWorkerContainer = {
  controller: ServiceWorker | null;
  register: ReturnType<typeof vi.fn>;
  ready: Promise<ServiceWorkerRegistration>;
  addEventListener: ReturnType<typeof vi.fn>;
};

function createMockServiceWorkerContainer(): MockServiceWorkerContainer {
  const readyRegistration = {} as ServiceWorkerRegistration;
  return {
    controller: null,
    register: vi.fn().mockResolvedValue(readyRegistration),
    ready: Promise.resolve(readyRegistration),
    addEventListener: vi.fn(),
  };
}

describe("registerOfflineServiceWorker", () => {
  it("registers service worker and emits offline-ready when controlled", async () => {
    const serviceWorker = createMockServiceWorkerContainer();
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: serviceWorker,
    });

    serviceWorker.controller = {} as ServiceWorker;
    const readySpy = vi.fn();
    window.addEventListener(OFFLINE_READY_EVENT, readySpy);

    registerOfflineServiceWorker(true);
    await Promise.resolve();
    await Promise.resolve();

    expect(serviceWorker.register).toHaveBeenCalledWith("/service-worker.js", {
      updateViaCache: "none",
    });
    const controllerChangeHandler = serviceWorker.addEventListener.mock.calls[0]?.[1] as
      | (() => void)
      | undefined;
    controllerChangeHandler?.();
    expect(readySpy).toHaveBeenCalledTimes(1);

    window.removeEventListener(OFFLINE_READY_EVENT, readySpy);
  });

  it("reports offline-ready state from controller availability", () => {
    const serviceWorker = createMockServiceWorkerContainer();
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: serviceWorker,
    });

    serviceWorker.controller = null;
    expect(isOfflineReadyForCurrentPage()).toBe(false);

    serviceWorker.controller = {} as ServiceWorker;
    expect(isOfflineReadyForCurrentPage()).toBe(true);
  });
});
