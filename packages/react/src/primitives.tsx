import {
  forwardRef,
  createElement,
  useState,
  type HTMLAttributes,
  type LabelHTMLAttributes,
  type Ref,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import type {
  BadgeProps as CoreBadgeProps,
  DividerProps as CoreDividerProps,
  HStackProps as CoreHStackProps,
  IconProps as CoreIconProps,
  ImageProps as CoreImageProps,
  LabelProps as CoreLabelProps,
  VStackProps as CoreVStackProps,
} from "@akin2unde/flowui-core";
import { useFlowProps } from "./helpers";

export interface StackProps
  extends
    PropsWithChildren<CoreHStackProps>,
    Omit<HTMLAttributes<HTMLElement>, keyof CoreHStackProps> {
  ref?: Ref<HTMLElement>;
}
export const HStack = forwardRef<HTMLElement, StackProps>(function HStack(
  { children, as = "div", inline, direction = "row", ...props }: StackProps,
  forwardedRef,
) {
  const flow = useFlowProps(
    "fui-h-stack",
    { ...props, direction },
    inline && "fui-inline",
  );
  return createElement(as, { ...flow, ref: forwardedRef }, children);
});
export const HC = HStack;

export interface VStackProps
  extends
    PropsWithChildren<CoreVStackProps>,
    Omit<HTMLAttributes<HTMLElement>, keyof CoreVStackProps> {
  ref?: Ref<HTMLElement>;
}
export const VStack = forwardRef<HTMLElement, VStackProps>(function VStack(
  { children, as = "div", inline, direction = "column", ...props }: VStackProps,
  forwardedRef,
) {
  const flow = useFlowProps(
    "fui-v-stack",
    { ...props, direction },
    inline && "fui-inline",
  );
  return createElement(as, { ...flow, ref: forwardedRef }, children);
});
export const VC = VStack;

export interface IconProps extends CoreIconProps {}
export function Icon({ icon, label, spin, ...props }: IconProps) {
  const flow = useFlowProps("fui-icon", props, spin && "fui-icon-spin", icon);
  return (
    <i
      {...flow}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    />
  );
}

export interface LabelProps
  extends
    PropsWithChildren<CoreLabelProps>,
    Omit<LabelHTMLAttributes<HTMLLabelElement>, keyof CoreLabelProps> {
  ref?: Ref<HTMLLabelElement>;
}
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { children, htmlFor, required, ...props }: LabelProps,
  forwardedRef,
) {
  const flow = useFlowProps("fui-label", props);
  return (
    <label ref={forwardedRef} {...flow} htmlFor={htmlFor}>
      {children}
      {required && (
        <span className="fui-required" aria-hidden="true">
          {" "}
          *
        </span>
      )}
    </label>
  );
});

export interface BadgeProps extends PropsWithChildren<CoreBadgeProps> {}
export function Badge({
  children,
  color = "primary",
  variant = "solid",
  size = "sm",
  icon,
  iconPosition = "left",
  ...props
}: BadgeProps) {
  const flow = useFlowProps("fui-badge", props);
  return (
    <span {...flow} data-color={color} data-variant={variant} data-size={size}>
      {icon && iconPosition === "left" && <Icon icon={icon} />}
      {children}
      {icon && iconPosition === "right" && <Icon icon={icon} />}
    </span>
  );
}

export interface DividerProps extends CoreDividerProps {}
export function Divider({
  orientation = "horizontal",
  label,
  ...props
}: DividerProps) {
  const flow = useFlowProps("fui-divider", props);
  const { backgroundColor, ...style } = flow.style;
  const lineStyle =
    backgroundColor === undefined
      ? style
      : {
          ...style,
          "--fui-control-background": backgroundColor,
        };
  return (
    <div
      {...flow}
      style={lineStyle}
      data-labeled={Boolean(label)}
      data-orientation={orientation}
      role="separator"
      aria-orientation={orientation}
    >
      {orientation === "horizontal" && label}
    </div>
  );
}

export interface ImageProps
  extends
    CoreImageProps,
    Omit<HTMLAttributes<HTMLImageElement>, "color" | "style"> {}
export function Image({
  src,
  alt,
  fit = "cover",
  loading = "lazy",
  fallbackSrc,
  onError,
  ...props
}: ImageProps) {
  const [source, setSource] = useState(src);
  const flow = useFlowProps("fui-image", {
    ...props,
    style: { ...props.style, objectFit: fit },
  });
  return (
    <img
      {...flow}
      src={source}
      alt={alt}
      loading={loading}
      onError={(event) => {
        if (fallbackSrc && source !== fallbackSrc) setSource(fallbackSrc);
        onError?.(event);
      }}
    />
  );
}
