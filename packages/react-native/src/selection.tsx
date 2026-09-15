import React, { useMemo, useState, type ReactNode } from "react";
import {
  FlatList,
  Modal,
  type GestureResponderEvent,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { Chip } from "./actions";
import { Checkbox, SearchInput } from "./forms";
import { Pressable, Text as RNText, View } from "./nativewind";
import { Text, VStack } from "./primitives";
import { useFlowUITheme } from "./theme";
import type { SelectOption } from "./types";

export interface SelectProps<T = unknown> {
  /** Style for the header area inside the dropdown menu. */
  menuHeaderStyle?: StyleProp<ViewStyle>;
  /** Style for the dropdown heading. */
  menuTitleStyle?: StyleProp<TextStyle>;
  /** Style for the dropdown close icon. */
  closeIconStyle?: StyleProp<TextStyle>;
  chevron?: ReactNode;
  items: SelectOption<T>[];
  value?: string | number;
  onValueChange?: (value: string | number, item: SelectOption<T>) => void;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  renderItem?: (item: SelectOption<T>, selected: boolean) => ReactNode;
  /** Style for the closed select control. Applied after theme defaults. */
  style?: StyleProp<ViewStyle>;
  /** Style for the selected value or placeholder. */
  textStyle?: StyleProp<TextStyle>;
  /** Style for the chevron text. */
  chevronStyle?: StyleProp<TextStyle>;
  /** Style for the modal backdrop. */
  overlayStyle?: StyleProp<ViewStyle>;
  /** Style for the dropdown/modal surface. */
  menuStyle?: StyleProp<ViewStyle>;
  /** Style for each option row. */
  optionStyle?: StyleProp<ViewStyle>;
  /** Style for default option text. */
  optionTextStyle?: StyleProp<TextStyle>;
  /** Style added to a selected option row. */
  selectedOptionStyle?: StyleProp<ViewStyle>;
  /** Style added to selected option text. */
  selectedOptionTextStyle?: StyleProp<TextStyle>;
  /** Style for the search input shown inside the menu. */
  searchInputStyle?: StyleProp<TextStyle>;
}

function PickerModal<T>({
  visible,
  items,
  selectedValues,
  searchable,
  searchPlaceholder,
  multiple,
  renderItem,
  onSelect,
  onClose,
  overlayStyle,
  menuStyle,
  optionStyle,
  optionTextStyle,
  selectedOptionStyle,
  selectedOptionTextStyle,
  searchInputStyle,
  menuHeaderStyle,
  menuTitleStyle,
  closeIconStyle,
}: {
  visible: boolean;
  items: SelectOption<T>[];
  selectedValues: Set<string | number>;
  searchable?: boolean;
  searchPlaceholder?: string;
  multiple?: boolean;
  renderItem?: (item: SelectOption<T>, selected: boolean) => ReactNode;
  onSelect: (item: SelectOption<T>) => void;
  onClose: () => void;
  overlayStyle?: StyleProp<ViewStyle>;
  menuStyle?: StyleProp<ViewStyle>;
  optionStyle?: StyleProp<ViewStyle>;
  optionTextStyle?: StyleProp<TextStyle>;
  selectedOptionStyle?: StyleProp<ViewStyle>;
  selectedOptionTextStyle?: StyleProp<TextStyle>;
  searchInputStyle?: StyleProp<TextStyle>;
  menuHeaderStyle?: StyleProp<ViewStyle>;
  menuTitleStyle?: StyleProp<TextStyle>;
  closeIconStyle?: StyleProp<TextStyle>;
}) {
  const [query, setQuery] = useState("");
  const { colors, theme } = useFlowUITheme();
  const filtered = useMemo(
    () =>
      items.filter((item) =>
        String(item.display).toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [items, query],
  );
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        accessibilityLabel="Close options"
        className="flex-1 justify-end bg-black/50 p-4 sm:justify-center"
        style={overlayStyle}
        onPress={onClose}
      >
        <Pressable
          className="max-h-[75%] w-full self-center overflow-hidden sm:max-w-xl"
          style={[
            {
              borderRadius: theme.radius.xl,
              backgroundColor: colors.surface,
            },
            menuStyle,
          ]}
          onPress={(event: GestureResponderEvent) => event.stopPropagation()}
        >
          <View
            className="flex-row items-center justify-between border-b p-4"
            style={[{ borderColor: colors.border }, menuHeaderStyle]}
          >
            <Text
              className="text-lg font-bold"
              style={[{ color: colors.text }, menuTitleStyle]}
            >
              Select option
            </Text>

            <Pressable
              accessibilityLabel="Close"
              hitSlop={10}
              onPress={onClose}
            >
              <RNText
                style={[
                  {
                    color: colors.text,
                    fontSize: 24,
                    lineHeight: 26,
                  },
                  closeIconStyle,
                ]}
              >
                ×
              </RNText>
            </Pressable>
          </View>
          {searchable ? (
            <View className="p-3">
              <SearchInput
                value={query}
                onChangeText={setQuery}
                placeholder={searchPlaceholder ?? "Search..."}
                style={searchInputStyle}
              />
            </View>
          ) : null}
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.value)}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <Text muted className="p-5 text-center">
                No options found
              </Text>
            }
            renderItem={({ item }) => {
              const selected = selectedValues.has(item.value);
              return (
                <Pressable
                  accessibilityRole={multiple ? "checkbox" : "radio"}
                  accessibilityState={{
                    checked: selected,
                    disabled: item.disabled,
                  }}
                  disabled={item.disabled}
                  onPress={() => onSelect(item)}
                  className="flex-row items-center gap-3 px-4 py-3"
                  style={[
                    {
                      backgroundColor: selected
                        ? `${colors.primary}18`
                        : "transparent",
                      opacity: item.disabled ? 0.45 : 1,
                    },
                    optionStyle,
                    selected ? selectedOptionStyle : undefined,
                  ]}
                >
                  {multiple ? <Checkbox checked={selected} /> : null}
                  <View className="flex-1">
                    {renderItem ? (
                      renderItem(item, selected)
                    ) : (
                      <Text
                        style={[
                          optionTextStyle,
                          selected ? selectedOptionTextStyle : undefined,
                        ]}
                      >
                        {item.display}
                      </Text>
                    )}
                    {item.group ? (
                      <Text muted className="text-xs">
                        {item.group}
                      </Text>
                    ) : null}
                  </View>
                  {!multiple && selected ? (
                    <Text style={{ color: colors.primary }}>✓</Text>
                  ) : null}
                </Pressable>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function Select<T>({
  items,
  value,
  onValueChange,
  placeholder = "Select...",
  searchable,
  searchPlaceholder,
  disabled,
  className,
  renderItem,
  style,
  textStyle,
  chevronStyle,
  overlayStyle,
  menuStyle,
  optionStyle,
  optionTextStyle,
  selectedOptionStyle,
  selectedOptionTextStyle,
  searchInputStyle,
  chevron,
  menuHeaderStyle,
  menuTitleStyle,
  closeIconStyle,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const { colors, theme } = useFlowUITheme();
  const selected = items.find((item) => item.value === value);
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: open }}
        disabled={disabled}
        onPress={() => setOpen(true)}
        className={`min-h-12 flex-row items-center justify-between border px-3 ${className ?? ""}`}
        style={[
          {
            borderColor: colors.border,
            borderRadius: theme.components.controlRadius,
            backgroundColor: colors.surface,
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}
      >
        <Text muted={!selected} style={textStyle}>
          {selected?.display ?? placeholder}
        </Text>
        {chevron ?? (
          <Text
            style={[
              {
                color: colors.textMuted,
                fontSize: 22,
                lineHeight: 22,
                transform: [{ translateY: -2 }],
              },
              chevronStyle,
            ]}
          >
            ⌄
          </Text>
        )}
      </Pressable>
      <PickerModal
        visible={open}
        items={items}
        selectedValues={new Set(value === undefined ? [] : [value])}
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
        renderItem={renderItem}
        overlayStyle={overlayStyle}
        menuStyle={menuStyle}
        optionStyle={optionStyle}
        optionTextStyle={optionTextStyle}
        selectedOptionStyle={selectedOptionStyle}
        selectedOptionTextStyle={selectedOptionTextStyle}
        searchInputStyle={searchInputStyle}
        menuHeaderStyle={menuHeaderStyle}
        menuTitleStyle={menuTitleStyle}
        closeIconStyle={closeIconStyle}
        onClose={() => setOpen(false)}
        onSelect={(item) => {
          onValueChange?.(item.value, item);
          setOpen(false);
        }}
      />
    </>
  );
}

export interface MultiSelectProps<T = unknown> extends Omit<
  SelectProps<T>,
  "value" | "onValueChange"
> {
  value: Array<string | number>;
  onValueChange?: (
    values: Array<string | number>,
    items: SelectOption<T>[],
  ) => void;
}

export function MultiSelect<T>({
  items,
  value,
  onValueChange,
  placeholder = "Select...",
  searchable,
  searchPlaceholder,
  disabled,
  className,
  renderItem,
  style,
  textStyle,
  overlayStyle,
  menuStyle,
  optionStyle,
  optionTextStyle,
  selectedOptionStyle,
  selectedOptionTextStyle,
  searchInputStyle,
  menuHeaderStyle,
  menuTitleStyle,
  closeIconStyle,
}: MultiSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const { colors, theme } = useFlowUITheme();
  const selectedItems = items.filter((item) => value.includes(item.value));
  const update = (next: Array<string | number>) =>
    onValueChange?.(
      next,
      items.filter((item) => next.includes(item.value)),
    );
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: open }}
        disabled={disabled}
        onPress={() => setOpen(true)}
        className={`min-h-12 flex-row flex-wrap items-center gap-2 border p-2 ${className ?? ""}`}
        style={[
          {
            borderColor: colors.border,
            borderRadius: theme.components.controlRadius,
            backgroundColor: colors.surface,
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}
      >
        {selectedItems.length === 0 ? (
          <Text muted style={textStyle}>
            {placeholder}
          </Text>
        ) : null}
        {selectedItems.map((item) => (
          <Chip
            key={String(item.value)}
            selected
            onRemove={() =>
              update(value.filter((current) => current !== item.value))
            }
            removeLabel={`Remove ${item.display}`}
          >
            {item.display}
          </Chip>
        ))}
      </Pressable>
      <PickerModal
        visible={open}
        items={items}
        selectedValues={new Set(value)}
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
        multiple
        renderItem={renderItem}
        overlayStyle={overlayStyle}
        menuStyle={menuStyle}
        optionStyle={optionStyle}
        optionTextStyle={optionTextStyle}
        selectedOptionStyle={selectedOptionStyle}
        selectedOptionTextStyle={selectedOptionTextStyle}
        searchInputStyle={searchInputStyle}
        menuHeaderStyle={menuHeaderStyle}
        menuTitleStyle={menuTitleStyle}
        closeIconStyle={closeIconStyle}
        onClose={() => setOpen(false)}
        onSelect={(item) =>
          update(
            value.includes(item.value)
              ? value.filter((current) => current !== item.value)
              : [...value, item.value],
          )
        }
      />
    </>
  );
}

export interface RatingProps {
  value: number;
  onValueChange?: (value: number) => void;
  maximum?: number;
  disabled?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<TextStyle>;
}

export function Rating({
  value,
  onValueChange,
  maximum = 5,
  disabled,
  className,
  style,
  iconStyle,
}: RatingProps) {
  const { colors } = useFlowUITheme();
  return (
    <View className={`flex-row gap-1 ${className ?? ""}`} style={style}>
      {Array.from({ length: maximum }, (_, index) => index + 1).map(
        (rating) => (
          <Pressable
            key={rating}
            accessibilityRole="button"
            accessibilityLabel={`${rating} stars`}
            disabled={disabled}
            onPress={() => onValueChange?.(rating)}
            hitSlop={5}
          >
            <RNText
              style={[
                {
                  color: rating <= value ? colors.warning : colors.border,
                  fontSize: 30,
                },
                iconStyle,
              ]}
            >
              ★
            </RNText>
          </Pressable>
        ),
      )}
    </View>
  );
}
