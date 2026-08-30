import type { ColorShade, DeepPartial, PaletteColor, ThemeMode } from "./types";

export type ColorScale = Record<ColorShade, string>;
export type ColorPalette = Record<PaletteColor, ColorScale>;
export interface ThemeColorScheme {
  canvas: string;
  surface: string;
  surfaceRaised: string;
  surfaceSunken: string;
  text: string;
  textMuted: string;
  textDisabled: string;
  textInverse: string;
  border: string;
  borderStrong: string;
  focus: string;
  overlay: string;
}
export interface FlowUITheme {
  palette: ColorPalette;
  schemes: { light: ThemeColorScheme; dark: ThemeColorScheme };
  spacing: Record<
    "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl",
    string | number
  >;
  radius: Record<
    "none" | "xs" | "sm" | "md" | "lg" | "xl" | "full",
    string | number
  >;
  fontSize: Record<"xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl", string>;
  fontWeight: Record<
    | "thin"
    | "extraLight"
    | "light"
    | "normal"
    | "medium"
    | "semiBold"
    | "bold"
    | "extraBold"
    | "black",
    number
  >;
  shadows: Record<"none" | "xs" | "sm" | "md" | "lg" | "xl", string>;
  breakpoints: Record<"sm" | "md" | "lg" | "xl" | "xxl", string>;
  zIndex: Record<
    | "base"
    | "sticky"
    | "dropdown"
    | "overlay"
    | "dialog"
    | "popover"
    | "tooltip"
    | "notification",
    number
  >;
}

const scale = (values: string[]): ColorScale => ({
  50: values[0],
  100: values[1],
  200: values[2],
  300: values[3],
  400: values[4],
  500: values[5],
  600: values[6],
  700: values[7],
  800: values[8],
  900: values[9],
  950: values[10],
});

export const defaultTheme: FlowUITheme = {
  palette: {
    primary: scale([
      "#eff6ff",
      "#dbeafe",
      "#bfdbfe",
      "#93c5fd",
      "#60a5fa",
      "#3b82f6",
      "#2563eb",
      "#1d4ed8",
      "#1e40af",
      "#1e3a8a",
      "#172554",
    ]),
    secondary: scale([
      "#f8fafc",
      "#f1f5f9",
      "#e2e8f0",
      "#cbd5e1",
      "#94a3b8",
      "#64748b",
      "#475569",
      "#334155",
      "#1e293b",
      "#0f172a",
      "#020617",
    ]),
    success: scale([
      "#f0fdf4",
      "#dcfce7",
      "#bbf7d0",
      "#86efac",
      "#4ade80",
      "#22c55e",
      "#16a34a",
      "#15803d",
      "#166534",
      "#14532d",
      "#052e16",
    ]),
    danger: scale([
      "#fef2f2",
      "#fee2e2",
      "#fecaca",
      "#fca5a5",
      "#f87171",
      "#ef4444",
      "#dc2626",
      "#b91c1c",
      "#991b1b",
      "#7f1d1d",
      "#450a0a",
    ]),
    warning: scale([
      "#fffbeb",
      "#fef3c7",
      "#fde68a",
      "#fcd34d",
      "#fbbf24",
      "#f59e0b",
      "#d97706",
      "#b45309",
      "#92400e",
      "#78350f",
      "#451a03",
    ]),
    info: scale([
      "#ecfeff",
      "#cffafe",
      "#a5f3fc",
      "#67e8f9",
      "#22d3ee",
      "#06b6d4",
      "#0891b2",
      "#0e7490",
      "#155e75",
      "#164e63",
      "#083344",
    ]),
    neutral: scale([
      "#fafafa",
      "#f5f5f5",
      "#e5e5e5",
      "#d4d4d4",
      "#a3a3a3",
      "#737373",
      "#525252",
      "#404040",
      "#262626",
      "#171717",
      "#0a0a0a",
    ]),
  },
  schemes: {
    light: {
      canvas: "#f8fafc",
      surface: "#ffffff",
      surfaceRaised: "#ffffff",
      surfaceSunken: "#f1f5f9",
      text: "#0f172a",
      textMuted: "#64748b",
      textDisabled: "#94a3b8",
      textInverse: "#ffffff",
      border: "#e2e8f0",
      borderStrong: "#94a3b8",
      focus: "#2563eb",
      overlay: "rgba(15,23,42,.55)",
    },
    dark: {
      canvas: "#020617",
      surface: "#0f172a",
      surfaceRaised: "#1e293b",
      surfaceSunken: "#020617",
      text: "#f8fafc",
      textMuted: "#94a3b8",
      textDisabled: "#64748b",
      textInverse: "#0f172a",
      border: "#334155",
      borderStrong: "#64748b",
      focus: "#60a5fa",
      overlay: "rgba(0,0,0,.72)",
    },
  },
  spacing: {
    none: 0,
    xs: ".25rem",
    sm: ".5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },
  radius: {
    none: 0,
    xs: ".125rem",
    sm: ".25rem",
    md: ".5rem",
    lg: ".75rem",
    xl: "1rem",
    full: "9999px",
  },
  fontSize: {
    xs: ".75rem",
    sm: ".875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
  },
  fontWeight: {
    thin: 100,
    extraLight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
    black: 900,
  },
  shadows: {
    none: "none",
    xs: "0 1px 2px rgb(15 23 42 / .05)",
    sm: "0 1px 3px rgb(15 23 42 / .12)",
    md: "0 4px 8px rgb(15 23 42 / .14)",
    lg: "0 10px 20px rgb(15 23 42 / .16)",
    xl: "0 20px 35px rgb(15 23 42 / .20)",
  },
  breakpoints: {
    sm: "40rem",
    md: "48rem",
    lg: "64rem",
    xl: "80rem",
    xxl: "96rem",
  },
  zIndex: {
    base: 0,
    sticky: 100,
    dropdown: 1000,
    overlay: 1100,
    dialog: 1200,
    popover: 1300,
    tooltip: 1400,
    notification: 1500,
  },
};

function merge<T>(base: T, override?: DeepPartial<T>): T {
  if (!override) return structuredClone(base);
  const result = structuredClone(base) as Record<string, unknown>;
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;
    const current = result[key];
    result[key] =
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      typeof current === "object" &&
      current !== null
        ? merge(current, value as never)
        : value;
  }
  return result as T;
}

export const createTheme = (override?: DeepPartial<FlowUITheme>): FlowUITheme =>
  merge(defaultTheme, override);

const vars = (prefix: string, object: Record<string, unknown>): string[] =>
  Object.entries(object).flatMap(([key, value]) =>
    typeof value === "object" && value !== null
      ? vars(`${prefix}-${key}`, value as Record<string, unknown>)
      : [`--fui-${prefix}-${key}: ${String(value)};`],
  );

export function themeToCSS(
  theme: FlowUITheme,
  mode: ThemeMode = "system",
): string {
  const shared = [
    ...vars("palette", theme.palette),
    ...vars("spacing", theme.spacing),
    ...vars("radius", theme.radius),
    ...vars("font-size", theme.fontSize),
    ...vars("font-weight", theme.fontWeight),
    ...vars("shadow", theme.shadows),
    ...vars("z", theme.zIndex),
  ];
  const scheme = (name: "light" | "dark") =>
    Object.entries(theme.schemes[name]).map(
      ([key, value]) => `--fui-color-${key}: ${value};`,
    );
  const active = mode === "dark" ? scheme("dark") : scheme("light");
  const system =
    mode === "system"
      ? `@media (prefers-color-scheme: dark){[data-fui-theme="system"]{${scheme("dark").join("")}}}`
      : "";
  return `[data-fui-theme="${mode}"]{${shared.join("")}${active.join("")}}${system}${responsiveCSS(theme)}`;
}

const responsiveProperties: Record<string, string> = {
  width: "width",
  minWidth: "min-width",
  maxWidth: "max-width",
  height: "height",
  minHeight: "min-height",
  maxHeight: "max-height",
  display: "display",
  overflow: "overflow",
  overflowX: "overflow-x",
  overflowY: "overflow-y",
  positionType: "position",
  absolute: "position",
  top: "top",
  right: "right",
  bottom: "bottom",
  left: "left",
  zIndex: "z-index",
  flex: "flex",
  flexGrow: "flex-grow",
  flexShrink: "flex-shrink",
  flexBasis: "flex-basis",
  selfAlign: "align-self",
  order: "order",
  direction: "flex-direction",
  wrap: "flex-wrap",
  justify: "justify-content",
  align: "align-items",
  gap: "gap",
  rowGap: "row-gap",
  columnGap: "column-gap",
  margin: "margin",
  marginX: "margin-inline",
  marginY: "margin-block",
  marginTop: "margin-top",
  marginRight: "margin-right",
  marginBottom: "margin-bottom",
  marginLeft: "margin-left",
  padding: "padding",
  paddingX: "padding-inline",
  paddingY: "padding-block",
  paddingTop: "padding-top",
  paddingRight: "padding-right",
  paddingBottom: "padding-bottom",
  paddingLeft: "padding-left",
  borderWidth: "border-width",
  borderStyle: "border-style",
  borderColor: "border-color",
  cornerRadius: "border-radius",
  backgroundColor: "background-color",
  opacity: "opacity",
  shadow: "box-shadow",
  textColor: "color",
  fontFamily: "font-family",
  fontSize: "font-size",
  fontWeight: "font-weight",
  textAlign: "text-align",
  textTransform: "text-transform",
};

export function responsiveCSS(theme: FlowUITheme): string {
  const output: string[] = [];
  for (const [prop, css] of Object.entries(responsiveProperties)) {
    output.push(`.fui-r-${prop}-default{${css}:var(--fui-${prop}-default)}`);
    for (const [breakpoint, width] of Object.entries(theme.breakpoints)) {
      output.push(
        `@media(min-width:${width}){.fui-r-${prop}-${breakpoint}{${css}:var(--fui-${prop}-${breakpoint})}}`,
      );
    }
  }
  return output.join("");
}
