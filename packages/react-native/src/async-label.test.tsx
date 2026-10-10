// @vitest-environment jsdom
import { act, createElement, StrictMode, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { AsyncLabel } from "./async-label";
import { AsyncLabelProvider } from "./async-label-store";
vi.mock("react-native", () => ({
  ActivityIndicator: () =>
    createElement("span", { "data-native-loader": true }),
}));
vi.mock("./theme", () => ({
  useFlowUITheme: () => ({ colors: { primary: "#2563eb" } }),
}));
vi.mock("./primitives", () => ({
  HStack: ({
    children,
    accessibilityState,
  }: {
    children: ReactNode;
    accessibilityState: { busy: boolean };
  }) =>
    createElement("div", { "aria-busy": accessibilityState.busy }, children),
  Text: ({ children }: { children: ReactNode }) =>
    createElement("span", null, children),
}));
(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;
let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  vi.useFakeTimers();
  host = document.createElement("div");
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  vi.useRealTimers();
});
it("renders native loaders and shares batches under StrictMode", async () => {
  const resolve = vi.fn(async (_codes: readonly string[]) => ({
    C1: "Mary",
    C2: null,
  }));
  await act(async () =>
    root.render(
      <StrictMode>
        <AsyncLabelProvider lookups={{ customer: { resolve } }}>
          <AsyncLabel lookup="customer" code="C1" />
          <AsyncLabel lookup="customer" code="C1" />
          <AsyncLabel lookup="customer" code="C2" fallback="Unknown" />
        </AsyncLabelProvider>
      </StrictMode>,
    ),
  );
  expect(host.querySelectorAll("[data-native-loader]")).toHaveLength(3);
  await act(async () => vi.advanceTimersByTimeAsync(10));
  expect(resolve).toHaveBeenCalledTimes(1);
  expect(resolve.mock.calls[0][0]).toEqual(["C1", "C2"]);
  expect(host.textContent).toBe("MaryMaryUnknown");
  expect(host.querySelector("[data-native-loader]")).toBeNull();
});
