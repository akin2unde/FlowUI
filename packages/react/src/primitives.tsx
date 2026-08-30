import {
  createElement,
  useState,
  type HTMLAttributes,
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

export interface StackProps extends PropsWithChildren<CoreHStackProps> {}
export function HStack({
  children,
  as = "div",
  inline,
  direction = "row",
  ...props
}: StackProps) {
  const flow = useFlowProps(
    "fui-h-stack",
    { ...props, direction },
    inline && "fui-inline",
  );
  return createElement(as, flow, children);
}
export const HC = HStack;

export interface VStackProps extends PropsWithChildren<CoreVStackProps> {}
export function VStack({
  children,
  as = "div",
  inline,
  direction = "column",
  ...props
}: VStackProps) {
  const flow = useFlowProps(
    "fui-v-stack",
    { ...props, direction },
    inline && "fui-inline",
  );
  return createElement(as, flow, children);
}
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

export interface LabelProps extends PropsWithChildren<CoreLabelProps> {}
export function Label({ children, htmlFor, required, ...props }: LabelProps) {
  const flow = useFlowProps("fui-label", props);
  return (
    <label {...flow} htmlFor={htmlFor}>
      {children}
      {required && (
        <span className="fui-required" aria-hidden="true">
          {" "}
          *
        </span>
      )}
    </label>
  );
}

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
  return (
    <div
      {...flow}
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
