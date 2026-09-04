import {
  Children,
  isValidElement,
  useState,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
} from "react";
import type {
  BaseUIProps,
  DropdownModel,
  MenuItem,
  SelectOption,
  TabItem,
  TreeModel,
} from "@akin2unde/flowui-core";
import { useFlowProps } from "./helpers";
import { Badge, Icon } from "./primitives";

export interface MenuProps extends BaseUIProps {
  items: MenuItem[];
  onSelect?: (item: MenuItem) => void;
}
export function Menu({ items, onSelect, ...props }: MenuProps) {
  const flow = useFlowProps("fui-menu", props);
  return (
    <div {...flow} role="menu">
      {items.map((item) =>
        item.separator ? (
          <div key={item.id} className="fui-menu-separator" />
        ) : (
          <button
            key={item.id}
            className="fui-menu-item"
            role="menuitem"
            disabled={item.disabled}
            onClick={() => onSelect?.(item)}
          >
            {item.icon && <Icon icon={item.icon} />}
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge !== undefined && <Badge>{item.badge}</Badge>}
          </button>
        ),
      )}
    </div>
  );
}

export interface DropdownProps extends BaseUIProps {
  value?: string | number;
  options: DropdownModel[];
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  grouped?: boolean;
  searchPlaceholder?: string;
  emptyText?: string;
  loading?: boolean;
  hasMore?: boolean;
  loadMoreText?: string;
  renderOption?: (model: DropdownModel, selected: boolean) => ReactNode;
  renderValue?: (model: DropdownModel) => ReactNode;
  onSearchChange?: (query: string) => void;
  onLoadMore?: () => void;
  onChange?: (model: DropdownModel) => void;
}

export function Dropdown({
  value,
  options,
  placeholder = "Select an option",
  disabled,
  searchable = false,
  grouped = false,
  searchPlaceholder = "Search…",
  emptyText = "No options found",
  loading = false,
  hasMore = false,
  loadMoreText = "Load more",
  renderOption,
  renderValue,
  onSearchChange,
  onLoadMore,
  onChange,
  ...props
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = options.find((option) => option.value === value);
  const matches = options.filter((option) =>
    String(option.display).toLowerCase().includes(query.toLowerCase()),
  );
  const groups = grouped
    ? Array.from(new Set(matches.map((option) => option.group ?? "Other")))
    : [undefined];
  const flow = useFlowProps("fui-select", props);
  return (
    <div {...flow}>
      <button
        className="fui-select-trigger"
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={selected ? undefined : "fui-select-placeholder"}>
          {selected
            ? (renderValue?.(selected) ?? selected.display)
            : placeholder}
        </span>
        <Icon icon={`fa-solid fa-chevron-${open ? "up" : "down"}`} />
      </button>
      {open && (
        <div className="fui-select-menu">
          {searchable && (
            <label className="fui-select-search">
              <Icon icon="fa-solid fa-magnifying-glass" />
              <input
                value={query}
                placeholder={searchPlaceholder}
                autoFocus
                onChange={(event) => {
                  setQuery(event.target.value);
                  onSearchChange?.(event.target.value);
                }}
              />
            </label>
          )}
          <div className="fui-select-options" role="listbox">
            {matches.length ? (
              groups.map((group) => (
                <div key={String(group)}>
                  {grouped && <div className="fui-select-group">{group}</div>}
                  {matches
                    .filter(
                      (option) =>
                        !grouped || (option.group ?? "Other") === group,
                    )
                    .map((option) => (
                      <button
                        key={option.value}
                        className="fui-select-option"
                        type="button"
                        role="option"
                        aria-selected={option.value === value}
                        disabled={option.disabled}
                        onClick={() => {
                          onChange?.(option);
                          setOpen(false);
                          setQuery("");
                        }}
                      >
                        <span>
                          {renderOption?.(option, option.value === value) ??
                            option.display}
                        </span>
                        {option.value === value && (
                          <Icon icon="fa-solid fa-check" />
                        )}
                      </button>
                    ))}
                </div>
              ))
            ) : (
              <div className="fui-select-empty">{emptyText}</div>
            )}
          </div>
          {(hasMore || loading) && (
            <button
              className="fui-select-load-more"
              type="button"
              disabled={loading}
              onClick={onLoadMore}
            >
              {loading ? "Loading…" : loadMoreText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface TreeDropdownNodeProps {
  option: TreeModel;
  value?: string | number;
  onChange?: (model: TreeModel) => void;
}

function TreeDropdownNode({ option, value, onChange }: TreeDropdownNodeProps) {
  return (
    <div className="fui-tree-node">
      <label className="fui-check-label">
        <input
          className="fui-check"
          type="radio"
          checked={value === option.value}
          onChange={() => onChange?.(option)}
        />
        <span>{option.display}</span>
      </label>
      {option.children?.map((child) => (
        <TreeDropdownNode
          key={child.value}
          option={child}
          value={value}
          onChange={onChange}
        />
      ))}
    </div>
  );
}

export interface TreeDropdownProps extends BaseUIProps {
  value?: string | number;
  options: TreeModel[];
  onChange?: (model: TreeModel) => void;
}

export function TreeDropdown({
  value,
  options,
  onChange,
  ...props
}: TreeDropdownProps) {
  const [open, setOpen] = useState(false);
  const selected = (nodes: TreeModel[]): TreeModel | undefined => {
    for (const node of nodes) {
      if (node.value === value) return node;
      const child = node.children && selected(node.children);
      if (child) return child;
    }
    return undefined;
  };
  const flow = useFlowProps("", props);
  return (
    <div {...flow}>
      <button
        className="fui-control"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        {selected(options)?.display ?? "Select from tree"}
      </button>
      {open && (
        <div className="fui-tree">
          {options.map((option) => (
            <TreeDropdownNode
              key={option.value}
              option={option}
              value={value}
              onChange={(next) => {
                onChange?.(next);
                setOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export interface TabDefinition extends TabItem {
  content: ReactNode;
}
export interface TabProps extends PropsWithChildren<TabItem> {}
export function Tab(_props: TabProps) {
  return null;
}
export interface TabsProps extends PropsWithChildren<BaseUIProps> {
  tabs?: TabDefinition[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
}
export function Tabs({
  tabs,
  children,
  value,
  defaultValue,
  onChange,
  ...props
}: TabsProps) {
  const childTabs: TabDefinition[] = Children.toArray(children)
    .filter(
      (child): child is ReactElement<TabProps> =>
        isValidElement(child) && child.type === Tab,
    )
    .map((child) => ({
      id: child.props.id,
      label: child.props.label,
      icon: child.props.icon,
      disabled: child.props.disabled,
      content: child.props.children,
    }));
  const definitions = tabs ?? childTabs;
  const [internal, setInternal] = useState(defaultValue ?? definitions[0]?.id);
  const selected = value ?? internal;
  const flow = useFlowProps("", props);
  const activate = (id: string) => {
    if (value === undefined) setInternal(id);
    onChange?.(id);
  };
  return (
    <div {...flow}>
      <div className="fui-tabs-list" role="tablist">
        {definitions.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            className="fui-tab"
            role="tab"
            aria-selected={selected === tab.id}
            aria-controls={`panel-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => activate(tab.id)}
          >
            {tab.icon && <Icon icon={tab.icon} />}
            {tab.label}
          </button>
        ))}
      </div>
      {definitions.map(
        (tab) =>
          selected === tab.id && (
            <div
              key={tab.id}
              id={`panel-${tab.id}`}
              className="fui-tab-panel"
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
            >
              {tab.content}
            </div>
          ),
      )}
    </div>
  );
}

export interface SectionProps extends PropsWithChildren<BaseUIProps> {
  title: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export function Section({
  title,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  ...props
}: SectionProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const expanded = open ?? internal;
  const flow = useFlowProps("fui-section", props);
  const toggle = () => {
    if (open === undefined) setInternal(!expanded);
    onOpenChange?.(!expanded);
  };
  return (
    <section {...flow}>
      <button
        className="fui-section-header"
        type="button"
        aria-expanded={expanded}
        onClick={toggle}
      >
        <span>{title}</span>
        <Icon icon={`fa-solid fa-chevron-${expanded ? "up" : "down"}`} />
      </button>
      {expanded && <div className="fui-section-body">{children}</div>}
    </section>
  );
}
