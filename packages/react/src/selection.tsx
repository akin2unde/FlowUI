import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  enabledSelectableDescendants,
  filterTree,
  flattenTree,
  resolveColorValue,
  selectedTreeModels,
  type DropdownModel,
  type MultiSelectProps as CoreMultiSelectProps,
  type TreeModel,
  type TreeMultiSelectProps as CoreTreeMultiSelectProps,
} from "@akin2unde/flowui-core";
import { useDismissableLayer, useFlowProps } from "./helpers";
import { Icon } from "./primitives";

interface ChipColors {
  chipTextColor?: CoreMultiSelectProps["chipTextColor"];
  chipBackgroundColor?: CoreMultiSelectProps["chipBackgroundColor"];
  chipCloseIconColor?: CoreMultiSelectProps["chipCloseIconColor"];
}

function chipStyle(colors: ChipColors): CSSProperties {
  return {
    color: colors.chipTextColor
      ? resolveColorValue(colors.chipTextColor)
      : undefined,
    backgroundColor: colors.chipBackgroundColor
      ? resolveColorValue(colors.chipBackgroundColor)
      : undefined,
  };
}

function closeStyle(colors: ChipColors): CSSProperties {
  return {
    color: colors.chipCloseIconColor
      ? resolveColorValue(colors.chipCloseIconColor)
      : undefined,
  };
}

export interface MultiSelectProps extends CoreMultiSelectProps {
  renderOption?: (option: DropdownModel, selected: boolean) => ReactNode;
  renderChip?: (option: DropdownModel) => ReactNode;
  onChange?: (
    values: Array<string | number>,
    selectedOptions: DropdownModel[],
  ) => void;
  onSearchChange?: (query: string) => void;
  onLoadMore?: () => void;
}

export function MultiSelect({
  options,
  value = [],
  searchable = false,
  searchPlaceholder = "Search…",
  placeholder = "Select options",
  emptyText = "No options found",
  disabled = false,
  loading = false,
  hasMore = false,
  loadMoreText = "Load more",
  grouped = false,
  maxVisibleChips = 3,
  showCheckboxes = true,
  chipTextColor,
  chipBackgroundColor,
  chipCloseIconColor,
  renderOption,
  renderChip,
  onChange,
  onSearchChange,
  onLoadMore,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const root = useRef<HTMLDivElement>(null);
  useDismissableLayer(root, open, () => setOpen(false));
  const selected = options.filter((option) => value.includes(option.value));
  const visibleChips = selected.slice(0, maxVisibleChips);
  const matches = options.filter((option) =>
    String(option.display).toLowerCase().includes(query.toLowerCase()),
  );
  const groups = grouped
    ? Array.from(new Set(matches.map((option) => option.group ?? "Other")))
    : [undefined];
  const colors = {
    chipTextColor,
    chipBackgroundColor,
    chipCloseIconColor,
  };
  const flow = useFlowProps("fui-multi-select", props);
  const emit = (values: Array<string | number>) =>
    onChange?.(
      values,
      options.filter((option) => values.includes(option.value)),
    );
  const toggle = (option: DropdownModel) => {
    if (option.disabled) return;
    emit(
      value.includes(option.value)
        ? value.filter((item) => item !== option.value)
        : [...value, option.value],
    );
  };

  return (
    <div {...flow} ref={root}>
      <div
        className="fui-multi-select-trigger"
        role="combobox"
        aria-expanded={open}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (!disabled && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            setOpen((current) => !current);
          }
        }}
      >
        <span className="fui-chip-list">
          {visibleChips.length ? (
            visibleChips.map((option) => (
              <span
                className="fui-select-chip"
                style={chipStyle(colors)}
                key={option.value}
              >
                {renderChip?.(option) ?? option.display}
                <button
                  className="fui-select-chip-close"
                  style={closeStyle(colors)}
                  type="button"
                  aria-label={`Remove ${option.display}`}
                  disabled={disabled}
                  onKeyDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation();
                    emit(value.filter((item) => item !== option.value));
                  }}
                >
                  <Icon icon="fa-solid fa-xmark" />
                </button>
              </span>
            ))
          ) : (
            <span className="fui-select-placeholder">{placeholder}</span>
          )}
          {selected.length > maxVisibleChips && (
            <span className="fui-select-chip-overflow">
              +{selected.length - maxVisibleChips}
            </span>
          )}
        </span>
        <button
          className="fui-multi-select-toggle"
          type="button"
          disabled={disabled}
          aria-label="Toggle options"
          aria-haspopup="listbox"
          aria-expanded={open}
          onKeyDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            setOpen((current) => !current);
          }}
        >
          <Icon icon={`fa-solid fa-chevron-${open ? "up" : "down"}`} />
        </button>
      </div>
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
          <div
            className="fui-select-options"
            role="listbox"
            aria-multiselectable="true"
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
                      const checked = value.includes(option.value);
                      return (
                        <button
                          className="fui-select-option"
                          key={option.value}
                          type="button"
                          role="option"
                          aria-selected={checked}
                          disabled={option.disabled}
                          onClick={() => toggle(option)}
                        >
                          {showCheckboxes && (
                            <input
                              type="checkbox"
                              checked={checked}
                              readOnly
                              tabIndex={-1}
                            />
                          )}
                          <span>
                            {renderOption?.(option, checked) ?? option.display}
                          </span>
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

interface TreeNodeProps {
  node: TreeModel;
  values: Array<string | number>;
  expanded: Array<string | number>;
  cascade: boolean;
  depth: number;
  renderNode?: (node: TreeModel, selected: boolean) => ReactNode;
  onToggle: (node: TreeModel) => void;
  onExpand: (node: TreeModel) => void;
}

function TreeMultiNode({
  node,
  values,
  expanded,
  cascade,
  depth,
  renderNode,
  onToggle,
  onExpand,
}: TreeNodeProps) {
  const checkbox = useRef<HTMLInputElement>(null);
  const descendants = enabledSelectableDescendants(node);
  const selectedCount = descendants.filter((item) =>
    values.includes(item.value),
  ).length;
  const exactSelected = values.includes(node.value);
  const selected =
    cascade && descendants.length
      ? selectedCount === descendants.length
      : exactSelected;
  const indeterminate =
    cascade && selectedCount > 0 && selectedCount < descendants.length;
  useEffect(() => {
    if (checkbox.current) checkbox.current.indeterminate = indeterminate;
  }, [indeterminate]);
  const hasChildren = Boolean(node.children?.length || node.hasChildren);
  const isExpanded = expanded.includes(node.value);

  return (
    <div
      className="fui-tree-multi-node"
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
    >
      <div
        className="fui-tree-multi-row"
        style={{ paddingLeft: `${depth * 1.25}rem` }}
      >
        <button
          className="fui-tree-multi-toggle"
          type="button"
          disabled={!hasChildren}
          onClick={() => onExpand(node)}
        >
          {hasChildren && (
            <Icon
              icon={`fa-solid fa-chevron-${isExpanded ? "down" : "right"}`}
            />
          )}
        </button>
        {node.selectable !== false && (
          <input
            ref={checkbox}
            type="checkbox"
            checked={selected}
            disabled={node.disabled}
            onChange={() => onToggle(node)}
          />
        )}
        <button
          className="fui-tree-multi-label"
          type="button"
          disabled={node.disabled}
          onClick={() =>
            node.selectable !== false ? onToggle(node) : onExpand(node)
          }
        >
          {renderNode?.(node, selected) ?? node.display}
        </button>
      </div>
      {hasChildren &&
        isExpanded &&
        node.children?.map((child) => (
          <TreeMultiNode
            key={child.value}
            node={child}
            values={values}
            expanded={expanded}
            cascade={cascade}
            depth={depth + 1}
            renderNode={renderNode}
            onToggle={onToggle}
            onExpand={onExpand}
          />
        ))}
    </div>
  );
}

export interface TreeMultiSelectProps extends CoreTreeMultiSelectProps {
  renderNode?: (node: TreeModel, selected: boolean) => ReactNode;
  renderChip?: (node: TreeModel) => ReactNode;
  onChange?: (
    values: Array<string | number>,
    selectedNodes: TreeModel[],
  ) => void;
  onExpandedValuesChange?: (values: Array<string | number>) => void;
  onSearchChange?: (query: string) => void;
  onLoadChildren?: (node: TreeModel) => void;
}

export function TreeMultiSelect({
  nodes,
  value = [],
  expandedValues,
  searchable = false,
  searchPlaceholder = "Search tree…",
  placeholder = "Select from tree",
  emptyText = "No nodes found",
  disabled = false,
  cascadeSelection = true,
  maxVisibleChips = 3,
  chipTextColor,
  chipBackgroundColor,
  chipCloseIconColor,
  renderNode,
  renderChip,
  onChange,
  onExpandedValuesChange,
  onSearchChange,
  onLoadChildren,
  ...props
}: TreeMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const root = useRef<HTMLDivElement>(null);
  useDismissableLayer(root, open, () => setOpen(false));
  const [internalExpanded, setInternalExpanded] = useState<
    Array<string | number>
  >([]);
  const expanded = expandedValues ?? internalExpanded;
  const selected = selectedTreeModels(nodes, value);
  const visibleChips = selected.slice(0, maxVisibleChips);
  const filtered = filterTree(nodes, query);
  const colors = { chipTextColor, chipBackgroundColor, chipCloseIconColor };
  const flow = useFlowProps("fui-tree-multi-select", props);
  const emit = (values: Array<string | number>) =>
    onChange?.(values, selectedTreeModels(nodes, values));
  const toggle = (node: TreeModel) => {
    if (node.disabled || node.selectable === false) return;
    const targets = cascadeSelection
      ? enabledSelectableDescendants(node).map((item) => item.value)
      : [node.value];
    const remove = targets.every((target) => value.includes(target));
    emit(
      remove
        ? value.filter((item) => !targets.includes(item))
        : Array.from(new Set([...value, ...targets])),
    );
  };
  const expand = (node: TreeModel) => {
    const next = expanded.includes(node.value)
      ? expanded.filter((item) => item !== node.value)
      : [...expanded, node.value];
    if (expandedValues === undefined) setInternalExpanded(next);
    onExpandedValuesChange?.(next);
    if (!node.children?.length && node.hasChildren) onLoadChildren?.(node);
  };

  return (
    <div {...flow} ref={root}>
      <div
        className="fui-multi-select-trigger"
        role="combobox"
        aria-expanded={open}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (!disabled && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            setOpen((current) => !current);
          }
        }}
      >
        <span className="fui-chip-list">
          {visibleChips.length ? (
            visibleChips.map((node) => (
              <span
                className="fui-select-chip"
                style={chipStyle(colors)}
                key={node.value}
              >
                {renderChip?.(node) ?? node.display}
                <button
                  className="fui-select-chip-close"
                  style={closeStyle(colors)}
                  type="button"
                  aria-label={`Remove ${node.display}`}
                  onKeyDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation();
                    emit(value.filter((item) => item !== node.value));
                  }}
                >
                  <Icon icon="fa-solid fa-xmark" />
                </button>
              </span>
            ))
          ) : (
            <span className="fui-select-placeholder">{placeholder}</span>
          )}
          {selected.length > maxVisibleChips && (
            <span className="fui-select-chip-overflow">
              +{selected.length - maxVisibleChips}
            </span>
          )}
        </span>
        <button
          className="fui-multi-select-toggle"
          type="button"
          disabled={disabled}
          aria-label="Toggle tree"
          aria-expanded={open}
          onKeyDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            setOpen((current) => !current);
          }}
        >
          <Icon icon={`fa-solid fa-chevron-${open ? "up" : "down"}`} />
        </button>
      </div>
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
          <div className="fui-tree-multi" role="tree">
            {filtered.length ? (
              filtered.map((node) => (
                <TreeMultiNode
                  key={node.value}
                  node={node}
                  values={value}
                  expanded={
                    query
                      ? flattenTree(filtered).map((item) => item.value)
                      : expanded
                  }
                  cascade={cascadeSelection}
                  depth={0}
                  renderNode={renderNode}
                  onToggle={toggle}
                  onExpand={expand}
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
