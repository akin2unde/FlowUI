import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type PropsWithChildren,
} from "react";
import {
  createAsyncLabelStore,
  type AsyncLabelStore,
  type AsyncLabelCode,
  type AsyncLabelConfig,
  type AsyncLabelState,
} from "@akin2unde/flowui-core";
export type {
  AsyncLabelConfig,
  AsyncLabelOptions,
  AsyncLabelState,
  LabelLookup,
  LabelResolverContext,
  LabelResults,
} from "@akin2unde/flowui-core";
const Context = createContext<AsyncLabelStore | null>(null);
const serverSnapshot: AsyncLabelState = Object.freeze({ status: "idle" });
export function AsyncLabelProvider({
  children,
  lookups,
  scopeKey = "default",
  options,
}: PropsWithChildren<AsyncLabelConfig>) {
  const store = useMemo(
    () => createAsyncLabelStore({ lookups, scopeKey, options }),
    [lookups, scopeKey, options],
  );
  const leases = useRef(new Map<AsyncLabelStore, number>());
  useEffect(() => {
    const counts = leases.current;
    counts.set(store, (counts.get(store) ?? 0) + 1);
    return () => {
      counts.set(store, (counts.get(store) ?? 1) - 1);
      // React StrictMode replays effects. Dispose only after the replay has a
      // chance to reacquire the same store; replaced/unmounted stores still close.
      queueMicrotask(() => {
        if (counts.get(store) === 0) {
          store.dispose();
          counts.delete(store);
        }
      });
    };
  }, [store]);
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function useAsyncLabelStore() {
  const store = useContext(Context);
  if (!store) throw new Error("AsyncLabel requires an AsyncLabelProvider");
  return store;
}
export function useAsyncLabel(lookup: string, code: AsyncLabelCode) {
  const store = useAsyncLabelStore();
  const subscribe = useCallback(
    (listener: () => void) => store.subscribe(lookup, code, listener),
    [store, lookup, code],
  );
  const snapshot = useCallback(
    () => store.getSnapshot(lookup, code),
    [store, lookup, code],
  );
  return useSyncExternalStore(subscribe, snapshot, () => serverSnapshot);
}
