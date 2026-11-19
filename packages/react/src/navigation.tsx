import {
  Children,
  isValidElement,
  useRef,
  useEffect,
  useId,
  type ButtonHTMLAttributes,
  type Ref,
  type KeyboardEvent,
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
import { filterTree } from "@akin2unde/flowui-core";
import { nativeProps, useDismissableLayer, useFlowProps } from "./helpers";
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

export interface DropdownProps
  extends
    BaseUIProps,
    Omit<
      ButtonHTMLAttributes<HTMLButtonElement>,
      keyof BaseUIProps | "onChange" | "value" | "defaultValue" | "children"
    > {
  clearable?: boolean;
  value?: string | number;
  defaultValue?: string | number;
  options: DropdownModel[];
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  required?: boolean;
  form?: string;
  searchable?: boolean;
  grouped?: boolean;
  searchPlaceholder?: string;
  emptyText?: string;
  loading?: boolean;
  hasMore?: boolean;
  loadMoreText?: string;
  triggerRef?: Ref<HTMLButtonElement>;
  searchInputRef?: Ref<HTMLInputElement>;
  renderOption?: (model: DropdownModel, selected: boolean) => ReactNode;
  renderValue?: (model: DropdownModel) => ReactNode;
  onSearchChange?: (query: string) => void;
  onLoadMore?: () => void;
  onClear?: () => void;
  onOpenChange?: (open: boolean) => void;
  onChange?: (model: DropdownModel) => void;
}
export function Dropdown({
  value,
  defaultValue,
  options,
  placeholder = "Select an option",
  disabled,
  readOnly,
  name,
  required,
  form,
  searchable = false,
  grouped = false,
  searchPlaceholder = "Search…",
  emptyText = "No options found",
  loading = false,
  hasMore = false,
  loadMoreText = "Load more",
  triggerRef,
  searchInputRef,
  renderOption,
  renderValue,
  onSearchChange,
  onLoadMore,
  clearable = false,
  onClear,
  onOpenChange,
  onChange,
  ...props
}: DropdownProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = value ?? internalValue;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(-1);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const generatedId = useId();
  const id = props.id ?? `fui-select-${generatedId}`;
  const listId = `${id}-list`;
  const show = (next: boolean) => {
    if (disabled || readOnly) return;
    setOpen(next);
    onOpenChange?.(next);
  };
  useDismissableLayer(root, open, () => {
    setOpen(false);
    onOpenChange?.(false);
  });
  useEffect(() => {
    if (disabled || readOnly) setOpen(false);
  }, [disabled, readOnly]);
  const selected = options.find((option) => option.value === selectedValue);
  const matches = options.filter((option) =>
    String(option.display).toLowerCase().includes(query.toLowerCase()),
  );
  const groups = grouped
    ? Array.from(new Set(matches.map((option) => option.group ?? "Other")))
    : [undefined];
  const flow = useFlowProps("fui-select", props);
  const canClear = Boolean(clearable && selected && !readOnly);
  const choose = (option: DropdownModel) => {
    if (disabled || readOnly || option.disabled) return;
    if (value === undefined) setInternalValue(option.value);
    onChange?.(option);
    show(false);
    setQuery("");
    trigger.current?.focus();
  };
  const keys = (event: KeyboardEvent<HTMLElement>) => {
    if (disabled || readOnly) return;
    if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      show(false);
      trigger.current?.focus();
      return;
    }
    if (event.key === "Tab") {
      show(false);
      return;
    }
    if (["ArrowDown", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      if (!open) show(true);
      const direction = event.key === "ArrowDown" ? 1 : -1;
      let next = active;
      for (let i = 0; i < matches.length; i++) {
        next = (next + direction + matches.length) % matches.length;
        if (!matches[next].disabled) break;
      }
      setActive(next);
      requestAnimationFrame(() =>
        root.current
          ?.querySelector<HTMLElement>(`[data-option-index="${next}"]`)
          ?.scrollIntoView?.({ block: "nearest" }),
      );
    } else if (open && event.key === "Enter" && active >= 0) {
      event.preventDefault();
      choose(matches[active]);
    }
  };
  return (
    <div
      ref={root}
      className={flow.className}
      style={flow.style}
      hidden={props.hidden}
      data-testid={props.testId}
    >
      {(name || required) && (
        <select
          className="fui-native-validation"
          name={name}
          form={form}
          value={selectedValue ?? ""}
          required={required}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden="true"
          onInvalid={() => trigger.current?.focus()}
          onChange={(event) => {
            const option = options.find(
              (item) => String(item.value) === event.target.value,
            );
            if (option) choose(option);
          }}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.display}
            </option>
          ))}
        </select>
      )}
      <button
        {...nativeProps(props)}
        id={id}
        ref={(node) => {
          trigger.current = node;
          if (typeof triggerRef === "function") triggerRef(node);
          else if (triggerRef) triggerRef.current = node;
        }}
        className="fui-select-trigger"
        data-clearable={canClear}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-required={required}
        aria-readonly={readOnly || undefined}
        aria-activedescendant={
          open && active >= 0 ? `${listId}-${active}` : undefined
        }
        onKeyDown={(event) => {
          props.onKeyDown?.(event);
          if (!event.defaultPrevented) keys(event);
        }}
        onClick={(event) => {
          props.onClick?.(event);
          if (!event.defaultPrevented) {
            setActive(matches.findIndex((option) => !option.disabled));
            show(!open);
          }
        }}
      >
        <span className={selected ? undefined : "fui-select-placeholder"}>
          {selected
            ? (renderValue?.(selected) ?? selected.display)
            : placeholder}
        </span>
        <Icon icon={`fa-solid fa-chevron-${open ? "up" : "down"}`} />
      </button>
      {canClear && (
        <button
          type="button"
          className="fui-select-clear fui-select-clear-single"
          disabled={disabled}
          aria-label="Clear selection"
          onClick={() => {
            if (value === undefined) setInternalValue(undefined);
            onClear?.();
            trigger.current?.focus();
          }}
        >
          <Icon icon="fa-solid fa-xmark" />
        </button>
      )}
      {open && (
        <div className="fui-select-menu">
          {searchable && (
            <label className="fui-select-search">
              <Icon icon="fa-solid fa-magnifying-glass" />
              <input
                ref={searchInputRef}
                value={query}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                aria-controls={listId}
                aria-activedescendant={
                  active >= 0 ? `${listId}-${active}` : undefined
                }
                autoFocus
                onKeyDown={keys}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(-1);
                  onSearchChange?.(event.target.value);
                }}
              />
            </label>
          )}
          <div
            className="fui-select-options"
            role="listbox"
            id={listId}
            aria-labelledby={props["aria-labelledby"]}
          >
            {matches.length ? (
              groups.map((group) => (
                <div key={String(group)}>
                  {grouped && <div className="fui-select-group">{group}</div>}
                  {matches
                    .filter(
                      (option) =>
                        !grouped || (option.group ?? "Other") === group,
                    )
                    .map((option) => {
                      const index = matches.indexOf(option);
                      return (
                        <button
                          key={option.value}
                          id={`${listId}-${index}`}
                          data-option-index={index}
                          className="fui-select-option"
                          type="button"
                          role="option"
                          aria-selected={option.value === selectedValue}
                          disabled={option.disabled}
                          onClick={() => choose(option)}
                        >
                          <span>
                            {renderOption?.(
                              option,
                              option.value === selectedValue,
                            ) ?? option.display}
                          </span>
                          {option.value === selectedValue && (
                            <Icon icon="fa-solid fa-check" />
                          )}
                        </button>
                      );
                    })}
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
  clearable?: boolean;
  value?: string | number;
  options: TreeModel[];
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  onClear?: () => void;
  onChange?: (model: TreeModel) => void;
}

export function TreeDropdown({
  value,
  options,
  placeholder = "Select from tree",
  searchable = false,
  searchPlaceholder = "Search tree…",
  emptyText = "No options found",
  disabled = false,
  clearable = false,
  onClear,
  onChange,
  ...props
}: TreeDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const root = useRef<HTMLDivElement>(null);
  useDismissableLayer(root, open, () => setOpen(false));
  const selected = (nodes: TreeModel[]): TreeModel | undefined => {
    for (const node of nodes) {
      if (node.value === value) return node;
      const child = node.children && selected(node.children);
      if (child) return child;
    }
    return undefined;
  };
  const visibleOptions = filterTree(options, query);
  const flow = useFlowProps("fui-tree-dropdown", props);
  const canClear = Boolean(clearable && selected(options) && onClear);
  return (
    <div {...flow} ref={root}>
      <button
        className="fui-select-trigger"
        data-clearable={canClear}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <span>{selected(options)?.display ?? placeholder}</span>
        <Icon icon={`fa-solid fa-chevron-${open ? "up" : "down"}`} />
      </button>
      {canClear && (
        <button
          type="button"
          className="fui-select-clear fui-select-clear-single"
          disabled={disabled}
          aria-label="Clear selection"
          onClick={() => onClear?.()}
        >
          <Icon icon="fa-solid fa-xmark" />
        </button>
      )}
      {open && (
        <div className="fui-select-menu">
          {searchable && (
            <label className="fui-select-search">
              <Icon icon="fa-solid fa-magnifying-glass" />
              <input
                value={query}
                placeholder={searchPlaceholder}
                autoFocus
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          )}
          <div className="fui-tree fui-tree-single">
            {visibleOptions.length ? (
              visibleOptions.map((option) => (
                <TreeDropdownNode
                  key={option.value}
                  option={option}
                  value={value}
                  onChange={(next) => {
                    onChange?.(next);
                    setOpen(false);
                    setQuery("");
                  }}
                />
              ))
            ) : (
              <div className="fui-select-empty">{emptyText}</div>
            )}
          </div>
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
  selectedStyle?: "underline" | "fill";
  onChange?: (id: string) => void;
}
export function Tabs({
  tabs,
  children,
  value,
  defaultValue,
  selectedStyle = "underline",
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
  const requested = value ?? internal;
  const selected = definitions.some(
    (tab) => tab.id === requested && !tab.disabled,
  )
    ? requested
    : definitions.find((tab) => !tab.disabled)?.id;
  const flow = useFlowProps("", props);
  const activate = (id: string) => {
    if (value === undefined) setInternal(id);
    onChange?.(id);
  };
  return (
    <div {...flow}>
      <div
        className="fui-tabs-list"
        role="tablist"
        data-selected-style={selectedStyle}
      >
        {definitions.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            className="fui-tab"
            type="button"
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
