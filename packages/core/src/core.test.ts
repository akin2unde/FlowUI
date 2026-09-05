import { describe, expect, it } from "vitest";
import {
  createTheme,
  formatLocalDateTime,
  resolveFlowStyle,
  sanitizeInputValue,
  setLocalDayBoundary,
  themeToCSS,
} from "./index";
import {
  enabledSelectableDescendants,
  filterTree,
  selectedTreeModels,
} from "./selection";

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

  it("filters typed input modes without altering normal text", () => {
    expect(sanitizeInputValue("Room 12", "text")).toBe("Room 12");
    expect(sanitizeInputValue("12 bags", "integer")).toBe("12");
    expect(sanitizeInputValue("12.5.0kg", "decimal")).toBe("12.50");
    expect(sanitizeInputValue("₦42,500.75", "money")).toBe("42500.75");
    expect(sanitizeInputValue("Akintunde 2", "alphabet")).toBe("Akintunde ");
  });
});

describe("tree selection helpers", () => {
  const nodes = [
    {
      display: "Food",
      value: "food",
      other: null,
      children: [
        { display: "Noodles", value: "noodles", other: null },
        {
          display: "Cereal",
          value: "cereal",
          other: null,
          disabled: true,
        },
      ],
    },
  ];

  it("selects enabled descendants and preserves parents while filtering", () => {
    expect(
      enabledSelectableDescendants(nodes[0]).map((node) => node.value),
    ).toEqual(["noodles"]);
    expect(filterTree(nodes, "noodles")[0].children?.[0].value).toBe("noodles");
    expect(selectedTreeModels(nodes, ["noodles"])[0].display).toBe("Noodles");
  });
});
