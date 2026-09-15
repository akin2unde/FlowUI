import React, { type ReactNode } from "react";
import { Modal, Platform } from "react-native";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text as RNText,
  View,
} from "./nativewind";
import { useFlowUITheme } from "./theme";

export interface DialogProps {
  visible: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  dismissOnBackdropPress?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  position?: "center" | "top" | "bottom" | "left" | "right";
  scrollable?: boolean;
  className?: string;
}

export function Dialog({
  visible,
  onOpen,
  onClose,
  dismissOnBackdropPress = true,
  header,
  footer,
  children,
  position = "center",
  scrollable = true,
  className,
}: DialogProps) {
  const { colors, theme } = useFlowUITheme();
  const alignment =
    position === "top"
      ? "justify-start"
      : position === "bottom"
        ? "justify-end"
        : position === "left"
          ? "items-start"
          : position === "right"
            ? "items-end"
            : "items-center justify-center";
  const body = scrollable ? <ScrollView>{children}</ScrollView> : children;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onShow={onOpen}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        className={`flex-1 p-4 ${alignment}`}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ backgroundColor: colors.overlay }}
      >
        <Pressable
          accessibilityLabel="Close dialog"
          className="absolute inset-0"
          onPress={dismissOnBackdropPress ? onClose : undefined}
        />
        <View
          accessibilityViewIsModal
          className={`max-h-[90%] w-full overflow-hidden sm:max-w-xl ${className ?? ""}`}
          style={{
            backgroundColor: colors.surface,
            borderRadius: theme.radius.xl,
          }}
        >
          {header ? (
            <View
              className="border-b p-4"
              style={{ borderColor: colors.border }}
            >
              {header}
            </View>
          ) : null}
          <View className="p-4">{body}</View>
          {footer ? (
            <View
              className="border-t p-4"
              style={{ borderColor: colors.border }}
            >
              {footer}
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export interface BottomSheetProps extends Omit<DialogProps, "position"> {
  title?: string;
}

export function BottomSheet({ title, header, ...props }: BottomSheetProps) {
  const { colors } = useFlowUITheme();
  return (
    <Dialog
      position="bottom"
      header={
        header ?? (
          <View className="items-center gap-2">
            <View
              className="h-1 w-12 rounded-full"
              style={{ backgroundColor: colors.border }}
            />
            {title ? (
              <RNText style={{ color: colors.text, fontWeight: "700" }}>
                {title}
              </RNText>
            ) : null}
          </View>
        )
      }
      {...props}
    />
  );
}
