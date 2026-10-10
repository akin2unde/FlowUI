/** Code-to-text results. null is a confirmed missing value; absent keys are errors. */
export type LabelResults = Readonly<Record<string, string | null>>;
export interface LabelResolverContext {
  readonly scopeKey: string;
  readonly signal: AbortSignal;
}
export interface LabelLookup {
  resolve(
    codes: readonly string[],
    context: LabelResolverContext,
  ): Promise<LabelResults>;
  cacheTtlMs?: number;
}
export interface AsyncLabelOptions {
  batchWindowMs?: number;
  maxBatchSize?: number;
  maxConcurrentBatches?: number;
  cacheTtlMs?: number;
  missingTtlMs?: number;
  /** Maximum completed results across all lookups in this store. */
  maxCacheEntries?: number;
  requestTimeoutMs?: number;
}
export interface AsyncLabelConfig {
  lookups: Readonly<Record<string, LabelLookup>>;
  scopeKey?: string;
  options?: AsyncLabelOptions;
}
export type AsyncLabelState =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly label: string }
  | { readonly status: "missing" }
  | { readonly status: "error"; readonly error: unknown };
export type AsyncLabelCode = string | number | null | undefined;
const idle: AsyncLabelState = Object.freeze({ status: "idle" });
const loading: AsyncLabelState = Object.freeze({ status: "loading" });
type Listener = () => void;
interface Entry {
  key: string;
  lookup: string;
  code: string;
  state: AsyncLabelState;
  listeners: Set<Listener>;
  version: number;
  pending: boolean;
}
interface Cached {
  state: AsyncLabelState;
  expiresAt: number;
}
const defaults = {
  batchWindowMs: 10,
  maxBatchSize: 100,
  maxConcurrentBatches: 4,
  cacheTtlMs: 300_000,
  missingTtlMs: 30_000,
  maxCacheEntries: 1000,
  requestTimeoutMs: 30_000,
};

/** Framework-neutral, provider-owned lookup store. Never create a global user cache. */
export class AsyncLabelStore {
  private readonly options: typeof defaults;
  private readonly entries = new Map<string, Entry>();
  private readonly cache = new Map<string, Cached>();
  private readonly queue = new Map<string, Entry>();
  private readonly controllers = new Set<AbortController>();
  private timer?: ReturnType<typeof setTimeout>;
  private active = 0;
  private generation = 0;
  private disposed = false;
  private scope: string;
  constructor(private readonly config: AsyncLabelConfig) {
    this.scope = config.scopeKey ?? "default";
    this.options = { ...defaults, ...config.options };
    for (const [name, value] of Object.entries(this.options)) {
      const minimum = [
        "batchWindowMs",
        "cacheTtlMs",
        "missingTtlMs",
        "maxCacheEntries",
      ].includes(name)
        ? 0
        : 1;
      if (!Number.isInteger(value) || value < minimum)
        throw new RangeError(`Invalid AsyncLabel option: ${name}`);
    }
    for (const lookup of Object.values(config.lookups)) {
      if (
        lookup.cacheTtlMs !== undefined &&
        (!Number.isFinite(lookup.cacheTtlMs) || lookup.cacheTtlMs < 0)
      ) {
        throw new RangeError("Invalid lookup cacheTtlMs");
      }
    }
  }
  get scopeKey() {
    return this.scope;
  }
  /** Useful for diagnostics; active subscribers are separate from the bounded cache. */
  get cacheSize() {
    return this.cache.size;
  }
  private key(lookup: string, code: AsyncLabelCode): string | undefined {
    if (code === undefined || code === null || String(code).trim() === "")
      return undefined;
    return JSON.stringify([lookup, String(code)]);
  }
  /** Pure, stable snapshots; reading a snapshot never starts a network request. */
  getSnapshot(lookup: string, code: AsyncLabelCode): AsyncLabelState {
    const key = this.key(lookup, code);
    if (!key || this.disposed) return idle;
    const entry = this.entries.get(key);
    if (entry) return entry.state;
    const cached = this.cache.get(key);
    return cached && cached.expiresAt > Date.now() ? cached.state : idle;
  }
  subscribe(
    lookup: string,
    code: AsyncLabelCode,
    listener: Listener,
  ): () => void {
    const key = this.key(lookup, code);
    if (!key || this.disposed) return () => {};
    let entry = this.entries.get(key);
    if (!entry) {
      entry = {
        key,
        lookup,
        code: String(code),
        state: idle,
        listeners: new Set(),
        version: 0,
        pending: false,
      };
      this.entries.set(key, entry);
    }
    entry.listeners.add(listener);
    this.request(entry);
    return () => {
      entry!.listeners.delete(listener);
      if (!entry!.listeners.size) {
        if (this.queue.delete(key)) entry!.pending = false;
        if (!entry!.pending) this.entries.delete(key);
      }
    };
  }
  private emit(entry: Entry) {
    for (const listener of [...entry.listeners]) listener();
  }
  private request(entry: Entry) {
    if (entry.pending || this.disposed) return;
    const cached = this.cache.get(entry.key);
    if (cached && cached.expiresAt > Date.now()) {
      this.cache.delete(entry.key);
      this.cache.set(entry.key, cached);
      entry.state = cached.state;
      this.emit(entry);
      return;
    }
    this.cache.delete(entry.key);
    if (!Object.hasOwn(this.config.lookups, entry.lookup)) {
      entry.state = {
        status: "error",
        error: new Error(`Unknown lookup: ${entry.lookup}`),
      };
      this.emit(entry);
      return;
    }
    entry.pending = true;
    entry.state = loading;
    this.queue.set(entry.key, entry);
    this.emit(entry);
    this.schedule();
  }
  private schedule() {
    if (this.timer !== undefined || this.disposed || !this.queue.size) return;
    this.timer = setTimeout(() => {
      this.timer = undefined;
      this.flush();
    }, this.options.batchWindowMs);
  }
  private flush() {
    while (
      !this.disposed &&
      this.active < this.options.maxConcurrentBatches &&
      this.queue.size
    ) {
      const first = this.queue.values().next().value as Entry;
      const batch: Entry[] = [];
      for (const entry of this.queue.values()) {
        if (entry.lookup === first.lookup) {
          batch.push(entry);
          this.queue.delete(entry.key);
          if (batch.length === this.options.maxBatchSize) break;
        }
      }
      void this.runBatch(first.lookup, batch);
    }
  }
  private cacheResult(entry: Entry, state: AsyncLabelState) {
    const ttl =
      state.status === "missing"
        ? this.options.missingTtlMs
        : (this.config.lookups[entry.lookup].cacheTtlMs ??
          this.options.cacheTtlMs);
    if (!ttl || !this.options.maxCacheEntries) return;
    this.cache.delete(entry.key);
    this.cache.set(entry.key, { state, expiresAt: Date.now() + ttl });
    while (this.cache.size > this.options.maxCacheEntries)
      this.cache.delete(this.cache.keys().next().value!);
  }
  private async runBatch(lookup: string, batch: Entry[]) {
    const generation = this.generation;
    const scopeKey = this.scope;
    const versions = batch.map((entry) => entry.version);
    const controller = new AbortController();
    this.controllers.add(controller);
    this.active++;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const cancelled = new Promise<never>((_, reject) => {
      controller.signal.addEventListener(
        "abort",
        () => reject(controller.signal.reason ?? new Error("Lookup cancelled")),
        { once: true },
      );
      timeout = setTimeout(
        () => controller.abort(new Error("Lookup request timed out")),
        this.options.requestTimeoutMs,
      );
    });
    try {
      const result = await Promise.race([
        Promise.resolve().then(() => {
          if (controller.signal.aborted) throw controller.signal.reason;
          return this.config.lookups[lookup].resolve(
            batch.map((entry) => entry.code),
            { scopeKey, signal: controller.signal },
          );
        }),
        cancelled,
      ]);
      if (this.disposed || generation !== this.generation) return;
      batch.forEach((entry, index) => {
        if (entry.version !== versions[index]) return;
        const valid =
          result &&
          Object.hasOwn(result, entry.code) &&
          (typeof result[entry.code] === "string" ||
            result[entry.code] === null);
        entry.state = !valid
          ? {
              status: "error",
              error: new Error(`Incomplete lookup response for ${entry.code}`),
            }
          : result[entry.code] === null
            ? { status: "missing" }
            : { status: "ready", label: result[entry.code]! };
        entry.pending = false;
        if (entry.state.status !== "error")
          this.cacheResult(entry, entry.state);
        this.emit(entry);
        if (!entry.listeners.size) this.entries.delete(entry.key);
      });
    } catch (error) {
      if (this.disposed || generation !== this.generation) return;
      batch.forEach((entry, index) => {
        if (entry.version !== versions[index]) return;
        entry.pending = false;
        entry.state = { status: "error", error };
        this.emit(entry);
        if (!entry.listeners.size) this.entries.delete(entry.key);
      });
    } finally {
      clearTimeout(timeout);
      this.controllers.delete(controller);
      if (generation === this.generation) {
        this.active--;
        this.flush();
      }
    }
  }
  /** Refetch active labels and evict cached results; lookup/code may be omitted. */
  invalidate(lookup?: string, code?: AsyncLabelCode) {
    const key = code === undefined ? undefined : this.key(lookup ?? "", code);
    const matches = (entryKey: string, name: string) =>
      key ? entryKey === key : !lookup || name === lookup;
    for (const cachedKey of this.cache.keys()) {
      const name = JSON.parse(cachedKey)[0] as string;
      if (matches(cachedKey, name)) this.cache.delete(cachedKey);
    }
    for (const entry of this.entries.values()) {
      if (!matches(entry.key, entry.lookup)) continue;
      entry.version++;
      entry.pending = false;
      this.queue.delete(entry.key);
      entry.state = idle;
      if (entry.listeners.size) this.request(entry);
      else this.entries.delete(entry.key);
    }
  }
  /** Publish a definitive save result, protecting it from older in-flight responses. */
  prime(lookup: string, code: AsyncLabelCode, label: string | null) {
    const key = this.key(lookup, code);
    if (!key || this.disposed) return;
    if (!Object.hasOwn(this.config.lookups, lookup))
      throw new Error(`Unknown lookup: ${lookup}`);
    const entry = this.entries.get(key) ?? {
      key,
      lookup,
      code: String(code),
      state: idle,
      listeners: new Set<Listener>(),
      version: 0,
      pending: false,
    };
    entry.version++;
    entry.pending = false;
    this.queue.delete(key);
    entry.state =
      label === null ? { status: "missing" } : { status: "ready", label };
    this.cacheResult(entry, entry.state);
    this.emit(entry);
  }
  /** Scope changes cancel batches and prevent old results from entering the new scope. */
  setScope(scopeKey: string) {
    if (scopeKey === this.scope || this.disposed) return;
    this.scope = scopeKey;
    this.reset();
  }
  clear() {
    if (!this.disposed) this.reset();
  }
  private reset() {
    this.generation++;
    this.active = 0;
    clearTimeout(this.timer);
    this.timer = undefined;
    for (const controller of this.controllers) controller.abort();
    this.controllers.clear();
    this.queue.clear();
    this.cache.clear();
    for (const entry of this.entries.values()) {
      entry.version++;
      entry.pending = false;
      entry.state = idle;
      if (entry.listeners.size) this.request(entry);
      else this.entries.delete(entry.key);
    }
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.generation++;
    clearTimeout(this.timer);
    this.timer = undefined;
    for (const controller of this.controllers) controller.abort();
    this.controllers.clear();
    this.queue.clear();
    this.cache.clear();
    this.entries.clear();
  }
}
export function createAsyncLabelStore(config: AsyncLabelConfig) {
  return new AsyncLabelStore(config);
}
