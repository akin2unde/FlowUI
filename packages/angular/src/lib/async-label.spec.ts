import "@angular/compiler";
import {
  EnvironmentInjector,
  Injector,
  createEnvironmentInjector,
  runInInjectionContext,
} from "@angular/core";
import { createTheme } from "@akin2unde/flowui-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AsyncLabelService,
  FlowAsyncLabelComponent,
  provideAsyncLabels,
} from "./async-label";
import { FlowUIThemeService } from "./theme";
let environment: EnvironmentInjector | undefined;
afterEach(() => {
  environment?.destroy();
  environment = undefined;
  vi.useRealTimers();
});
describe("Angular AsyncLabel adapter", () => {
  it("shares injected batches, updates signals and disposes with its provider scope", async () => {
    vi.useFakeTimers();
    const resolve = vi.fn(async (_codes: readonly string[]) => ({
      C1: "Mary",
      C2: null,
    }));
    environment = createEnvironmentInjector(
      [
        ...provideAsyncLabels(() => ({ lookups: { customers: { resolve } } })),
        {
          provide: FlowUIThemeService,
          useValue: { theme: createTheme(), mode: "light" },
        },
      ],
      Injector.create({ providers: [] }) as EnvironmentInjector,
    );
    const make = (code: string) =>
      runInInjectionContext(environment!, () => {
        const component = new FlowAsyncLabelComponent();
        component.lookup = "customers";
        component.code = code;
        component.ngOnChanges();
        return component;
      });
    const first = make("C1");
    const repeat = make("C1");
    const missing = make("C2");
    expect(first.busy).toBe(true);
    await vi.advanceTimersByTimeAsync(10);
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(resolve.mock.calls[0][0]).toEqual(["C1", "C2"]);
    expect(first.text).toBe("Mary");
    expect(repeat.text).toBe("Mary");
    expect(missing.text).toBe("C2");
    expect(first.busy).toBe(false);
    const labels = environment.get(AsyncLabelService);
    labels.prime("customers", "C1", "Updated");
    expect(first.text).toBe("Updated");
    labels.setScope("other-account");
    expect(first.busy).toBe(true);
    environment.destroy();
    environment = undefined;
    await vi.advanceTimersByTimeAsync(10);
    expect(resolve).toHaveBeenCalledTimes(1);
  });
});
