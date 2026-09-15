import React, { type PropsWithChildren, type ReactNode } from "react";
import {
  type ImageProps,
  type ScrollViewProps,
  type TextProps,
  type ViewProps,
} from "react-native";
import {
  Image as RNImage,
  ScrollView as RNScrollView,
  Text as RNText,
  View,
} from "./nativewind";
import { useFlowUITheme } from "./theme";

type ClassName = { className?: string };

export interface BoxProps extends ViewProps, ClassName {}

export function Box({ className, ...props }: BoxProps) {
  return <View className={className} {...props} />;
}

export function VStack({ className, ...props }: BoxProps) {
  return <View className={`flex-col ${className ?? ""}`} {...props} />;
}

export function VCenter({ className, ...props }: BoxProps) {
  return (
    <View
      className={`flex-col items-center justify-center ${className ?? ""}`}
      {...props}
    />
  );
}

export function HStack({ className, ...props }: BoxProps) {
  return <View className={`flex-row ${className ?? ""}`} {...props} />;
}

export const VC = VStack;
export const HC = HStack;

export interface FlowTextProps extends TextProps, ClassName {
  children?: ReactNode;
  muted?: boolean;
}

export function Text({ className, muted, style, ...props }: FlowTextProps) {
  const { colors } = useFlowUITheme();
  return (
    <RNText
      className={className}
      style={[{ color: muted ? colors.textMuted : colors.text }, style]}
      {...props}
    />
  );
}

export interface CardProps extends BoxProps {
  elevated?: boolean;
}

export function Card({ className, elevated, style, ...props }: CardProps) {
  const { colors, theme } = useFlowUITheme();
  return (
    <View
      className={`border p-4 ${className ?? ""}`}
      style={[
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: theme.radius.lg,
        },
        elevated
          ? {
              elevation: 3,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.12,
              shadowRadius: 5,
            }
          : undefined,
        style,
      ]}
      {...props}
    />
  );
}

export interface DividerProps extends ViewProps, ClassName {
  orientation?: "horizontal" | "vertical";
}

export function Divider({
  orientation = "horizontal",
  className,
  style,
  ...props
}: DividerProps) {
  const { colors } = useFlowUITheme();
  return (
    <View
      className={className}
      style={[
        orientation === "horizontal"
          ? { height: 1, width: "100%" }
          : { height: "100%", width: 1 },
        { backgroundColor: colors.border },
        style,
      ]}
      {...props}
    />
  );
}

export interface ScrollContainerProps extends ScrollViewProps, ClassName {
  contentContainerClassName?: string;
}

export function ScrollContainer({ className, ...props }: ScrollContainerProps) {
  return <RNScrollView className={className} {...props} />;
}

export interface FlowImageProps extends ImageProps, ClassName {}

export function Image({ className, ...props }: FlowImageProps) {
  return <RNImage className={className} {...props} />;
}

export interface AvatarProps extends Omit<FlowImageProps, "source"> {
  source?: ImageProps["source"];
  fallback?: string;
  size?: number;
}

export function Avatar({
  source,
  fallback = "?",
  size = 44,
  style,
  ...props
}: AvatarProps) {
  const { colors } = useFlowUITheme();
  if (source) {
    return (
      <RNImage
        source={source}
        style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
        {...props}
      />
    );
  }
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary,
      }}
    >
      <RNText style={{ color: colors.primaryText, fontWeight: "700" }}>
        {fallback.slice(0, 2).toUpperCase()}
      </RNText>
    </View>
  );
}

export interface SectionProps extends PropsWithChildren, ClassName {
  title: string;
  description?: string;
}

export function Section({
  title,
  description,
  children,
  className,
}: SectionProps) {
  return (
    <VStack className={`gap-3 ${className ?? ""}`}>
      <VStack className="gap-1">
        <Text className="text-lg font-bold">{title}</Text>
        {description ? <Text muted>{description}</Text> : null}
      </VStack>
      {children}
    </VStack>
  );
}
