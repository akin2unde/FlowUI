import {
  useState,
  type CSSProperties,
  type ChangeEventHandler,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import type {
  CardProps as CoreCardProps,
  SliderProps as CoreSliderProps,
  SwitchProps as CoreSwitchProps,
  TooltipProps as CoreTooltipProps,
  TreeModel,
  TreeProps as CoreTreeProps,
} from "@akin2unde/flowui-core";
import { useFlowProps } from "./helpers";
import { Icon } from "./primitives";

export interface CardProps extends PropsWithChildren<CoreCardProps> {
  header?: ReactNode;
  footer?: ReactNode;
}

export function Card({
  children,
  header,
  footer,
  variant = "outline",
  ...props
}: CardProps) {
  const flow = useFlowProps("fui-card", props);

  return (
    <article {...flow} data-variant={variant}>
      {header && <header className="fui-card-header">{header}</header>}
      <div className="fui-card-body">{children}</div>
      {footer && <footer className="fui-card-footer">{footer}</footer>}
    </article>
  );
}

export interface SliderProps extends CoreSliderProps {
  onChange?: (value: number) => void;
  showValue?: boolean;
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value = 0,
  name,
  disabled,
  onChange,
  showValue = true,
  ...props
}: SliderProps) {
  const flow = useFlowProps("fui-slider-wrap", props);

  return (
    <div {...flow}>
      <input
        className="fui-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        name={name}
        disabled={disabled}
        onChange={(event) => onChange?.(Number(event.target.value))}
      />
      {showValue && <output className="fui-slider-value">{value}</output>}
    </div>
  );
}

export interface SwitchProps extends CoreSwitchProps {
  onChange?: (checked: boolean) => void;
}

export function Switch({
  checked = false,
  label,
  name,
  disabled,
  onChange,
  ...props
}: SwitchProps) {
  const flow = useFlowProps("fui-switch-label", props);

  return (
    <label {...flow}>
      <input
        className="fui-switch-input"
        type="checkbox"
        role="switch"
        checked={checked}
        name={name}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
      />
      <span className="fui-switch-track" aria-hidden="true">
        <span className="fui-switch-thumb" />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}

interface TreeNodeProps {
  node: TreeModel;
  value?: string | number;
  expanded: Set<string | number>;
  onToggle: (value: string | number) => void;
  onSelect?: (node: TreeModel) => void;
}

function TreeNode({
  node,
  value,
  expanded,
  onToggle,
  onSelect,
}: TreeNodeProps) {
  const hasChildren = Boolean(node.children?.length);
  const isExpanded = expanded.has(node.value);

  return (
    <li
      className="fui-tree-item"
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
    >
      <div
        className={`fui-tree-row${value === node.value ? " fui-tree-row-selected" : ""}`}
      >
        <button
          className="fui-tree-toggle"
          type="button"
          aria-label={isExpanded ? "Collapse" : "Expand"}
          disabled={!hasChildren}
          onClick={() => hasChildren && onToggle(node.value)}
        >
          {hasChildren && (
            <Icon
              icon={`fa-solid fa-chevron-${isExpanded ? "down" : "right"}`}
            />
          )}
        </button>
        <button
          className="fui-tree-select"
          type="button"
          onClick={() => onSelect?.(node)}
        >
          {node.display}
        </button>
      </div>
      {hasChildren && isExpanded && (
        <ul className="fui-tree-children" role="group">
          {node.children?.map((child) => (
            <TreeNode
              key={child.value}
              node={child}
              value={value}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export interface TreeProps extends Omit<CoreTreeProps, "nodes"> {
  nodes: TreeModel[];
  onSelect?: (node: TreeModel) => void;
}

export function Tree({
  nodes,
  value,
  defaultExpanded = false,
  onSelect,
  ...props
}: TreeProps) {
  const initialValues = defaultExpanded ? nodes.map((node) => node.value) : [];
  const [expanded, setExpanded] = useState<Set<string | number>>(
    new Set(initialValues),
  );
  const flow = useFlowProps("fui-tree fui-tree-view", props);

  const toggle = (nodeValue: string | number) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(nodeValue)) next.delete(nodeValue);
      else next.add(nodeValue);
      return next;
    });
  };

  return (
    <ul {...flow} role="tree">
      {nodes.map((node) => (
        <TreeNode
          key={node.value}
          node={node}
          value={value}
          expanded={expanded}
          onToggle={toggle}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}

export interface TooltipProps extends PropsWithChildren<CoreTooltipProps> {}

export function Tooltip({
  children,
  text,
  location = "top",
  delay = 150,
  ...props
}: TooltipProps) {
  const flow = useFlowProps("fui-tooltip", props);
  const tooltipStyle = {
    ...flow.style,
    "--fui-tooltip-delay": `${delay}ms`,
  } as CSSProperties;

  return (
    <span {...flow} style={tooltipStyle} data-location={location}>
      {children}
      <span className="fui-tooltip-content" role="tooltip">
        {text}
      </span>
    </span>
  );
}
