import React, { type ReactNode } from "react";
import {
  ActivityIndicator as RNActivityIndicator,
  Modal,
  type ActivityIndicatorProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { Text as RNText, View } from "./nativewind";
import { useFlowUITheme } from "./theme";

export function ActivityIndicator(props: ActivityIndicatorProps) {
  const { colors } = useFlowUITheme();
  return <RNActivityIndicator color={colors.primary} {...props} />;
}

export interface BusyIndicatorProps {
  visible: boolean;
  message?: string;
  overlayStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  indicatorStyle?: ActivityIndicatorProps["style"];
  messageStyle?: StyleProp<TextStyle>;
}

export function BusyIndicator({
  visible,
  message,
  overlayStyle,
  style,
  indicatorStyle,
  messageStyle,
}: BusyIndicatorProps) {
  const { colors, theme } = useFlowUITheme();
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        className="flex-1 items-center justify-center p-6"
        style={[{ backgroundColor: colors.overlay }, overlayStyle]}
      >
        <View
          className="min-w-48 items-center gap-3 p-5"
          style={[
            {
              backgroundColor: colors.surface,
              borderRadius: theme.radius.xl,
            },
            style,
          ]}
        >
          <RNActivityIndicator
            color={colors.primary}
            size="large"
            style={indicatorStyle}
          />
          {message ? (
            <RNText style={[{ color: colors.text }, messageStyle]}>
              {message}
            </RNText>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

export interface ProgressBarProps {
  value: number;
  maximum?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
}

export function ProgressBar({
  value,
  maximum = 100,
  className,
  style,
  indicatorStyle,
}: ProgressBarProps) {
  const { colors, theme } = useFlowUITheme();
  const percentage = Math.min(100, Math.max(0, (value / maximum) * 100));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: maximum, now: value }}
      className={`h-2 overflow-hidden ${className ?? ""}`}
      style={[
        {
          backgroundColor: colors.border,
          borderRadius: theme.radius.full,
        },
        style,
      ]}
    >
      <View
        className="h-full"
        style={[
          { width: `${percentage}%`, backgroundColor: colors.primary },
          indicatorStyle,
        ]}
      />
    </View>
  );
}

export interface NotificationProps {
  title: string;
  message?: string;
  type?: "success" | "warning" | "error" | "info";
  icon?: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  messageStyle?: StyleProp<TextStyle>;
}

export function Notification({
  title,
  message,
  type = "info",
  icon,
  className,
  style,
  contentStyle,
  titleStyle,
  messageStyle,
}: NotificationProps) {
  const { colors, theme } = useFlowUITheme();
  const accent =
    type === "success"
      ? colors.success
      : type === "warning"
        ? colors.warning
        : type === "error"
          ? colors.danger
          : colors.primary;
  return (
    <View
      accessibilityRole="alert"
      className={`flex-row gap-3 border-l-4 p-4 ${className ?? ""}`}
      style={[
        {
          borderColor: accent,
          backgroundColor: colors.surface,
          borderRadius: theme.radius.md,
        },
        style,
      ]}
    >
      {icon}
      <View className="flex-1 gap-1" style={contentStyle}>
        <RNText style={[{ color: colors.text, fontWeight: "700" }, titleStyle]}>
          {title}
        </RNText>
        {message ? (
          <RNText style={[{ color: colors.textMuted }, messageStyle]}>
            {message}
          </RNText>
        ) : null}
      </View>
    </View>
  );
}
