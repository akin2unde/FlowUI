import {
  ActivityIndicator,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import type { AsyncLabelCode } from "@akin2unde/flowui-core";
import { HStack, Text } from "./primitives";
import { useFlowUITheme } from "./theme";
import { useAsyncLabel } from "./async-label-store";
export * from "./async-label-store";
export interface AsyncLabelProps {
  lookup: string;
  code?: AsyncLabelCode;
  fallback?: string;
  loadingText?: string;
  showLoader?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}
export function AsyncLabel({
  lookup,
  code,
  fallback,
  loadingText = "Resolving…",
  showLoader = true,
  className,
  style,
  textStyle,
  testID,
}: AsyncLabelProps) {
  const state = useAsyncLabel(lookup, code);
  const { colors } = useFlowUITheme();
  const busy =
    state.status === "loading" ||
    (state.status === "idle" &&
      code !== null &&
      code !== undefined &&
      String(code).trim() !== "");
  const text =
    state.status === "ready"
      ? state.label
      : busy
        ? loadingText
        : (fallback ?? String(code ?? ""));
  return (
    <HStack
      className={className}
      style={[{ alignItems: "center", gap: 6 }, style]}
      testID={testID}
      accessibilityState={{ busy }}
    >
      {busy && showLoader && (
        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={{ width: 16, height: 16 }}
          accessible={false}
        />
      )}
      <Text style={textStyle}>{text}</Text>
    </HStack>
  );
}
