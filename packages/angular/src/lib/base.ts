import { Directive, Input, inject } from "@angular/core";
import {
  resolveFlowStyle,
  type AlignValue,
  type BaseUIProps,
  type ColorValue,
  type CSSLength,
  type DimensionValue,
  type FlexDirection,
  type FlexWrap,
  type FlowUIStyle,
  type PositionValue,
  type RadiusValue,
  type ResponsiveValue,
  type SpacingValue,
} from "@akin2unde/flowui-core";
import { FlowUIThemeService } from "./theme";

@Directive()
export abstract class FlowComponentBase implements BaseUIProps {
  protected readonly fuiTheme = inject(FlowUIThemeService);
  @Input() id?: string;
  @Input() hidden?: boolean;
  @Input() testId?: string;
  @Input() className?: string;
  @Input() style?: Readonly<FlowUIStyle>;
  @Input() width?: ResponsiveValue<DimensionValue>;
  @Input() minWidth?: ResponsiveValue<DimensionValue>;
  @Input() maxWidth?: ResponsiveValue<DimensionValue | "none">;
  @Input() height?: ResponsiveValue<DimensionValue>;
  @Input() minHeight?: ResponsiveValue<DimensionValue>;
  @Input() maxHeight?: ResponsiveValue<DimensionValue | "none">;
  @Input() display?: ResponsiveValue<
    | "none"
    | "block"
    | "inline"
    | "inline-block"
    | "flex"
    | "inline-flex"
    | "grid"
  >;
  @Input() overflow?: ResponsiveValue<
    "visible" | "hidden" | "clip" | "scroll" | "auto"
  >;
  @Input() overflowX?: ResponsiveValue<
    "visible" | "hidden" | "clip" | "scroll" | "auto"
  >;
  @Input() overflowY?: ResponsiveValue<
    "visible" | "hidden" | "clip" | "scroll" | "auto"
  >;
  @Input() positionType?: ResponsiveValue<PositionValue>;
  @Input() absolute?: ResponsiveValue<boolean>;
  @Input() top?: ResponsiveValue<CSSLength | "auto">;
  @Input() right?: ResponsiveValue<CSSLength | "auto">;
  @Input() bottom?: ResponsiveValue<CSSLength | "auto">;
  @Input() left?: ResponsiveValue<CSSLength | "auto">;
  @Input() zIndex?: ResponsiveValue<number | "auto">;
  @Input() flex?: ResponsiveValue<number | string>;
  @Input() flexGrow?: ResponsiveValue<number>;
  @Input() flexShrink?: ResponsiveValue<number>;
  @Input() flexBasis?: ResponsiveValue<DimensionValue>;
  @Input() selfAlign?: ResponsiveValue<AlignValue>;
  @Input() order?: ResponsiveValue<number>;
  @Input() direction?: ResponsiveValue<FlexDirection>;
  @Input() wrap?: ResponsiveValue<FlexWrap>;
  @Input() justify?: ResponsiveValue<
    "start" | "end" | "center" | "between" | "around" | "evenly"
  >;
  @Input() align?: ResponsiveValue<AlignValue>;
  @Input() gap?: ResponsiveValue<SpacingValue>;
  @Input() rowGap?: ResponsiveValue<SpacingValue>;
  @Input() columnGap?: ResponsiveValue<SpacingValue>;
  @Input() margin?: ResponsiveValue<SpacingValue | "auto">;
  @Input() marginX?: ResponsiveValue<SpacingValue | "auto">;
  @Input() marginY?: ResponsiveValue<SpacingValue | "auto">;
  @Input() marginTop?: ResponsiveValue<SpacingValue | "auto">;
  @Input() marginRight?: ResponsiveValue<SpacingValue | "auto">;
  @Input() marginBottom?: ResponsiveValue<SpacingValue | "auto">;
  @Input() marginLeft?: ResponsiveValue<SpacingValue | "auto">;
  @Input() padding?: ResponsiveValue<SpacingValue>;
  @Input() paddingX?: ResponsiveValue<SpacingValue>;
  @Input() paddingY?: ResponsiveValue<SpacingValue>;
  @Input() paddingTop?: ResponsiveValue<SpacingValue>;
  @Input() paddingRight?: ResponsiveValue<SpacingValue>;
  @Input() paddingBottom?: ResponsiveValue<SpacingValue>;
  @Input() paddingLeft?: ResponsiveValue<SpacingValue>;
  @Input() borderWidth?: ResponsiveValue<CSSLength>;
  @Input() borderStyle?: ResponsiveValue<
    "none" | "solid" | "dashed" | "dotted" | "double"
  >;
  @Input() borderColor?: ResponsiveValue<ColorValue>;
  @Input() cornerRadius?: ResponsiveValue<RadiusValue>;
  @Input() backgroundColor?: ResponsiveValue<ColorValue>;
  @Input() opacity?: ResponsiveValue<number>;
  @Input() shadow?: ResponsiveValue<"none" | "xs" | "sm" | "md" | "lg" | "xl">;
  @Input() textColor?: ResponsiveValue<ColorValue>;
  @Input() fontFamily?: ResponsiveValue<string>;
  @Input() fontSize?: ResponsiveValue<
    "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | SpacingValue
  >;
  @Input() fontWeight?: ResponsiveValue<
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
  @Input() textAlign?: ResponsiveValue<
    "left" | "center" | "right" | "justify" | "start" | "end"
  >;
  @Input() textTransform?: ResponsiveValue<
    "none" | "uppercase" | "lowercase" | "capitalize"
  >;
  @Input() lines?: ResponsiveValue<number>;

  protected resolved(
    base: string,
    ...extra: Array<string | false | undefined>
  ) {
    const value = resolveFlowStyle(
      this as unknown as Record<string, unknown>,
      this.fuiTheme.theme,
    );
    return {
      className: [
        base,
        ...extra.filter(Boolean),
        ...value.classNames,
        this.className,
      ]
        .filter(Boolean)
        .join(" "),
      style: value.style,
    };
  }
}
