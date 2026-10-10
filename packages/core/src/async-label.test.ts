import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createAsyncLabelStore,
  type AsyncLabelStore,
  type LabelResults,
} from "./async-label";
const stores: AsyncLabelStore[] = [];
function make(
  resolve: (codes: readonly string[], context: any) => Promise<LabelResults>,
  options = {},
) {
  const store = createAsyncLabelStore({
    scopeKey: "A",
    lookups: { names: { resolve } },
    options,
  });
  stores.push(store);
  return store;
}
function deferred() {
  let resolve!: (result: LabelResults) => void;
  const promise = new Promise<LabelResults>((r) => (resolve = r));
  return { resolve, promise };
}
beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  stores.forEach((store) => store.dispose());
  stores.length = 0;
  vi.useRealTimers();
});
describe("AsyncLabelStore", () => {
  it("deduplicates a batch and shares in-flight requests with late subscribers", async () => {
    const pending = deferred();
    const resolve = vi.fn((_codes: readonly string[]) => pending.promise);
    const store = make(resolve);
    store.subscribe("names", "001", () => {});
    store.subscribe("names", "001", () => {});
    store.subscribe("names", "002", () => {});
    await vi.advanceTimersByTimeAsync(10);
    store.subscribe("names", "001", () => {});
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(resolve.mock.calls[0][0]).toEqual(["001", "002"]);
    pending.resolve({ "001": "Mary", "002": "Akintunde" });
    await vi.advanceTimersByTimeAsync(0);
    expect(store.getSnapshot("names", "001")).toEqual({
      status: "ready",
      label: "Mary",
    });
  });
  it("returns stable snapshots and never fetches from reads or empty codes", async () => {
    const resolve = vi.fn(async () => ({}));
    const store = make(resolve);
    expect(store.getSnapshot("names", "001")).toBe(
      store.getSnapshot("names", "001"),
    );
    store.subscribe("names", "", () => {});
    store.subscribe("names", null, () => {});
    await vi.advanceTimersByTimeAsync(20);
    expect(resolve).not.toHaveBeenCalled();
  });
  it("reuses cached results and refetches on access after expiry", async () => {
    const resolve = vi.fn(async () => ({ "001": "Mary" }));
    const store = make(resolve, { cacheTtlMs: 50 });
    const off = store.subscribe("names", "001", () => {});
    await vi.advanceTimersByTimeAsync(10);
    off();
    const off2 = store.subscribe("names", "001", () => {});
    expect(store.getSnapshot("names", "001").status).toBe("ready");
    off2();
    await vi.advanceTimersByTimeAsync(51);
    store.subscribe("names", "001", () => {});
    await vi.advanceTimersByTimeAsync(10);
    expect(resolve).toHaveBeenCalledTimes(2);
  });
  it("bounds completed results and retains mounted label state after eviction", async () => {
    const store = make(
      async (codes) => Object.fromEntries(codes.map((c) => [c, c])),
      { maxCacheEntries: 2 },
    );
    for (const code of ["1", "2", "3"])
      store.subscribe("names", code, () => {});
    await vi.advanceTimersByTimeAsync(10);
    expect(store.cacheSize).toBe(2);
    expect(store.getSnapshot("names", "1")).toEqual({
      status: "ready",
      label: "1",
    });
  });
  it("splits batches and limits concurrent resolver calls", async () => {
    const first = deferred();
    const resolve = vi
      .fn()
      .mockReturnValueOnce(first.promise)
      .mockImplementation(async (codes) =>
        Object.fromEntries(codes.map((c: string) => [c, c])),
      );
    const store = make(resolve, { maxBatchSize: 2, maxConcurrentBatches: 1 });
    for (const code of ["1", "2", "3"])
      store.subscribe("names", code, () => {});
    await vi.advanceTimersByTimeAsync(10);
    expect(resolve).toHaveBeenCalledTimes(1);
    first.resolve({ "1": "one", "2": "two" });
    await vi.advanceTimersByTimeAsync(0);
    expect(resolve).toHaveBeenCalledTimes(2);
    expect(resolve.mock.calls[1][0]).toEqual(["3"]);
  });
  it("isolates lookups and reports unknown lookup without a backend request", async () => {
    const resolve = vi.fn(async () => ({ "1": "one" }));
    const store = make(resolve);
    store.subscribe("missing", "1", () => {});
    expect(store.getSnapshot("missing", "1").status).toBe("error");
    expect(resolve).not.toHaveBeenCalled();
  });
  it("treats omitted keys as errors and explicit null as missing", async () => {
    const store = make(async () => ({ "1": null, "3": "" }));
    for (const code of ["1", "2", "3"])
      store.subscribe("names", code, () => {});
    await vi.advanceTimersByTimeAsync(10);
    expect(store.getSnapshot("names", "1").status).toBe("missing");
    expect(store.getSnapshot("names", "2").status).toBe("error");
    expect(store.getSnapshot("names", "3")).toEqual({
      status: "ready",
      label: "",
    });
  });
  it("does not cache request failures and permits retry", async () => {
    const resolve = vi
      .fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValue({ "1": "one" });
    const store = make(resolve);
    store.subscribe("names", "1", () => {});
    await vi.advanceTimersByTimeAsync(10);
    expect(store.cacheSize).toBe(0);
    store.invalidate("names", "1");
    await vi.advanceTimersByTimeAsync(10);
    expect(store.getSnapshot("names", "1").status).toBe("ready");
  });
  it("discards previous-scope responses even when the resolver ignores abort", async () => {
    const old = deferred();
    const resolve = vi
      .fn()
      .mockReturnValueOnce(old.promise)
      .mockResolvedValue({ "1": "tenant B" });
    const store = make(resolve);
    store.subscribe("names", "1", () => {});
    await vi.advanceTimersByTimeAsync(10);
    store.setScope("B");
    await vi.advanceTimersByTimeAsync(10);
    expect(resolve.mock.calls[0][1].signal.aborted).toBe(true);
    expect(resolve.mock.calls[1][1].scopeKey).toBe("B");
    old.resolve({ "1": "tenant A" });
    await vi.advanceTimersByTimeAsync(0);
    expect(store.getSnapshot("names", "1")).toEqual({
      status: "ready",
      label: "tenant B",
    });
  });
  it("prime protects a saved name from an older response", async () => {
    const old = deferred();
    const store = make(() => old.promise);
    store.subscribe("names", "1", () => {});
    await vi.advanceTimersByTimeAsync(10);
    store.prime("names", "1", "updated");
    old.resolve({ "1": "old" });
    await vi.advanceTimersByTimeAsync(0);
    expect(store.getSnapshot("names", "1")).toEqual({
      status: "ready",
      label: "updated",
    });
  });
  it("invalidates an in-flight code and retains the newer response", async () => {
    const old = deferred();
    const resolve = vi
      .fn()
      .mockReturnValueOnce(old.promise)
      .mockResolvedValue({ "1": "new" });
    const store = make(resolve);
    store.subscribe("names", "1", () => {});
    await vi.advanceTimersByTimeAsync(10);
    store.invalidate("names", "1");
    await vi.advanceTimersByTimeAsync(10);
    old.resolve({ "1": "old" });
    await vi.advanceTimersByTimeAsync(0);
    expect(store.getSnapshot("names", "1")).toEqual({
      status: "ready",
      label: "new",
    });
  });
  it("times out ignored cancellation and releases the concurrency slot", async () => {
    const resolve = vi
      .fn()
      .mockReturnValueOnce(new Promise(() => {}))
      .mockResolvedValue({ "2": "two" });
    const store = make(resolve, {
      requestTimeoutMs: 30,
      maxBatchSize: 1,
      maxConcurrentBatches: 1,
    });
    store.subscribe("names", "1", () => {});
    store.subscribe("names", "2", () => {});
    await vi.advanceTimersByTimeAsync(40);
    expect(store.getSnapshot("names", "1").status).toBe("error");
    expect(store.getSnapshot("names", "2").status).toBe("ready");
  });
  it("unmounting one subscriber preserves another subscriber's shared request", async () => {
    const pending = deferred();
    const store = make(() => pending.promise);
    const first = store.subscribe("names", "1", () => {});
    store.subscribe("names", "1", () => {});
    await vi.advanceTimersByTimeAsync(10);
    first();
    pending.resolve({ "1": "one" });
    await vi.advanceTimersByTimeAsync(0);
    expect(store.getSnapshot("names", "1").status).toBe("ready");
  });
  it("removes unused queued codes and cancels requests on disposal", async () => {
    const resolve = vi.fn(async () => ({ "1": "one" }));
    const store = make(resolve);
    const off = store.subscribe("names", "1", () => {});
    off();
    await vi.advanceTimersByTimeAsync(20);
    expect(resolve).not.toHaveBeenCalled();
    store.subscribe("names", "1", () => {});
    store.dispose();
    await vi.advanceTimersByTimeAsync(20);
    expect(resolve).not.toHaveBeenCalled();
  });
});
