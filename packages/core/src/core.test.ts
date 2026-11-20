import { buildChart } from "./chart";
import { treeCheckState, toggleTreeCheck } from "./selection";
import { describe, expect, it } from "vitest";
import {
  createTheme,
  defaultTheme,
  responsiveCSS,
  formatLocalDateTime,
  resolveFlowStyle,
  resolveTooltipLocation,
  tableToCsv,
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

describe("shared control behavior", () => {
  it("exports formatted, visible fields and escapes CSV separators and line breaks", () => {
    const data = [
      { name: 'Oil, "Premium"\n500 ml', price: 250, private: "hidden" },
    ];
    const csv = tableToCsv(data, [
      { field: "name", header: "Product" },
      { field: "price", header: "Price", format: (value) => `NGN ${value}` },
    ]);
    expect(csv).toBe(
      '"Product","Price"\r\n"Oil, ""Premium""\n500 ml","NGN 250"',
    );
  });

  it("places a tooltip on the opposite side only if it has more room", () => {
    const anchor = { top: 3, left: 5, right: 70, bottom: 40 };
    const tooltip = { width: 100, height: 20 };
    const viewport = { width: 600, height: 400 };
    expect(resolveTooltipLocation("top", anchor, tooltip, viewport)).toBe(
      "bottom",
    );
    expect(resolveTooltipLocation("left", anchor, tooltip, viewport)).toBe(
      "right",
    );
    expect(resolveTooltipLocation("right", anchor, tooltip, viewport)).toBe(
      "right",
    );
  });
});

// Shared visual properties must reach the inner field through CSS variables.
it("resolves field icon/panel colors and responsive field colors", () => {
  const result = resolveFlowStyle(
    {
      backgroundColor: "#fff",
      textColor: "#123",
      iconColor: "#456",
      panelBackgroundColor: "#eee",
    },
    defaultTheme,
  );
  expect(result.style["--fui-control-background"]).toBe("#fff");
  expect(result.style["--fui-control-text"]).toBe("#123");
  expect(result.style["--fui-control-icon"]).toBe("#456");
  expect(result.style["--fui-panel-background"]).toBe("#eee");
  expect(responsiveCSS(defaultTheme)).toContain(
    "--fui-control-background:var(--fui-backgroundColor-md)",
  );
});

it("derives mixed tree branches and toggles their enabled leaves", () => {
  const node = {
    value: "movies",
    display: "Movies",
    other: null,
    children: [
      { value: "first", display: "First", other: null },
      { value: "second", display: "Second", other: null },
      { value: "disabled", display: "Disabled", other: null, disabled: true },
    ],
  };
  expect(treeCheckState(node, new Set(["first"]))).toBe("mixed");
  expect(toggleTreeCheck(node, ["first"])).toEqual(["first", "second"]);
  expect(toggleTreeCheck(node, ["first", "second"])).toEqual([]);
});

it("aligns grouped chart labels and produces a complete single-slice pie", () => {
  const data = { labels: ["Mon"], series: [{ name: "Sales", data: [12] }] };
  const column = buildChart(data, "column", 240, false);
  const rect = column.marks.find((mark) => mark.width !== undefined)!;
  expect(column.labels[0].x).toBeCloseTo(rect.x! + (rect.width! + 3) / 2);
  expect(buildChart(data, "pie", 240, false).marks[0].path).toContain(" A ");
});
