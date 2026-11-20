import React, { useState, type ReactNode } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ViewProps,
} from "react-native";
import type {
  FlowAction,
  FlowIconStyle,
  FlowStage,
  WorkflowStepperProps as CoreProps,
} from "@akin2unde/flowui-core";

export interface WorkflowStepperProps
  extends
    Omit<CoreProps, keyof import("@akin2unde/flowui-core").BaseUIProps>,
    ViewProps {
  onStageClick?: (stage: FlowStage) => void;
  onActionChange?: (stage: FlowStage, action: FlowAction) => void;
  renderIcon?: (icon: string, style?: FlowIconStyle) => ReactNode;
}

export const WorkflowStepper = ({
  stages,
  direction = "horizontal",
  labelPosition = "below",
  lineColor = "#b98216",
  stageTextStyle,
  completedStyle,
  currentStyle,
  disabledStyle,
  actionMenuStyle,
  actionItemStyle,
  checkmarkStyle,
  chevronStyle,
  onStageClick,
  onActionChange,
  renderIcon,
  style,
  ...props
}: WorkflowStepperProps) => {
  const window = useWindowDimensions();
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });
  const [openId, open] = useState<string>();
  const [selections, setSelections] = useState<Record<string, FlowAction>>({});
  const current = stages.find(
    (stage) => stage.Id === openId && stage.IsCurrent && !stage.IsDisabled,
  );
  const selected = (stage: FlowStage) =>
    stage.SelectedAction ?? selections[stage.Id];
  const horizontal = direction === "horizontal";
  const icon = (name: string, appearance?: FlowIconStyle) =>
    renderIcon?.(name, appearance) ?? (
      <Text style={{ color: appearance?.color, fontSize: appearance?.size }}>
        {name}
      </Text>
    );

  return (
    <View {...props} style={[{ minWidth: 0, maxWidth: "100%" }, style]}>
      <ScrollView
        horizontal={horizontal}
        contentContainerStyle={{
          flexDirection: horizontal ? "row" : "column",
          flexGrow: 1,
        }}
      >
        {stages.map((stage, index) => {
          const style = {
            ...(stage.IsCurrent
              ? currentStyle
              : stage.IsCompleted
                ? completedStyle
                : undefined),
            ...(stage.IsDisabled ? disabledStyle : undefined),
          };
          const canPick =
            stage.IsCurrent &&
            !stage.IsDisabled &&
            (stage.Actions?.length ?? 0) > 1;
          const action = stage.Actions?.find(
            (item) => item.Label === selected(stage)?.Label,
          );
          const title = stage.IsCurrent
            ? (action?.Label ?? stage.Label)
            : stage.Label;
          const note = (
            <Text
              style={[
                {
                  color: stage.IsDisabled ? "#64748b" : "#1e293b",
                  textAlign: horizontal ? "center" : "left",
                },
                stageTextStyle,
                style.textStyle,
                stage.TextStyle,
              ]}
            >
              {title}
            </Text>
          );
          return (
            <View
              key={stage.Id}
              style={{
                minWidth: horizontal ? 145 : 0,
                flexGrow: 1,
                alignItems: horizontal ? "center" : "flex-start",
                paddingBottom: 8,
              }}
            >
              {index < stages.length - 1 && (
                <View
                  style={{
                    position: "absolute",
                    backgroundColor: lineColor,
                    ...(horizontal
                      ? {
                          top: labelPosition === "above" ? 36 : 17,
                          left: "50%",
                          width: "100%",
                          height: 2,
                        }
                      : { top: 17, left: 17, width: 2, height: "100%" }),
                  }}
                />
              )}
              {!stage.IsCurrent &&
                horizontal &&
                labelPosition === "above" &&
                note}
              <View
                style={
                  stage.IsCurrent
                    ? {
                        flexDirection: "row",
                        borderWidth: 1,
                        borderColor: stage.IsDisabled ? "#cbd5e1" : "#e5b857",
                        borderRadius: 6,
                        backgroundColor:
                          style.backgroundColor ??
                          (stage.IsDisabled ? "#edf0f3" : "#fff0ca"),
                        maxWidth: 260,
                      }
                    : undefined
                }
              >
                <Pressable
                  accessibilityRole={onStageClick ? "button" : undefined}
                  accessibilityState={{
                    disabled: stage.IsDisabled,
                    selected: stage.IsCurrent,
                  }}
                  accessibilityLabel={title}
                  disabled={stage.IsDisabled || !onStageClick}
                  onPress={() => onStageClick?.(stage)}
                  style={{
                    flexDirection:
                      stage.IsCurrent ||
                      !horizontal ||
                      labelPosition === "beside"
                        ? "row"
                        : "column",
                    alignItems: "center",
                    gap: 6,
                    paddingHorizontal: stage.IsCurrent ? 8 : 0,
                    paddingVertical: stage.IsCurrent ? 5 : 0,
                  }}
                >
                  {stage.IsCurrent ? (
                    <>
                      {style.icon && icon(style.icon, style.iconStyle)}
                      {note}
                    </>
                  ) : (
                    <>
                      <View
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 17,
                          alignItems: "center",
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor: lineColor,
                          backgroundColor:
                            style.backgroundColor ??
                            (stage.IsCompleted ? lineColor : "white"),
                        }}
                      >
                        {stage.IsCompleted &&
                          icon(style.icon ?? "✓", {
                            color: "white",
                            ...style.iconStyle,
                          })}
                      </View>
                      {(!horizontal || labelPosition !== "above") && note}
                    </>
                  )}
                </Pressable>
                {canPick && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Actions for ${stage.Label}`}
                    accessibilityState={{ expanded: openId === stage.Id }}
                    onPress={(event) => {
                      setAnchor({
                        x: event.nativeEvent.pageX,
                        y: event.nativeEvent.pageY,
                      });
                      open(stage.Id);
                    }}
                    style={{
                      borderLeftWidth: 1,
                      borderColor: "#e5b857",
                      paddingHorizontal: 10,
                      justifyContent: "center",
                    }}
                  >
                    {icon("⌄", chevronStyle)}
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
      {current && (
        <Modal transparent visible onRequestClose={() => open(undefined)}>
          <View style={{ flex: 1 }}>
            <Pressable
              accessibilityLabel="Close actions"
              onPress={() => open(undefined)}
              style={StyleSheet.absoluteFill}
            />
            <View
              accessibilityViewIsModal
              style={{
                position: "absolute",
                width: Math.min(window.width - 16, 260),
                left: Math.max(8, Math.min(anchor.x - 235, window.width - 268)),
                top: Math.max(
                  8,
                  Math.min(
                    anchor.y + 16,
                    window.height - ((current.Actions?.length ?? 0) * 44 + 24),
                  ),
                ),
                backgroundColor: actionMenuStyle?.backgroundColor ?? "white",
                borderColor: actionMenuStyle?.borderColor ?? "#cbd5e1",
                borderWidth: 1,
                borderRadius: actionMenuStyle?.borderRadius ?? 8,
                boxShadow: actionMenuStyle?.boxShadow,
                padding: 4,
              }}
            >
              {current.Actions?.map((action, index) => {
                const active = selected(current)?.Label === action.Label;
                const selectedStyle = active
                  ? actionItemStyle?.selected
                  : undefined;
                const readOnlyStyle = action.IsReadonly
                  ? actionItemStyle?.readonly
                  : undefined;
                return (
                  <Pressable
                    key={index}
                    accessibilityRole="button"
                    disabled={action.IsReadonly}
                    accessibilityState={{
                      selected: active,
                      disabled: action.IsReadonly,
                    }}
                    style={({ pressed }) => ({
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      padding: 10,
                      backgroundColor:
                        (pressed
                          ? actionItemStyle?.hover?.backgroundColor
                          : undefined) ??
                        readOnlyStyle?.backgroundColor ??
                        selectedStyle?.backgroundColor ??
                        actionItemStyle?.backgroundColor ??
                        (active ? "#fff0ca" : "transparent"),
                      opacity: action.IsReadonly ? 0.55 : 1,
                    })}
                    onPress={() => {
                      if (current.SelectedAction === undefined)
                        setSelections((before) => ({
                          ...before,
                          [current.Id]: action,
                        }));
                      open(undefined);
                      onActionChange?.(current, action);
                    }}
                  >
                    {(action.Icon || action.IsReadonly) &&
                      icon(action.Icon ?? "🔒", {
                        ...actionItemStyle?.iconStyle,
                        ...selectedStyle?.iconStyle,
                        ...readOnlyStyle?.iconStyle,
                        ...action.IconStyle,
                      })}
                    <Text
                      style={[
                        { flex: 1 },
                        actionItemStyle?.textStyle,
                        selectedStyle?.textStyle,
                        readOnlyStyle?.textStyle,
                        action.TextStyle,
                      ]}
                    >
                      {action.Label}
                    </Text>
                    {active && icon("✓", checkmarkStyle)}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};
