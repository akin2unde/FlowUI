import React, {
  forwardRef,
  cloneElement,
  isValidElement,
  type ReactNode,
} from "react";
import {
  ActivityIndicator,
  type GestureResponderEvent,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
  type View as NativeView,
} from "react-native";
import { Pressable, Text as RNText, View } from "./nativewind";
import { useFlowUITheme } from "./theme";

export type ButtonVariant =
  "primary" | "secondary" | "outline" | "ghost" | "danger";

export interface ButtonProps extends Omit<PressableProps, "children"> {
  children?: ReactNode;
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  className?: string;
  textClassName?: string;
  textStyle?: StyleProp<TextStyle>;
  variant?: ButtonVariant;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<NativeView, ButtonProps>(function Button(
  {
    children,
    text,
    backgroundColor: customBackground,
    textColor,
    iconColor,
    className,
    textClassName,
    textStyle,
    variant = "primary",
    icon,
    iconPosition = "left",
    loading,
    disabled,
    fullWidth,
    style,
    ...props
  }: ButtonProps,
  ref,
) {
  const { colors, theme } = useFlowUITheme();
  const filled = variant === "primary" || variant === "danger";
  const backgroundColor =
    customBackground ??
    (variant === "primary"
      ? colors.primary
      : variant === "danger"
        ? colors.danger
        : variant === "secondary"
          ? colors.surfaceRaised
          : "transparent");
  const color = textColor ?? (filled ? colors.primaryText : colors.text);

  const renderedIcon =
    iconColor && isValidElement<{ color?: string }>(icon)
      ? cloneElement(icon, { color: iconColor })
      : icon;
  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      disabled={disabled || loading}
      className={`flex-row items-center justify-center gap-2 px-4 active:opacity-80 ${className ?? ""}`}
      style={({ pressed }: PressableStateCallbackType) => [
        {
          minHeight: theme.components.buttonHeight,
          borderRadius: theme.components.controlRadius,
          backgroundColor,
          borderColor: variant === "outline" ? colors.border : "transparent",
          borderWidth: variant === "outline" ? 1 : 0,
          opacity: disabled ? 0.5 : pressed ? 0.82 : 1,
          width: fullWidth ? "100%" : undefined,
        },
        typeof style === "function" ? style({ pressed }) : style,
      ]}
      {...props}
    >
      {loading ? <ActivityIndicator color={color} /> : null}
      {!loading && icon && iconPosition === "left" ? renderedIcon : null}
      <RNText
        className={`font-semibold ${textClassName ?? ""}`}
        style={[{ color }, textStyle]}
      >
        {children ?? text}
      </RNText>
      {!loading && icon && iconPosition === "right" ? renderedIcon : null}
    </Pressable>
  );
});

export interface IconButtonProps extends Omit<ButtonProps, "children"> {
  icon: ReactNode;
  label: string;
}

export function IconButton({ icon, label, ...props }: IconButtonProps) {
  return (
    <Button accessibilityLabel={label} icon={icon} {...props}>
      {""}
    </Button>
  );
}

export interface ButtonGroupOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface ButtonGroupProps {
  options: ButtonGroupOption[];
  value?: string | number;
  onValueChange?: (value: string | number) => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
  optionStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  selectedTextStyle?: StyleProp<TextStyle>;
}

export function ButtonGroup({
  options,
  value,
  onValueChange,
  className,
  style,
  optionStyle,
  textStyle,
  selectedTextStyle,
}: ButtonGroupProps) {
  const { colors, theme } = useFlowUITheme();
  return (
    <View
      className={`flex-row gap-1 p-1 ${className ?? ""}`}
      style={[
        {
          backgroundColor: colors.surfaceRaised,
          borderRadius: theme.components.controlRadius,
        },
        style,
      ]}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={String(option.value)}
            accessibilityRole="radio"
            accessibilityState={{
              checked: selected,
              disabled: option.disabled,
            }}
            disabled={option.disabled}
            onPress={() => onValueChange?.(option.value)}
            className="min-h-10 flex-1 items-center justify-center px-3"
            style={[
              {
                borderRadius: theme.radius.md,
                backgroundColor: selected ? colors.primary : "transparent",
                opacity: option.disabled ? 0.45 : 1,
              },
              optionStyle,
            ]}
          >
            <RNText
              style={[
                {
                  color: selected ? colors.primaryText : colors.text,
                  fontWeight: "600",
                },
                textStyle,
                selected ? selectedTextStyle : undefined,
              ]}
            >
              {option.label}
            </RNText>
          </Pressable>
        );
      })}
    </View>
  );
}

export interface ChipProps {
  children: ReactNode;
  className?: string;
  selected?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  removeLabel?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  removeStyle?: StyleProp<ViewStyle>;
  removeTextStyle?: StyleProp<TextStyle>;
}

export function Chip({
  children,
  className,
  selected,
  onPress,
  onRemove,
  removeLabel = "Remove",
  style,
  textStyle,
  removeStyle,
  removeTextStyle,
}: ChipProps) {
  const { colors, theme } = useFlowUITheme();
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      onPress={onPress}
      className={`flex-row items-center gap-2 px-3 py-2 ${className ?? ""}`}
      style={[
        {
          borderRadius: theme.radius.full,
          backgroundColor: selected ? colors.primary : colors.surfaceRaised,
          borderColor: colors.border,
          borderWidth: 1,
        },
        style,
      ]}
    >
      <RNText
        style={[
          { color: selected ? colors.primaryText : colors.text },
          textStyle,
        ]}
      >
        {children}
      </RNText>
      {onRemove ? (
        <Pressable
          accessibilityLabel={removeLabel}
          hitSlop={8}
          style={[{ marginRight: 2 }, removeStyle]}
          onPress={(event: GestureResponderEvent) => {
            event.stopPropagation();
            onRemove();
          }}
        >
          <RNText
            style={[
              { color: selected ? colors.primaryText : colors.text },
              removeTextStyle,
            ]}
          >
            ×
          </RNText>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

export interface BadgeProps {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "success" | "warning" | "danger";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Badge({
  children,
  className,
  tone = "neutral",
  style,
  textStyle,
}: BadgeProps) {
  const { colors, theme } = useFlowUITheme();
  const backgroundColor =
    tone === "success"
      ? colors.success
      : tone === "warning"
        ? colors.warning
        : tone === "danger"
          ? colors.danger
          : colors.surfaceRaised;
  return (
    <View
      className={`self-start px-2 py-1 ${className ?? ""}`}
      style={[{ borderRadius: theme.radius.full, backgroundColor }, style]}
    >
      <RNText
        style={[
          {
            color: tone === "neutral" ? colors.text : colors.primaryText,
            fontSize: 12,
            fontWeight: "700",
          },
          textStyle,
        ]}
      >
        {children}
      </RNText>
    </View>
  );
}
