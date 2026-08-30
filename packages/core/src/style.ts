import type {
  BaseUIProps,
  ColorValue,
  DimensionValue,
  FlowUIStyle,
  ResponsiveObject,
  ResponsiveValue,
  ResolvedStyle,
  SpacingValue,
} from "./types";
import type { FlowUITheme } from "./theme";

export interface StyleResolution {
  classNames: string[];
  style: ResolvedStyle;
}
const breakpoints = ["default", "sm", "md", "lg", "xl", "xxl"] as const;
const isResponsive = <T>(
  value: ResponsiveValue<T>,
): value is ResponsiveObject<T> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const length = (value: string | number): string | number =>
  typeof value === "number" ? (value === 0 ? 0 : `${value}px`) : value;
const dimension = (value: DimensionValue | "none"): string | number =>
  ({
    full: "100%",
    fit: "fit-content",
    min: "min-content",
    max: "max-content",
  })[String(value)] ?? length(value);
const spacing = (value: SpacingValue, theme: FlowUITheme): string | number =>
  value in theme.spacing
    ? `var(--fui-spacing-${String(value)})`
    : length(value);
const color = (value: ColorValue): string => {
  if (
    [
      "canvas",
      "surface",
      "surfaceRaised",
      "surfaceSunken",
      "text",
      "textMuted",
      "textDisabled",
      "textInverse",
      "border",
      "borderStrong",
      "focus",
      "overlay",
    ].includes(value)
  )
    return `var(--fui-color-${value})`;
  if (
    /^(primary|secondary|success|danger|warning|info|neutral)(\.\d+)?$/.test(
      value,
    )
  ) {
    const [name, shade = "600"] = value.split(".");
    return `var(--fui-palette-${name}-${shade})`;
  }
  return value;
};
const justify = (value: unknown) =>
  ({
    start: "flex-start",
    end: "flex-end",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly",
  })[String(value)] ?? String(value);
const align = (value: unknown) =>
  ({ start: "flex-start", end: "flex-end" })[String(value)] ?? String(value);

type Resolver = (value: never, theme: FlowUITheme) => string | number;
const propertyMap: Record<
  string,
  { css: keyof FlowUIStyle; resolve: Resolver }
> = {
  width: { css: "width", resolve: dimension as Resolver },
  minWidth: { css: "minWidth", resolve: dimension as Resolver },
  maxWidth: { css: "maxWidth", resolve: dimension as Resolver },
  height: { css: "height", resolve: dimension as Resolver },
  minHeight: { css: "minHeight", resolve: dimension as Resolver },
  maxHeight: { css: "maxHeight", resolve: dimension as Resolver },
  display: { css: "display", resolve: String as unknown as Resolver },
  overflow: { css: "overflow", resolve: String as unknown as Resolver },
  overflowX: { css: "overflowX", resolve: String as unknown as Resolver },
  overflowY: { css: "overflowY", resolve: String as unknown as Resolver },
  positionType: { css: "position", resolve: String as unknown as Resolver },
  absolute: {
    css: "position",
    resolve: ((value: boolean) => (value ? "absolute" : "static")) as Resolver,
  },
  top: { css: "top", resolve: length as Resolver },
  right: { css: "right", resolve: length as Resolver },
  bottom: { css: "bottom", resolve: length as Resolver },
  left: { css: "left", resolve: length as Resolver },
  zIndex: { css: "zIndex", resolve: String as unknown as Resolver },
  flex: { css: "flex", resolve: String as unknown as Resolver },
  flexGrow: { css: "flexGrow", resolve: String as unknown as Resolver },
  flexShrink: { css: "flexShrink", resolve: String as unknown as Resolver },
  flexBasis: { css: "flexBasis", resolve: dimension as Resolver },
  selfAlign: { css: "alignSelf", resolve: align as Resolver },
  order: { css: "order", resolve: String as unknown as Resolver },
  direction: { css: "flexDirection", resolve: String as unknown as Resolver },
  wrap: { css: "flexWrap", resolve: String as unknown as Resolver },
  justify: { css: "justifyContent", resolve: justify as Resolver },
  align: { css: "alignItems", resolve: align as Resolver },
  gap: { css: "gap", resolve: spacing as Resolver },
  rowGap: { css: "rowGap", resolve: spacing as Resolver },
  columnGap: { css: "columnGap", resolve: spacing as Resolver },
  margin: { css: "margin", resolve: spacing as Resolver },
  marginX: { css: "marginInline", resolve: spacing as Resolver },
  marginY: { css: "marginBlock", resolve: spacing as Resolver },
  marginTop: { css: "marginTop", resolve: spacing as Resolver },
  marginRight: { css: "marginRight", resolve: spacing as Resolver },
  marginBottom: { css: "marginBottom", resolve: spacing as Resolver },
  marginLeft: { css: "marginLeft", resolve: spacing as Resolver },
  padding: { css: "padding", resolve: spacing as Resolver },
  paddingX: { css: "paddingInline", resolve: spacing as Resolver },
  paddingY: { css: "paddingBlock", resolve: spacing as Resolver },
  paddingTop: { css: "paddingTop", resolve: spacing as Resolver },
  paddingRight: { css: "paddingRight", resolve: spacing as Resolver },
  paddingBottom: { css: "paddingBottom", resolve: spacing as Resolver },
  paddingLeft: { css: "paddingLeft", resolve: spacing as Resolver },
  borderWidth: { css: "borderWidth", resolve: length as Resolver },
  borderStyle: { css: "borderStyle", resolve: String as unknown as Resolver },
  borderColor: { css: "borderColor", resolve: color as Resolver },
  cornerRadius: {
    css: "borderRadius",
    resolve: ((v: string | number, t: FlowUITheme) =>
      v in t.radius ? `var(--fui-radius-${v})` : length(v)) as Resolver,
  },
  backgroundColor: { css: "backgroundColor", resolve: color as Resolver },
  opacity: { css: "opacity", resolve: String as unknown as Resolver },
  shadow: {
    css: "boxShadow",
    resolve: ((v: string) => `var(--fui-shadow-${v})`) as Resolver,
  },
  textColor: { css: "color", resolve: color as Resolver },
  fontFamily: { css: "fontFamily", resolve: String as unknown as Resolver },
  fontSize: {
    css: "fontSize",
    resolve: ((v: string | number, t: FlowUITheme) =>
      v in t.fontSize ? `var(--fui-font-size-${v})` : length(v)) as Resolver,
  },
  fontWeight: {
    css: "fontWeight",
    resolve: ((v: string | number, t: FlowUITheme) =>
      v in t.fontWeight ? `var(--fui-font-weight-${v})` : v) as Resolver,
  },
  textAlign: { css: "textAlign", resolve: String as unknown as Resolver },
  textTransform: {
    css: "textTransform",
    resolve: String as unknown as Resolver,
  },
};

export function resolveFlowStyle(
  props: Record<string, unknown>,
  theme: FlowUITheme,
): StyleResolution {
  const userStyle = props.style as FlowUIStyle | undefined;
  const style: ResolvedStyle = {};
  const classNames: string[] = [];
  for (const [prop, definition] of Object.entries(propertyMap)) {
    const value = props[prop] as ResponsiveValue<never> | undefined;
    if (value === undefined) continue;
    if (!isResponsive(value)) {
      (style as Record<string, unknown>)[definition.css] = definition.resolve(
        value,
        theme,
      );
      continue;
    }
    for (const point of breakpoints) {
      const pointValue = value[point];
      if (pointValue === undefined) continue;
      classNames.push(`fui-r-${prop}-${point}`);
      style[`--fui-${prop}-${point}`] = definition.resolve(pointValue, theme);
    }
  }
  const lines = props.lines;
  if (typeof lines === "number" && lines > 0) {
    style.overflow = "hidden";
    style.display = "-webkit-box";
    style.WebkitBoxOrient = "vertical";
    style.WebkitLineClamp = lines;
  }
  Object.assign(style, userStyle);
  return { classNames, style };
}

export function flowClass(
  base: string,
  props: Pick<BaseUIProps, "className">,
  resolution: StyleResolution,
  ...extra: Array<string | false | undefined>
): string {
  return [
    base,
    ...extra.filter(Boolean),
    ...resolution.classNames,
    props.className,
  ]
    .filter(Boolean)
    .join(" ");
}
