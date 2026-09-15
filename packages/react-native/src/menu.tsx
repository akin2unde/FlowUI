import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  Modal,
  Platform,
  StyleSheet,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
  useWindowDimensions,
} from "react-native";

import { Pressable, Text as RNText, View } from "./nativewind";

import { useFlowUITheme } from "./theme";

export type MenuPlacement = "top" | "bottom" | "left" | "right";

type MenuTriggerProps = Pick<
  PressableProps,
  "onPress" | "accessibilityRole" | "accessibilityState"
>;

interface MenuContextValue {
  close: () => void;
  closeOnSelect: boolean;
}

const MenuContext = createContext<MenuContextValue | null>(null);

export interface MenuProps {
  children?: ReactNode;

  trigger: (props: MenuTriggerProps) => ReactNode;

  placement?: MenuPlacement;

  offset?: number;

  closeOnSelect?: boolean;

  className?: string;

  /** Style applied to the opened menu surface. */
  style?: StyleProp<ViewStyle>;

  /** Style applied around the trigger component. */
  triggerStyle?: StyleProp<ViewStyle>;

  /** Style applied to the full-screen backdrop. */
  overlayStyle?: StyleProp<ViewStyle>;

  onOpen?: () => void;

  onClose?: () => void;
}

export function Menu({
  children,
  trigger,
  placement = "bottom",
  offset = 6,
  closeOnSelect = true,
  className,
  style,
  triggerStyle,
  overlayStyle,
  onOpen,
  onClose,
}: MenuProps) {
  const { colors, theme } = useFlowUITheme();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const triggerRef = useRef<any>(null);

  const [open, setOpen] = useState(false);

  const [anchor, setAnchor] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const [menuSize, setMenuSize] = useState({
    width: 0,
    height: 0,
  });

  const close = () => {
    // Prevent the web browser from retaining focus inside a hidden modal.
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const activeElement = document.activeElement;

      if (activeElement instanceof HTMLElement) {
        activeElement.blur();
      }
    }

    setOpen(false);
    onClose?.();
  };

  const show = () => {
    const openMenu = (x: number, y: number, width: number, height: number) => {
      setAnchor({
        x,
        y,
        width,
        height,
      });

      setOpen(true);
      onOpen?.();
    };

    if (triggerRef.current?.measureInWindow) {
      triggerRef.current.measureInWindow(openMenu);
    } else {
      // Fallback if measurement is not available.
      setOpen(true);
      onOpen?.();
    }
  };

  const menuPosition = useMemo<StyleProp<ViewStyle>>(() => {
    const menuWidth = menuSize.width || anchor.width;
    const menuHeight = menuSize.height;

    const minimumEdgeSpacing = 8;

    const leftWithinScreen = Math.max(
      minimumEdgeSpacing,
      Math.min(anchor.x, windowWidth - menuWidth - minimumEdgeSpacing),
    );

    const topWithinScreen = Math.max(
      minimumEdgeSpacing,
      Math.min(anchor.y, windowHeight - menuHeight - minimumEdgeSpacing),
    );

    switch (placement) {
      case "top":
        return {
          left: leftWithinScreen,
          top: Math.max(minimumEdgeSpacing, anchor.y - menuHeight - offset),
          minWidth: anchor.width,
        };

      case "left":
        return {
          top: topWithinScreen,
          left: Math.max(minimumEdgeSpacing, anchor.x - menuWidth - offset),
        };

      case "right":
        return {
          top: topWithinScreen,
          left: Math.min(
            anchor.x + anchor.width + offset,
            windowWidth - menuWidth - minimumEdgeSpacing,
          ),
        };

      case "bottom":
      default:
        return {
          left: leftWithinScreen,
          top: Math.min(
            anchor.y + anchor.height + offset,
            windowHeight - menuHeight - minimumEdgeSpacing,
          ),
          minWidth: anchor.width,
        };
    }
  }, [anchor, menuSize, offset, placement, windowHeight, windowWidth]);

  const triggerProps: MenuTriggerProps = {
    onPress: show,
    accessibilityRole: "button",
    accessibilityState: {
      expanded: open,
    },
  };

  return (
    <>
      <Pressable
        ref={triggerRef}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={show}
        style={triggerStyle}
      >
        {trigger(triggerProps)}
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={close}
      >
        <View style={styles.modal}>
          {/* Backdrop must be a sibling of the menu. */}
          <Pressable
            accessibilityLabel="Close menu"
            style={[
              StyleSheet.absoluteFillObject,
              styles.overlay,
              overlayStyle,
            ]}
            onPress={close}
          />

          <View
            accessibilityRole="menu"
            className={`absolute overflow-hidden border py-1 ${
              className ?? ""
            }`}
            onLayout={(event: LayoutChangeEvent) => {
              const { width, height } = event.nativeEvent.layout;

              setMenuSize({ width, height });
            }}
            style={[
              styles.menu,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: theme.components.controlRadius,
              },
              menuPosition,
              style,
            ]}
          >
            <MenuContext.Provider
              value={{
                close,
                closeOnSelect,
              }}
            >
              {children}
            </MenuContext.Provider>
          </View>
        </View>
      </Modal>
    </>
  );
}

export interface MenuItemProps extends Omit<
  PressableProps,
  "children" | "style"
> {
  children?: ReactNode;

  textValue?: string;

  className?: string;

  style?: StyleProp<ViewStyle>;

  textStyle?: StyleProp<TextStyle>;
}

export function MenuItem({
  children,
  textValue,
  className,
  style,
  textStyle,
  disabled,
  onPress,
  ...props
}: MenuItemProps) {
  const { colors } = useFlowUITheme();
  const menuContext = useContext(MenuContext);

  const handlePress = (event: GestureResponderEvent) => {
    onPress?.(event);

    if (menuContext?.closeOnSelect) {
      menuContext.close();
    }
  };

  return (
    <Pressable
      {...props}
      accessibilityRole="menuitem"
      accessibilityLabel={textValue}
      accessibilityState={{ disabled }}
      disabled={disabled}
      className={`min-h-11 justify-center px-4 py-2 ${className ?? ""}`}
      style={[
        {
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
      onPress={handlePress}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <RNText
          style={[
            {
              color: colors.text,
            },
            textStyle,
          ]}
        >
          {children}
        </RNText>
      ) : (
        children
      )}
    </Pressable>
  );
}

export interface MenuItemLabelProps {
  children?: ReactNode;

  className?: string;

  style?: StyleProp<TextStyle>;
}

export function MenuItemLabel({
  children,
  className,
  style,
}: MenuItemLabelProps) {
  const { colors } = useFlowUITheme();

  return (
    <RNText
      className={className}
      style={[
        {
          color: colors.text,
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },

  overlay: {
    backgroundColor: "transparent",
  },

  menu: {
    minWidth: 150,

    elevation: 5,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
});
