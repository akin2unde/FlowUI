import { describe, expect, it } from "vitest";
import {
  createTheme,
  formatLocalDateTime,
  resolveFlowStyle,
  setLocalDayBoundary,
  themeToCSS,
} from "./index";

describe("FlowUI core", () => {
  it("uses default as the all-screen value", () => {
    const result = resolveFlowStyle(
      { width: { default: "full", md: 600 } },
      createTheme(),
    );
    expect(result.classNames).toEqual([
      "fui-r-width-default",
      "fui-r-width-md",
    ]);
    expect(result.style["--fui-width-default"]).toBe("100%");
    expect(result.style["--fui-width-md"]).toBe("600px");
  });

  it("creates theme and responsive CSS", () => {
    const css = themeToCSS(createTheme({ radius: { md: "1rem" } }));
    expect(css).toContain("--fui-radius-md: 1rem");
    expect(css).toContain("fui-r-width-default");
  });

  it("lets explicit inline style override general properties", () => {
    const result = resolveFlowStyle(
      { width: 300, style: { width: "50%" } },
      createTheme(),
    );
    expect(result.style.width).toBe("50%");
  });

  it("keeps date-time control values in local time", () => {
    const local = new Date(2026, 8, 1, 9, 30);
    expect(formatLocalDateTime(local)).toBe("2026-09-01T09:30");
    expect(setLocalDayBoundary("2026-09-01T09:30", "start")).toBe(
      "2026-09-01T00:00",
    );
    expect(setLocalDayBoundary("2026-09-01T09:30", "end")).toBe(
      "2026-09-01T23:59",
    );
  });
});
