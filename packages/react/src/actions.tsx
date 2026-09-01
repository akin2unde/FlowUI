import {
  Children,
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import type {
  ButtonGroupProps as CoreButtonGroupProps,
  ButtonProps as CoreButtonProps,
} from "@akin2unde/flowui-core";
import { useFlowProps } from "./helpers";
import { Badge, Icon } from "./primitives";

export interface ButtonProps
  extends
    PropsWithChildren<CoreButtonProps>,
    Omit<
      ButtonHTMLAttributes<HTMLButtonElement>,
      "color" | "style" | "children"
    > {
  selected?: boolean;
}
export function Button({
  children,
  type = "button",
  variant = "solid",
  color = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  badge,
  loading,
  loadingText,
  ariaLabel,
  disabled,
  onClick,
  selected,
  ...props
}: ButtonProps) {
  const flow = useFlowProps("fui-button", props);
  const iconOnly = iconPosition === "center";
  return (
    <button
      {...flow}
      type={type}
      data-variant={variant}
      data-color={color}
      data-size={size}
      data-selected={selected}
      aria-pressed={selected}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      onClick={onClick}
    >
      {loading ? (
        <Icon icon="fa-solid fa-spinner" spin />
      ) : icon && iconPosition !== "right" ? (
        <Icon icon={icon} />
      ) : null}
      {!iconOnly && (loading && loadingText ? loadingText : children)}
      {!loading && icon && iconPosition === "right" && <Icon icon={icon} />}
      {badge !== undefined && (
        <Badge color="danger" size="xs">
          {badge}
        </Badge>
      )}
    </button>
  );
}

export interface ButtonGroupProps extends PropsWithChildren<CoreButtonGroupProps> {
  onChange?: (value: string | number) => void;
}
export function ButtonGroup({
  children,
  orientation = "horizontal",
  attached = true,
  selectable = false,
  value,
  onChange,
  ...props
}: ButtonGroupProps) {
  const flow = useFlowProps("fui-button-group", props);
  return (
    <div
      {...flow}
      role="group"
      data-orientation={orientation}
      data-attached={attached}
    >
      {selectable
        ? Children.map(children, (child) => {
            if (!isValidElement(child)) return child;
            const button = child as ReactElement<ButtonProps>;
            const childValue = button.props.value;
            return cloneElement(button, {
              selected: childValue === value,
              onClick: (event) => {
                button.props.onClick?.(event);
                if (
                  typeof childValue === "string" ||
                  typeof childValue === "number"
                ) {
                  onChange?.(childValue);
                }
              },
            });
          })
        : children}
    </div>
  );
}
