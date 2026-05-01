import { afterEach, describe, expect, it, vi } from "vitest";

import { readFileAsTextWithRetry } from "./readFileAsTextWithRetry";

describe("readFileAsTextWithRetry", () => {
  const file = new File(["a"], "t.csv", { type: "text/csv" });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("succeeds on first try without sleeping", async () => {
    vi.useFakeTimers();
    const readFile = vi.fn().mockResolvedValue("ok");
    const sleep = vi.fn();

    const promise = readFileAsTextWithRetry(file, { readFile, sleep });
    await vi.runAllTimersAsync();
    await expect(promise).resolves.toBe("ok");

    expect(readFile).toHaveBeenCalledTimes(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it("succeeds after failures with 1s, 2s backoff before later attempts", async () => {
    vi.useFakeTimers();
    const readFile = vi
      .fn()
      .mockRejectedValueOnce(new Error("fail1"))
      .mockRejectedValueOnce(new Error("fail2"))
      .mockResolvedValueOnce("data");

    const promise = readFileAsTextWithRetry(file, { readFile });

    await Promise.resolve();
    expect(readFile).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1000);
    await Promise.resolve();
    expect(readFile).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(2000);
    await Promise.resolve();
    await expect(promise).resolves.toBe("data");
    expect(readFile).toHaveBeenCalledTimes(3);
  });

  it("throws after four failures and invokes onRetry three times", async () => {
    vi.useFakeTimers();
    const readFile = vi.fn().mockImplementation(() => Promise.reject(new Error("always fail")));
    const onRetry = vi.fn();

    const promise = readFileAsTextWithRetry(file, { readFile, onRetry });
    const settled = expect(promise).rejects.toThrow("always fail");

    await Promise.resolve();
    await vi.advanceTimersByTimeAsync(1000);
    await Promise.resolve();
    await vi.advanceTimersByTimeAsync(2000);
    await Promise.resolve();
    await vi.advanceTimersByTimeAsync(4000);
    await Promise.resolve();

    await settled;

    expect(readFile).toHaveBeenCalledTimes(4);
    expect(onRetry).toHaveBeenCalledTimes(3);
    expect(onRetry).toHaveBeenNthCalledWith(1, 0);
    expect(onRetry).toHaveBeenNthCalledWith(2, 1);
    expect(onRetry).toHaveBeenNthCalledWith(3, 2);
  });
});
