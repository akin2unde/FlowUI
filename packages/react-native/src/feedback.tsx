import {
  createNotificationTimer,
  notificationDuration,
  type NotificationAction,
  type NotificationType,
} from "@akin2unde/flowui-core";
import React, { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ActivityIndicator as RNActivityIndicator,
  Modal,
  type ActivityIndicatorProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { Pressable, Text as RNText, View } from "./nativewind";
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
  children?: ReactNode;
  details?: ReactNode;
  type?: NotificationType;
  open?: boolean;
  duration?: number;
  defaultDuration?: number;
  dismissible?: boolean;
  accept?: NotificationAction;
  cancel?: NotificationAction;
  onClose?: () => void;
  icon?: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  messageStyle?: StyleProp<TextStyle>;
}

const noticeColors = {
  success: ["#e9f8ee", "#a9dcc0", "#16804a", "✓"],
  info: ["#eaf3ff", "#b7d5fa", "#175db5", "ⓘ"],
  warning: ["#fff5db", "#efd18c", "#9b6108", "⚠"],
  error: ["#fff0f0", "#f2b6ba", "#b62335", "×"],
  decision: ["#f4edff", "#cfb8f0", "#6324b7", "?"],
} as const;

export function Notification({
  title,
  message,
  children,
  details,
  type = "info",
  open = true,
  duration,
  defaultDuration,
  dismissible = true,
  accept,
  cancel,
  onClose,
  icon,
  className,
  style,
  contentStyle,
  titleStyle,
  messageStyle,
}: NotificationProps) {
  const { theme } = useFlowUITheme();
  const [backgroundColor, borderColor, accent, glyph] = noticeColors[type];
  const [closed, setClosed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const busy = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const timer = useRef<ReturnType<typeof createNotificationTimer> | null>(null);
  const lifetime = notificationDuration(type, duration, defaultDuration);
  const decision = type === "decision";

  function close() {
    timer.current?.dispose();
    setClosed(true);
    onCloseRef.current?.();
  }

  useEffect(() => {
    setClosed(false);
    setExpanded(false);
    setHovered(false);
    setFocused(false);
    setError("");
    if (!open) return;
    const current = createNotificationTimer(lifetime, close);
    timer.current = current;
    current.resume();
    return () => {
      current.dispose();
      timer.current = null;
    };
  }, [open, lifetime, type]);

  useEffect(() => {
    if (expanded || hovered || focused) timer.current?.pause();
    else timer.current?.resume();
  }, [expanded, hovered, focused]);

  async function choose(action: NotificationAction) {
    if (busy.current) return;
    const current = timer.current;
    busy.current = true;
    setPending(true);
    setError("");
    try {
      await action.onClick();
      if (timer.current === current) close();
    } catch {
      if (timer.current === current)
        setError("The action could not be completed. Please try again.");
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  if (!open || closed) return null;
  return (
    <View
      accessibilityRole={decision ? undefined : "alert"}
      className={`flex-row items-start gap-3 p-4 ${className ?? ""}`}
      style={[
        {
          borderColor,
          backgroundColor,
          borderRadius: theme.radius.md,
          borderWidth: 1,
        },
        style,
      ]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {icon ?? (
        <RNText
          accessible={false}
          style={{ color: accent, fontSize: 20, fontWeight: "700" }}
        >
          {glyph}
        </RNText>
      )}
      <View className="flex-1 gap-1" style={contentStyle}>
        <RNText style={[{ color: "#162033", fontWeight: "700" }, titleStyle]}>
          {title}
        </RNText>
        {message ? (
          <RNText style={[{ color: "#162033" }, messageStyle]}>
            {message}
          </RNText>
        ) : null}
        {children}
        {details != null && (
          <>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onPress={() => setExpanded(!expanded)}
            >
              <RNText
                style={{ color: accent, textDecorationLine: "underline" }}
              >
                {expanded ? "Hide details" : "View details"}
              </RNText>
            </Pressable>
            {expanded && (
              <View
                style={{
                  padding: 8,
                  borderRadius: 6,
                  backgroundColor: "#ffffff80",
                }}
              >
                {details}
              </View>
            )}
          </>
        )}
        {decision && (
          <>
            {error ? (
              <RNText accessibilityRole="alert" style={{ color: "#9d1731" }}>
                {error}
              </RNText>
            ) : null}
            <View className="flex-row flex-wrap justify-end gap-2">
              {[cancel, accept].map(
                (action, index) =>
                  action && (
                    <Pressable
                      key={index}
                      accessibilityRole="button"
                      disabled={pending}
                      accessibilityState={{ disabled: pending }}
                      onPress={() => void choose(action)}
                      style={{
                        borderColor: accent,
                        borderWidth: 1,
                        borderRadius: 6,
                        padding: 8,
                        backgroundColor: index === 1 ? accent : "transparent",
                        opacity: pending ? 0.65 : 1,
                      }}
                    >
                      <RNText style={{ color: index === 1 ? "#fff" : accent }}>
                        {action.label}
                      </RNText>
                    </Pressable>
                  ),
              )}
            </View>
          </>
        )}
      </View>
      {!decision && dismissible && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close notification"
          hitSlop={8}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onPress={close}
        >
          <RNText style={{ color: "#162033", fontSize: 19 }}>×</RNText>
        </Pressable>
      )}
    </View>
  );
}
