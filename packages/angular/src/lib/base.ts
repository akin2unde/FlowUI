import type { FieldFocusStyle } from "@akin2unde/flowui-core";
import {
  Directive,
  Input,
  inject,
  ElementRef,
  afterEveryRender,
} from "@angular/core";
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
  private readonly flowHost: ElementRef<HTMLElement> | null = inject(
    ElementRef,
    { optional: true },
  );
  @Input() nativeAttributes: Record<
    string,
    string | number | boolean | null | undefined
  > = {};
  private previousNativeAttributes = new Set<string>();
  constructor() {
    if (!this.flowHost) return;
    afterEveryRender(() => {
      const node = this.nativeElement;
      if (!node) return;
      for (const key of this.previousNativeAttributes)
        if (!(key in this.nativeAttributes)) node.removeAttribute(key);
      for (const [key, value] of Object.entries(this.nativeAttributes)) {
        if (/^on/i.test(key) || ["style", "class", "innerHTML"].includes(key))
          continue;
        if (value == null || (value === false && !key.startsWith("aria-")))
          node.removeAttribute(key);
        else
          node.setAttribute(
            key,
            value === true && !key.startsWith("aria-") ? "" : String(value),
          );
      }
      this.previousNativeAttributes = new Set(
        Object.keys(this.nativeAttributes),
      );
    });
  }
  get nativeElement(): HTMLElement | null {
    return (
      this.flowHost?.nativeElement.querySelector<HTMLElement>(
        ".fui-control,.fui-select-trigger",
      ) ??
      this.flowHost?.nativeElement.querySelector<HTMLElement>(
        "button,input,textarea,select:not(.fui-native-validation)",
      ) ??
      this.flowHost?.nativeElement ??
      null
    );
  }
  focus(): void {
    this.nativeElement?.focus();
  }
  protected readonly fuiTheme = inject(FlowUIThemeService);
  @Input() id?: string;
  @Input() focusStyle?: FieldFocusStyle;
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
  @Input() iconColor?: ResponsiveValue<ColorValue>;
  @Input() placeholderColor?: ResponsiveValue<ColorValue>;
  @Input() panelBackgroundColor?: ResponsiveValue<ColorValue>;
  @Input() panelTextColor?: ResponsiveValue<ColorValue>;
  @Input() optionHoverBackgroundColor?: ResponsiveValue<ColorValue>;
  @Input() selectedOptionBackgroundColor?: ResponsiveValue<ColorValue>;
  @Input() selectedOptionTextColor?: ResponsiveValue<ColorValue>;
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
