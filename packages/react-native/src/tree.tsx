import React, { useState, type ReactNode } from "react";
import { Pressable, Text, View, type ViewProps } from "react-native";
import {
  enabledSelectableDescendants,
  flattenTree,
  toggleTreeCheck,
  treeCheckState,
  type TreeModel,
} from "@akin2unde/flowui-core";

type Key = string | number;

export interface TreeProps extends ViewProps {
  nodes: TreeModel[];
  defaultExpanded?: boolean;
  value?: Key;
  showCheckboxes?: boolean;
  checkedValues?: readonly Key[];
  onCheckedValuesChange?: (values: Key[]) => void;
  onSelect?: (node: TreeModel) => void;
  renderIcon?: (icon: string) => ReactNode;
}

export const Tree = ({
  nodes,
  defaultExpanded,
  value,
  showCheckboxes,
  checkedValues,
  onCheckedValuesChange,
  onSelect,
  renderIcon,
  ...props
}: TreeProps) => {
  const [expanded, setExpanded] = useState(
    () =>
      new Set(
        defaultExpanded ? flattenTree(nodes).map((node) => node.value) : [],
      ),
  );
  const [draft, updateDraft] = useState<Key[]>([]);
  const selected = new Set(checkedValues ?? draft);
  const render = (node: TreeModel, depth: number): ReactNode => {
    const branch = Boolean(node.children?.length);
    const open = expanded.has(node.value);
    const checked = treeCheckState(node, selected);
    const disabled =
      node.disabled ||
      node.selectable === false ||
      !enabledSelectableDescendants(node).length;
    return (
      <React.Fragment key={node.value}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            minHeight: 40,
            paddingLeft: depth * 16,
            backgroundColor: node.value === value ? "#eaf2fd" : undefined,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${open ? "Collapse" : "Expand"} ${node.display}`}
            accessibilityState={{ expanded: open, disabled: !branch }}
            disabled={!branch}
            style={{ width: 24, alignItems: "center" }}
            onPress={() =>
              setExpanded((current) => {
                const next = new Set(current);
                if (next.has(node.value)) next.delete(node.value);
                else next.add(node.value);
                return next;
              })
            }
          >
            <Text>{branch ? (open ? "⌄" : "›") : ""}</Text>
          </Pressable>
          {showCheckboxes && (
            <Pressable
              accessibilityRole="checkbox"
              accessibilityLabel={String(node.display)}
              accessibilityState={{ checked, disabled }}
              disabled={disabled}
              hitSlop={8}
              style={{
                width: 20,
                height: 20,
                borderWidth: 1,
                borderColor: "#64748b",
                borderRadius: 4,
                backgroundColor: checked ? "#2563eb" : "white",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                const next = toggleTreeCheck(node, [...selected]);
                if (checkedValues === undefined) updateDraft(next);
                onCheckedValuesChange?.(next);
              }}
            >
              <Text style={{ color: "white" }}>
                {checked === "mixed" ? "−" : checked ? "✓" : ""}
              </Text>
            </Pressable>
          )}
          {node.icon && (renderIcon?.(node.icon) ?? <Text>{node.icon}</Text>)}
          <Pressable
            accessibilityRole="button"
            disabled={node.disabled}
            onPress={() => onSelect?.(node)}
          >
            <Text>{node.display}</Text>
          </Pressable>
        </View>
        {open && node.children?.map((child) => render(child, depth + 1))}
      </React.Fragment>
    );
  };
  return <View {...props}>{nodes.map((node) => render(node, 0))}</View>;
};
