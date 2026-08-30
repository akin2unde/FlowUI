import type * as CSS from "csstype";

export type CSSLength =
  | number
  | `${number}px`
  | `${number}rem`
  | `${number}em`
  | `${number}%`
  | `${number}vh`
  | `${number}vw`
  | `calc(${string})`
  | `var(--${string})`;
export type BreakpointName = "sm" | "md" | "lg" | "xl" | "xxl";
export interface ResponsiveObject<T> {
  default?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  xxl?: T;
}
export type ResponsiveValue<T> = T | ResponsiveObject<T>;
export type SpacingToken =
  "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type SpacingValue = SpacingToken | CSSLength;
export type RadiusToken = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "full";
export type RadiusValue = RadiusToken | CSSLength;
export type PaletteColor =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "neutral";
export type ColorShade =
  50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
export type SchemeColor =
  | "canvas"
  | "surface"
  | "surfaceRaised"
  | "surfaceSunken"
  | "text"
  | "textMuted"
  | "textDisabled"
  | "textInverse"
  | "border"
  | "borderStrong"
  | "focus"
  | "overlay";
export type ColorValue =
  | PaletteColor
  | `${PaletteColor}.${ColorShade}`
  | SchemeColor
  | "transparent"
  | "currentColor"
  | "inherit"
  | `#${string}`
  | `rgb(${string})`
  | `rgba(${string})`
  | `hsl(${string})`
  | `hsla(${string})`
  | `var(--${string})`;
export type ComponentSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ComponentVariant = "solid" | "outline" | "soft" | "ghost" | "link";
export type Orientation = "horizontal" | "vertical";
export type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";
export type JustifyValue =
  "start" | "end" | "center" | "between" | "around" | "evenly";
export type AlignValue = "start" | "end" | "center" | "stretch" | "baseline";
export type PositionValue =
  "static" | "relative" | "absolute" | "fixed" | "sticky";
export type DimensionValue =
  CSSLength | "auto" | "full" | "fit" | "min" | "max";
export type ThemeMode = "light" | "dark" | "system";
export type FlowUIStyle = CSS.Properties<string | number>;
export type CSSVariableStyle = Partial<
  Record<`--fui-${string}`, string | number>
>;
export type ResolvedStyle = FlowUIStyle & CSSVariableStyle;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface SpacingProps {
  margin?: ResponsiveValue<SpacingValue | "auto">;
  marginX?: ResponsiveValue<SpacingValue | "auto">;
  marginY?: ResponsiveValue<SpacingValue | "auto">;
  marginTop?: ResponsiveValue<SpacingValue | "auto">;
  marginRight?: ResponsiveValue<SpacingValue | "auto">;
  marginBottom?: ResponsiveValue<SpacingValue | "auto">;
  marginLeft?: ResponsiveValue<SpacingValue | "auto">;
  padding?: ResponsiveValue<SpacingValue>;
  paddingX?: ResponsiveValue<SpacingValue>;
  paddingY?: ResponsiveValue<SpacingValue>;
  paddingTop?: ResponsiveValue<SpacingValue>;
  paddingRight?: ResponsiveValue<SpacingValue>;
  paddingBottom?: ResponsiveValue<SpacingValue>;
  paddingLeft?: ResponsiveValue<SpacingValue>;
}

export interface LayoutProps {
  display?: ResponsiveValue<
    | "none"
    | "block"
    | "inline"
    | "inline-block"
    | "flex"
    | "inline-flex"
    | "grid"
  >;
  width?: ResponsiveValue<DimensionValue>;
  minWidth?: ResponsiveValue<DimensionValue>;
  maxWidth?: ResponsiveValue<DimensionValue | "none">;
  height?: ResponsiveValue<DimensionValue>;
  minHeight?: ResponsiveValue<DimensionValue>;
  maxHeight?: ResponsiveValue<DimensionValue | "none">;
  overflow?: ResponsiveValue<"visible" | "hidden" | "clip" | "scroll" | "auto">;
  overflowX?: ResponsiveValue<
    "visible" | "hidden" | "clip" | "scroll" | "auto"
  >;
  overflowY?: ResponsiveValue<
    "visible" | "hidden" | "clip" | "scroll" | "auto"
  >;
}

export interface PositionProps {
  positionType?: ResponsiveValue<PositionValue>;
  absolute?: ResponsiveValue<boolean>;
  top?: ResponsiveValue<CSSLength | "auto">;
  right?: ResponsiveValue<CSSLength | "auto">;
  bottom?: ResponsiveValue<CSSLength | "auto">;
  left?: ResponsiveValue<CSSLength | "auto">;
  zIndex?: ResponsiveValue<number | "auto">;
}

export interface FlexContainerProps {
  direction?: ResponsiveValue<FlexDirection>;
  wrap?: ResponsiveValue<FlexWrap>;
  justify?: ResponsiveValue<JustifyValue>;
  align?: ResponsiveValue<AlignValue>;
  gap?: ResponsiveValue<SpacingValue>;
  rowGap?: ResponsiveValue<SpacingValue>;
  columnGap?: ResponsiveValue<SpacingValue>;
}

export interface FlexItemProps {
  flex?: ResponsiveValue<number | string>;
  flexGrow?: ResponsiveValue<number>;
  flexShrink?: ResponsiveValue<number>;
  flexBasis?: ResponsiveValue<DimensionValue>;
  selfAlign?: ResponsiveValue<AlignValue>;
  order?: ResponsiveValue<number>;
}

export interface BorderProps {
  borderWidth?: ResponsiveValue<CSSLength>;
  borderStyle?: ResponsiveValue<
    "none" | "solid" | "dashed" | "dotted" | "double"
  >;
  borderColor?: ResponsiveValue<ColorValue>;
  cornerRadius?: ResponsiveValue<RadiusValue>;
}

export interface VisualProps {
  backgroundColor?: ResponsiveValue<ColorValue>;
  opacity?: ResponsiveValue<number>;
  shadow?: ResponsiveValue<"none" | "xs" | "sm" | "md" | "lg" | "xl">;
}

export interface TypographyProps {
  textColor?: ResponsiveValue<ColorValue>;
  fontFamily?: ResponsiveValue<string>;
  fontSize?: ResponsiveValue<ComponentSize | "2xl" | "3xl" | CSSLength>;
  fontWeight?: ResponsiveValue<
    | "thin"
    | "extraLight"
    | "light"
    | "normal"
    | "medium"
    | "semiBold"
    | "bold"
    | "extraBold"
    | "black"
    | number
  >;
  textAlign?: ResponsiveValue<
    "left" | "center" | "right" | "justify" | "start" | "end"
  >;
  textTransform?: ResponsiveValue<
    "none" | "uppercase" | "lowercase" | "capitalize"
  >;
  lines?: ResponsiveValue<number>;
}

export interface BaseUIProps
  extends
    SpacingProps,
    LayoutProps,
    PositionProps,
    FlexItemProps,
    BorderProps,
    VisualProps {
  id?: string;
  hidden?: boolean;
  testId?: string;
  className?: string;
  style?: Readonly<FlowUIStyle>;
}
export interface DisableableProps {
  disabled?: boolean;
}
export interface ReadOnlyProps {
  readOnly?: boolean;
}
export interface RequiredProps {
  required?: boolean;
}
export interface LoadingProps {
  loading?: boolean;
  loadingText?: string;
}
export interface FocusableProps {
  autoFocus?: boolean;
  tabIndex?: number;
}
