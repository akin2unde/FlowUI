import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface NativeStyleProps {
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export interface NativeTextStyleProps {
  className?: string;
  style?: StyleProp<TextStyle>;
}

export interface SelectOption<T = unknown> {
  display: string | number;
  value: string | number;
  other?: T;
  disabled?: boolean;
  group?: string;
}

export type FlowIcon = ReactNode;
export type FlowThemeMode = "light" | "dark" | "system";
