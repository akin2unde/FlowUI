// @vitest-environment jsdom
import { StrictMode, act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AsyncLabel,
  AsyncLabelProvider,
  Dropdown,
  FlowUIProvider,
} from "./index";
(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let host: HTMLDivElement;
beforeEach(() => {
  vi.useFakeTimers();
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  vi.useRealTimers();
});
describe("AsyncLabel React adapter", () => {
  it("survives StrictMode replay, batches duplicates, and replaces small loaders", async () => {
    const resolve = vi.fn(async (_codes: readonly string[]) => ({
      C1: "Mary",
      C2: null,
    }));
    const lookups = { customers: { resolve } };
    await act(async () =>
      root.render(
        <StrictMode>
          <FlowUIProvider>
            <AsyncLabelProvider lookups={lookups}>
              <AsyncLabel lookup="customers" code="C1" />
              <AsyncLabel lookup="customers" code="C1" />
              <AsyncLabel lookup="customers" code="C2" fallback="Unknown" />
            </AsyncLabelProvider>
          </FlowUIProvider>
        </StrictMode>,
      ),
    );
    expect(host.querySelectorAll(".fui-async-label-spinner")).toHaveLength(3);
    expect(host.querySelector('[aria-busy="true"]')).not.toBeNull();
    await act(async () => vi.advanceTimersByTimeAsync(10));
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(resolve.mock.calls[0][0]).toEqual(["C1", "C2"]);
    expect(host.textContent).toBe("MaryMaryUnknown");
    expect(host.querySelector(".fui-async-label-spinner")).toBeNull();
  });
  it("shows fallback on failure, skips empty codes, and retries on remount", async () => {
    const resolve = vi
      .fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValue({ C1: "Recovered" });
    const lookups = { customers: { resolve } };
    const render = (show: boolean) => (
      <FlowUIProvider>
        <AsyncLabelProvider lookups={lookups}>
          {show && (
            <>
              <AsyncLabel lookup="customers" code="C1" fallback="C1" />
              <AsyncLabel lookup="customers" code="" />
            </>
          )}
        </AsyncLabelProvider>
      </FlowUIProvider>
    );
    await act(async () => root.render(render(true)));
    await act(async () => vi.advanceTimersByTimeAsync(10));
    expect(host.textContent).toBe("C1");
    await act(async () => root.render(render(false)));
    await act(async () => root.render(render(true)));
    await act(async () => vi.advanceTimersByTimeAsync(10));
    expect(host.textContent).toBe("Recovered");
    expect(resolve).toHaveBeenCalledTimes(2);
  });
  it("changes code without displaying a late response for the previous code", async () => {
    let finish!: (value: Record<string, string>) => void;
    const resolve = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise((res) => {
            finish = res;
          }),
      )
      .mockResolvedValue({ C2: "Second" });
    const lookups = { customers: { resolve } };
    const render = (code: string) => (
      <FlowUIProvider>
        <AsyncLabelProvider lookups={lookups}>
          <AsyncLabel lookup="customers" code={code} />
        </AsyncLabelProvider>
      </FlowUIProvider>
    );
    await act(async () => root.render(render("C1")));
    await act(async () => vi.advanceTimersByTimeAsync(10));
    await act(async () => root.render(render("C2")));
    await act(async () => vi.advanceTimersByTimeAsync(10));
    await act(async () => finish({ C1: "First" }));
    expect(host.textContent).toBe("Second");
  });
});
it("closes a single-select dropdown immediately after selection", async () => {
  const changed = vi.fn();
  await act(async () =>
    root.render(
      <FlowUIProvider>
        <Dropdown
          options={[
            { value: "active", display: "Active", other: null },
            { value: "low", display: "Low Stock", other: null },
          ]}
          value="active"
          onChange={changed}
        />
      </FlowUIProvider>,
    ),
  );
  await act(async () =>
    host.querySelector<HTMLButtonElement>("[aria-expanded]")!.click(),
  );
  expect(host.querySelector('[role="listbox"]')).not.toBeNull();
  await act(async () =>
    host.querySelectorAll<HTMLButtonElement>('[role="option"]')[1].click(),
  );
  expect(changed.mock.calls[0][0].value).toBe("low");
  expect(host.querySelector('[role="listbox"]')).toBeNull();
  expect(host.querySelector('[aria-expanded="false"]')).not.toBeNull();
});
