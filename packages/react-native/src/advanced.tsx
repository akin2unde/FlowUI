import React, { useRef, useState, type ReactNode } from "react";
import {
  Linking,
  Modal,
  Platform,
  Share,
  useWindowDimensions,
  type LayoutChangeEvent,
  type View as NativeView,
} from "react-native";
import {
  formatLocalDateTime,
  resolveTooltipLocation,
  tableToCsv,
  type DateTimeMode,
  type FieldFocusStyle,
  type TableColumn,
  type TableLoadMoreContext,
  type TabSelectedStyle,
  type TooltipLocation,
} from "@akin2unde/flowui-core";
import { Input } from "./forms";
import { Pressable, View } from "./nativewind";
import { Text } from "./primitives";
import { MultiSelect } from "./selection";
import { useFlowUITheme } from "./theme";

function Action({
  children,
  label,
  onPress,
  disabled,
}: {
  children: ReactNode;
  label?: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={{ padding: 7, opacity: disabled ? 0.45 : 1 }}
    >
      {typeof children === "string" ? <Text>{children}</Text> : children}
    </Pressable>
  );
}

export function Tooltip({
  children,
  text,
  location = "top",
  delay = 150,
}: {
  children: ReactNode;
  text: string;
  location?: TooltipLocation;
  delay?: number;
}) {
  const { colors } = useFlowUITheme();
  const viewport = useWindowDimensions();
  const anchor = useRef<NativeView>(null);
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState(location);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const vertical = placement === "top" || placement === "bottom";
  const hide = () => {
    clearTimeout(timer.current);
    setVisible(false);
  };
  const show = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setPlacement(location);
      setVisible(true);
    }, delay);
  };
  React.useEffect(() => () => clearTimeout(timer.current), []);
  React.useEffect(() => {
    if (!visible || !size.height) return;
    anchor.current?.measureInWindow((x, y, width, height) =>
      setPlacement(
        resolveTooltipLocation(
          location,
          {
            top: y,
            left: x,
            right: x + width,
            bottom: y + height,
          },
          size,
          viewport,
        ),
      ),
    );
  }, [visible, location, size, viewport.width, viewport.height]);
  return (
    <Pressable
      ref={anchor}
      style={{ alignSelf: "flex-start", zIndex: visible ? 10 : undefined }}
      accessibilityHint={text}
      onHoverIn={show}
      onHoverOut={hide}
      onFocus={show}
      onBlur={hide}
      onLongPress={() => (visible ? hide() : show())}
    >
      {children}
      {visible && (
        <View
          pointerEvents="none"
          onLayout={({ nativeEvent }: LayoutChangeEvent) =>
            setSize(nativeEvent.layout)
          }
          style={{
            position: "absolute",
            maxWidth: 240,
            width: 180,
            alignItems:
              placement === "left"
                ? "flex-end"
                : placement === "right"
                  ? "flex-start"
                  : "center",
            opacity: size.height ? 1 : 0,
            ...(vertical
              ? {
                  left: "50%" as const,
                  transform: [{ translateX: -size.width / 2 }],
                }
              : {
                  top: "50%" as const,
                  transform: [{ translateY: -size.height / 2 }],
                }),
            ...(placement === "top"
              ? { bottom: "100%" as const, marginBottom: 6 }
              : placement === "bottom"
                ? { top: "100%" as const, marginTop: 6 }
                : placement === "left"
                  ? { right: "100%" as const, marginRight: 6 }
                  : { left: "100%" as const, marginLeft: 6 }),
          }}
        >
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 5,
              backgroundColor: colors.text,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: colors.surface }}>{text}</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const dayKey = (date: Date) => formatLocalDateTime(date, "date");
const pad = (value: number) => String(value).padStart(2, "0");

export function DateTime({
  value = "",
  mode = "datetime",
  onChange,
  min,
  max,
  disabled,
  showDayBoundaryButtons = true,
}: {
  value?: string;
  mode?: DateTimeMode;
  onChange?: (value: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  showDayBoundaryButtons?: boolean;
}) {
  const { colors } = useFlowUITheme();
  const window = useWindowDimensions();
  const root = useRef<NativeView>(null);
  const [picker, setPicker] = useState<"date" | "time" | null>(null);
  const [anchor, setAnchor] = useState({ x: 0, y: 0, height: 0 });
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const [month, setMonth] = useState(new Date());
  const [hour, setHour] = useState("00"),
    [minute, setMinute] = useState("00");
  const selectedDate = mode === "time" ? "" : value.split("T")[0];
  const selectedTime =
    (mode === "time" ? value : value.split("T")[1]) || "00:00";
  const active =
    disabled ||
    (mode === "date" && picker === "time") ||
    (mode === "time" && picker === "date")
      ? null
      : picker;
  const allowed = (next: string) =>
    (!min || next >= min) && (!max || next <= max);
  const timeValue = (time: string) =>
    mode === "time" ? time : `${selectedDate || dayKey(new Date())}T${time}`;
  const dateValue = (date: Date) =>
    mode === "date" ? dayKey(date) : `${dayKey(date)}T${selectedTime}`;
  const chooseDate = (date: Date) => {
    const next = dateValue(date);
    if (allowed(next)) {
      onChange?.(next);
      setPicker(null);
    }
  };
  const chooseTime = (time: string) => {
    if (allowed(timeValue(time))) onChange?.(timeValue(time));
  };
  function open(next: "date" | "time") {
    if (next === "date") {
      const current = selectedDate
        ? new Date(`${selectedDate}T12:00`)
        : new Date();
      setMonth(new Date(current.getFullYear(), current.getMonth(), 1));
    } else {
      setHour(selectedTime.slice(0, 2));
      setMinute(selectedTime.slice(3, 5));
    }
    root.current?.measureInWindow((x, y, _width, height) => {
      setAnchor({ x, y, height });
      setMeasuredHeight(0);
      setPicker(next);
    });
  }
  const width = Math.min(active === "time" ? 224 : 270, window.width - 16);
  const monthLength = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const validTime =
    /^\d{1,2}$/.test(hour) &&
    Number(hour) < 24 &&
    /^\d{1,2}$/.test(minute) &&
    Number(minute) < 60;
  const draft = `${pad(Number(hour))}:${pad(Number(minute))}`;
  const panelHeight = measuredHeight || (active === "time" ? 110 : 310);
  return (
    <>
      <View
        ref={root}
        collapsable={false}
        style={{
          alignSelf: "flex-start",
          flexDirection: "row",
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
        }}
      >
        {mode !== "time" && (
          <Action
            label="Choose date"
            disabled={disabled}
            onPress={() => open("date")}
          >{`▦  ${selectedDate || "Select date"}`}</Action>
        )}
        {mode !== "date" && (
          <Action
            label="Choose time"
            disabled={disabled}
            onPress={() => open("time")}
          >{`◷  ${value ? selectedTime.slice(0, 5) : "Select time"}`}</Action>
        )}
      </View>
      <Modal
        visible={active !== null}
        transparent
        statusBarTranslucent
        animationType="none"
        onRequestClose={() => setPicker(null)}
      >
        <Pressable
          accessibilityLabel="Dismiss date and time picker"
          onPress={() => setPicker(null)}
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
        />
        <View
          accessibilityViewIsModal
          onLayout={(event: LayoutChangeEvent) =>
            setMeasuredHeight(event.nativeEvent.layout.height)
          }
          style={{
            position: "absolute",
            width,
            left: Math.max(8, Math.min(anchor.x, window.width - width - 8)),
            top:
              anchor.y + anchor.height + panelHeight + 8 <= window.height
                ? anchor.y + anchor.height + 4
                : Math.max(8, anchor.y - panelHeight - 4),
            padding: 8,
            borderRadius: 9,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surfaceRaised,
          }}
        >
          {active === "date" ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Action
                  label="Previous month"
                  onPress={() =>
                    setMonth(
                      new Date(month.getFullYear(), month.getMonth() - 1, 1),
                    )
                  }
                >
                  ‹
                </Action>
                <Text>
                  {month.toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
                <Action
                  label="Next month"
                  onPress={() =>
                    setMonth(
                      new Date(month.getFullYear(), month.getMonth() + 1, 1),
                    )
                  }
                >
                  ›
                </Action>
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <View
                    key={day}
                    style={{ width: "14.28%", alignItems: "center" }}
                  >
                    <Text muted>{day}</Text>
                  </View>
                ))}
                {Array.from({ length: firstDay + monthLength }, (_, index) => {
                  const day = index - firstDay + 1;
                  const date = new Date(
                    month.getFullYear(),
                    month.getMonth(),
                    day,
                  );
                  return (
                    <View
                      key={index}
                      style={{
                        width: "14.28%",
                        alignItems: "center",
                        borderRadius: 8,
                        backgroundColor:
                          day > 0 && dayKey(date) === selectedDate
                            ? colors.canvas
                            : undefined,
                      }}
                    >
                      {day > 0 && (
                        <Action
                          label={date.toDateString()}
                          disabled={!allowed(dateValue(date))}
                          onPress={() => chooseDate(date)}
                        >
                          {String(day)}
                        </Action>
                      )}
                    </View>
                  );
                })}
              </View>
            </>
          ) : (
            <View
              style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
            >
              <Input
                accessibilityLabel="Hour"
                value={hour}
                onChangeText={setHour}
                keyboardType="number-pad"
                maxLength={2}
                style={{ width: 58 }}
              />
              <Text>:</Text>
              <Input
                accessibilityLabel="Minute"
                value={minute}
                onChangeText={setMinute}
                keyboardType="number-pad"
                maxLength={2}
                style={{ width: 58 }}
              />
              <Action
                disabled={!validTime || !allowed(timeValue(draft))}
                onPress={() => {
                  chooseTime(draft);
                  setPicker(null);
                }}
              >
                Done
              </Action>
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              gap: 4,
              marginTop: 4,
              borderTopWidth: 1,
              borderColor: colors.border,
            }}
          >
            {mode !== "time" && (
              <Action
                label="Today"
                disabled={!allowed(dateValue(new Date()))}
                onPress={() => chooseDate(new Date())}
              >
                Today
              </Action>
            )}
            {mode !== "date" && showDayBoundaryButtons && (
              <>
                <Action
                  label="Start of day"
                  disabled={!allowed(timeValue("00:00"))}
                  onPress={() => {
                    chooseTime("00:00");
                    setHour("00");
                    setMinute("00");
                  }}
                >
                  ☀
                </Action>
                <Action
                  label="End of day"
                  disabled={!allowed(timeValue("23:59"))}
                  onPress={() => {
                    chooseTime("23:59");
                    setHour("23");
                    setMinute("59");
                  }}
                >
                  ☾
                </Action>
              </>
            )}
            <Action label="Close picker" onPress={() => setPicker(null)}>
              ×
            </Action>
          </View>
        </View>
      </Modal>
    </>
  );
}

export interface NativeTab {
  id: string;
  label: string;
  icon?: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
}
export function Tabs({
  tabs,
  value,
  defaultValue,
  onChange,
  selectedStyle = "underline",
}: {
  tabs: NativeTab[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  selectedStyle?: TabSelectedStyle;
}) {
  const { colors } = useFlowUITheme();
  const [internal, setInternal] = useState(defaultValue);
  const active =
    tabs.find((tab) => !tab.disabled && tab.id === (value ?? internal)) ??
    tabs.find((tab) => !tab.disabled);
  return (
    <View>
      <View
        accessibilityRole="tablist"
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 4,
          borderBottomWidth: 1,
          borderColor: colors.border,
        }}
      >
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            accessibilityRole="tab"
            accessibilityState={{
              selected: tab === active,
              disabled: tab.disabled,
            }}
            disabled={tab.disabled}
            onPress={() => {
              if (value === undefined) setInternal(tab.id);
              onChange?.(tab.id);
            }}
            style={{
              padding: 8,
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              borderBottomWidth: 2,
              borderBottomColor:
                tab === active && selectedStyle === "underline"
                  ? colors.primary
                  : "transparent",
              backgroundColor:
                tab === active && selectedStyle === "fill"
                  ? colors.canvas
                  : undefined,
            }}
          >
            {tab.icon}
            <Text>{tab.label}</Text>
          </Pressable>
        ))}
      </View>
      {active?.content}
    </View>
  );
}

export function Breadcrumb({
  items,
  separator = ">",
  onSelect,
}: {
  items: { id: string | number; text: string; href?: string }[];
  separator?: string;
  onSelect?: (id: string | number) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 4,
      }}
    >
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 && (
            <Text accessibilityElementsHidden importantForAccessibility="no">
              {separator}
            </Text>
          )}
          {index === items.length - 1 || (!onSelect && !item.href) ? (
            <Text>{item.text}</Text>
          ) : (
            <Action
              label={item.text}
              onPress={() => {
                if (onSelect) onSelect(item.id);
                else if (item.href) void Linking.openURL(item.href);
              }}
            >
              {item.text}
            </Action>
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

export function Table<T>({
  data,
  columns,
  columnsConfigurable = false,
  exportable = false,
  onExport,
  totalCount,
  hasMore = totalCount !== undefined && data.length < totalCount,
  loadingMore = false,
  onLoadMore,
  renderLoadMore,
}: {
  data: T[];
  columns: TableColumn<T>[];
  columnsConfigurable?: boolean;
  exportable?: boolean;
  onExport?: (csv: string) => void;
  totalCount?: number;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
  renderLoadMore?: (context: TableLoadMoreContext) => ReactNode;
}) {
  const { colors } = useFlowUITheme();
  const [fields, setFields] = useState<string[]>();
  const visible = columns.filter((column) =>
    fields ? fields.includes(column.field) : column.defaultVisible !== false,
  );
  const loadMore = () => {
    if (hasMore && !loadingMore) onLoadMore?.();
  };
  const context = {
    loadedCount: data.length,
    totalCount,
    hasMore,
    loading: loadingMore,
    loadMore,
  };
  function exportCsv() {
    const csv = tableToCsv(data, visible);
    if (onExport) {
      onExport(csv);
      return;
    }
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const url = URL.createObjectURL(
        new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "table.csv";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } else void Share.share({ message: csv });
  }
  return (
    <View style={{ gap: 4 }}>
      {columnsConfigurable && (
        <MultiSelect
          placeholder="Columns"
          maxVisibleChips={0}
          items={columns.map((column) => ({
            display: column.header,
            value: column.field,
          }))}
          value={visible.map((column) => column.field)}
          onValueChange={(next) => setFields(next.map(String))}
        />
      )}
      {exportable && <Action onPress={exportCsv}>Export CSV</Action>}
      <View style={{ flexDirection: "row", backgroundColor: colors.canvas }}>
        {visible.map((column) => (
          <View key={column.field} style={{ flex: 1, padding: 6 }}>
            <Text>{column.header}</Text>
          </View>
        ))}
      </View>
      {data.map((row, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            borderBottomWidth: 1,
            borderColor: colors.border,
          }}
        >
          {visible.map((column) => (
            <View key={column.field} style={{ flex: 1, padding: 6 }}>
              <Text>
                {String(
                  column.format
                    ? column.format(row[column.field], row)
                    : (row[column.field] ?? ""),
                )}
              </Text>
            </View>
          ))}
        </View>
      ))}
      {renderLoadMore
        ? renderLoadMore(context)
        : onLoadMore && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text accessibilityLiveRegion="polite">
                {data.length}
                {totalCount !== undefined ? ` of ${totalCount}` : ""} records
                loaded
              </Text>
              {hasMore && (
                <Action disabled={loadingMore} onPress={loadMore}>
                  {loadingMore ? "Loading…" : "Load more"}
                </Action>
              )}
            </View>
          )}
    </View>
  );
}

export function Autocomplete({
  items,
  value,
  onChangeText,
  onSelect,
  placeholder,
  minCharacters = 1,
  disabled,
  focusStyle,
}: {
  items: string[];
  value: string;
  onChangeText: (value: string) => void;
  onSelect?: (value: string) => void;
  placeholder?: string;
  minCharacters?: number;
  disabled?: boolean;
  focusStyle?: FieldFocusStyle;
}) {
  const { colors, theme } = useFlowUITheme();
  const [focused, setFocused] = useState(false);
  const appearance = focusStyle ?? theme.focusStyle ?? "border";
  const showRing = focused && appearance === "ring";
  const [open, setOpen] = useState(false);
  const [browse, setBrowse] = useState(false);
  const matches = items.filter(
    (item) => browse || item.toLowerCase().includes(value.toLowerCase()),
  );
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor:
            focused && appearance !== "none" ? colors.textMuted : colors.border,
          shadowColor: showRing ? colors.primary : undefined,
          shadowOpacity: showRing ? 0.22 : undefined,
          shadowRadius: showRing ? 2 : undefined,
          borderRadius: 8,
        }}
      >
        <Input
          value={value}
          placeholder={placeholder}
          editable={!disabled}
          style={{ flex: 1, borderWidth: 0 }}
          onChangeText={(text) => {
            onChangeText(text);
            setBrowse(false);
            setOpen(true);
          }}
          focusStyle="none"
          onFocus={() => {
            setFocused(true);
            setOpen(true);
          }}
          onBlur={() => setFocused(false)}
        />
        <Action
          label="Toggle suggestions"
          disabled={disabled}
          onPress={() => {
            setOpen(!open);
            setBrowse(!open);
          }}
        >
          {open ? "⌃" : "⌄"}
        </Action>
      </View>
      {open && !disabled && (browse || value.length >= minCharacters) && (
        <View style={{ backgroundColor: colors.surfaceRaised }}>
          {matches.map((item) => (
            <Action
              key={item}
              onPress={() => {
                onChangeText(item);
                onSelect?.(item);
                setOpen(false);
              }}
            >
              {item}
            </Action>
          ))}
          {matches.length === 0 && <Text muted>No matches</Text>}
        </View>
      )}
    </View>
  );
}
