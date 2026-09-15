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

export interface MenuProps {
  children?: ReactNode;
  trigger: (props: MenuTriggerProps) => ReactNode;
  placement?: MenuPlacement;
  offset?: number;
  closeOnSelect?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  triggerStyle?: StyleProp<ViewStyle>;
  overlayStyle?: StyleProp<ViewStyle>;
  onOpen?: () => void;
  onClose?: () => void;
}

const MenuContext = createContext<{
  close: () => void;
  closeOnSelect: boolean;
} | null>(null);

export function Menu({
  children,
  trigger,
  placement = "bottom",
  offset = 4,
  closeOnSelect = true,
  className,
  style,
  triggerStyle,
  overlayStyle,
  onOpen,
  onClose,
}: MenuProps) {
  const { colors, theme } = useFlowUITheme();
  const anchorRef = useRef<any>(null);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [menuSize, setMenuSize] = useState({ width: 0, height: 0 });

  const close = () => {
    setOpen(false);
    onClose?.();
  };

  const show = () => {
    const commit = (x: number, y: number, width: number, height: number) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
      onOpen?.();
    };
    anchorRef.current?.measureInWindow?.(commit);
  };

  const position = useMemo<StyleProp<ViewStyle>>(() => {
    const horizontalLeft = Math.max(
      offset,
      Math.min(anchor.x, windowWidth - menuSize.width - offset),
    );
    const verticalTop = Math.max(
      offset,
      Math.min(anchor.y, windowHeight - menuSize.height - offset),
    );
    if (placement === "top") {
      return {
        left: horizontalLeft,
        top: Math.max(offset, anchor.y - menuSize.height - offset),
        minWidth: anchor.width,
      };
    }
    if (placement === "left") {
      return {
        top: verticalTop,
        left: Math.max(offset, anchor.x - menuSize.width - offset),
      };
    }
    if (placement === "right") {
      return {
        top: verticalTop,
        left: Math.min(
          anchor.x + anchor.width + offset,
          windowWidth - menuSize.width - offset,
        ),
      };
    }
    return {
      top: Math.min(
        anchor.y + anchor.height + offset,
        windowHeight - menuSize.height - offset,
      ),
      left: horizontalLeft,
      minWidth: anchor.width,
    };
  }, [anchor, menuSize, offset, placement, windowHeight, windowWidth]);

  const triggerProps: MenuTriggerProps = {
    onPress: show,
    accessibilityRole: "button",
    accessibilityState: { expanded: open },
  };

  return (
    <>
      <Pressable
        ref={anchorRef}
        onPress={show}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
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
        <Pressable
          accessibilityLabel="Close menu"
          className="absolute inset-0"
          style={overlayStyle}
          onPress={close}
        />
        <View
          accessibilityRole="menu"
          onLayout={(event: LayoutChangeEvent) =>
            setMenuSize(event.nativeEvent.layout)
          }
          className={`absolute overflow-hidden border py-1 ${className ?? ""}`}
          style={[
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: theme.components.controlRadius,
              elevation: 5,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.18,
              shadowRadius: 8,
            },
            position,
            style,
          ]}
        >
          <MenuContext.Provider value={{ close, closeOnSelect }}>
            {children}
          </MenuContext.Provider>
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
  const context = useContext(MenuContext);
  return (
    <Pressable
      accessibilityRole="menuitem"
      accessibilityLabel={textValue}
      disabled={disabled}
      className={`min-h-11 justify-center px-4 py-2 ${className ?? ""}`}
      style={[{ opacity: disabled ? 0.45 : 1 }, style]}
      onPress={(event: GestureResponderEvent) => {
        onPress?.(event);
        if (context?.closeOnSelect) context.close();
      }}
      {...props}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <RNText style={[{ color: colors.text }, textStyle]}>{children}</RNText>
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
    <RNText className={className} style={[{ color: colors.text }, style]}>
      {children}
    </RNText>
  );
}
