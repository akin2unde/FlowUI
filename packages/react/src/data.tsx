import { useState, type ReactNode, type Key, type HTMLAttributes } from "react";
import type {
  BaseUIProps,
  SortState,
  TableColumn as CoreTableColumn,
  TableLoadMoreContext,
} from "@akin2unde/flowui-core";
import {
  exportTableToCsv,
  exportTableToExcel,
  exportTableToPdf,
} from "@akin2unde/flowui-core";
import { useFlowProps } from "./helpers";
import { Icon } from "./primitives";
import { MultiSelect } from "./selection";

export interface TableColumn<T> extends CoreTableColumn<T> {
  renderCell?: (value: unknown, row: T, rowIndex: number) => ReactNode;
  renderHeader?: (column: CoreTableColumn<T>) => ReactNode;
  cellClassName?: string;
}

export interface TableProps<T extends object> extends BaseUIProps {
  data: T[];
  columns: TableColumn<T>[];
  sort?: SortState;
  loading?: boolean;
  emptyText?: string;
  onSortChange?: (sort: SortState) => void;
  onRowClick?: (row: T) => void;
  alternateRows?: boolean;
  showRowDividers?: boolean;
  columnsConfigurable?: boolean;
  visibleColumnFields?: string[];
  onVisibleColumnsChange?: (fields: string[]) => void;
  exportable?: boolean;
  totalCount?: number;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
  renderLoadMore?: (context: TableLoadMoreContext) => ReactNode;
  exportFileName?: string;
  selectionEnabled?: boolean;
  selectedRow?: T;
  rowKey?: (keyof T & string) | ((row: T, index: number) => Key);
  selectedRowKey?: Key;
  rowClassName?: string | ((row: T, index: number) => string | undefined);
  rowProps?: (row: T, index: number) => HTMLAttributes<HTMLTableRowElement>;

  onSelectionChange?: (row: T) => void;
}
export function Table<T extends object>({
  data,
  columns,
  sort,
  loading,
  emptyText = "No records found",
  onSortChange,
  onRowClick,
  alternateRows = true,
  showRowDividers = true,
  columnsConfigurable = false,
  visibleColumnFields,
  onVisibleColumnsChange,
  exportable = false,
  totalCount,
  hasMore = totalCount !== undefined && data.length < totalCount,
  loadingMore = false,
  onLoadMore,
  renderLoadMore,
  exportFileName = "table",
  selectionEnabled = false,
  selectedRow,
  rowKey,
  selectedRowKey,
  rowClassName,
  rowProps,
  onSelectionChange,
  ...props
}: TableProps<T>) {
  const flow = useFlowProps("fui-table-wrap", props);
  const [internalFields, setInternalFields] = useState<string[]>();
  const selectedFields =
    visibleColumnFields ??
    internalFields ??
    columns
      .filter((column) => column.defaultVisible !== false)
      .map((column) => column.field);
  const visibleColumns = columns.filter((column) =>
    selectedFields.includes(column.field),
  );
  const loadMore = () => {
    if (hasMore && !loading && !loadingMore) onLoadMore?.();
  };
  const loadContext: TableLoadMoreContext = {
    loadedCount: data.length,
    totalCount,
    loading: Boolean(loading || loadingMore),
    hasMore,
    loadMore,
  };
  const changeSort = (field: string) => {
    const direction =
      sort?.field !== field
        ? "asc"
        : sort.direction === "asc"
          ? "desc"
          : sort.direction === "desc"
            ? null
            : "asc";
    onSortChange?.({ field, direction });
  };
  const keyOf = (row: T, index: number): Key =>
    typeof rowKey === "function"
      ? rowKey(row, index)
      : rowKey
        ? String(row[rowKey])
        : index;
  const isSelected = (row: T, index: number) =>
    selectedRowKey !== undefined
      ? selectedRowKey === keyOf(row, index)
      : selectedRow === row;
  return (
    <div {...flow}>
      {(columnsConfigurable || exportable) && (
        <div className="fui-table-tools">
          {columnsConfigurable && (
            <MultiSelect
              options={columns.map((column) => ({
                display: column.header,
                value: column.field,
                other: null,
              }))}
              value={selectedFields}
              placeholder="Columns"
              maxVisibleChips={0}
              onChange={(fields) => {
                const next = fields.map(String);
                if (visibleColumnFields === undefined) setInternalFields(next);
                onVisibleColumnsChange?.(next);
              }}
            />
          )}
          {exportable && (
            <div className="fui-table-export">
              <button
                type="button"
                onClick={() =>
                  exportTableToCsv(data, visibleColumns, exportFileName)
                }
              >
                CSV
              </button>
              <button
                type="button"
                onClick={() =>
                  exportTableToExcel(data, visibleColumns, exportFileName)
                }
              >
                Excel
              </button>
              <button
                type="button"
                onClick={() =>
                  exportTableToPdf(data, visibleColumns, exportFileName)
                }
              >
                PDF
              </button>
            </div>
          )}
        </div>
      )}
      <div className="fui-table-scroll">
        <table
          className="fui-table"
          data-row-dividers={showRowDividers}
          data-alternate-rows={alternateRows}
          data-selection-enabled={selectionEnabled}
        >
          <thead>
            <tr>
              {visibleColumns.map((column) => (
                <th
                  key={column.field}
                  style={{ width: column.width, textAlign: column.align }}
                >
                  {column.sortable ? (
                    <button
                      className="fui-sort-button"
                      type="button"
                      onClick={() => changeSort(column.field)}
                    >
                      {column.renderHeader?.(column) ?? column.header}
                      <Icon
                        icon={
                          sort?.field === column.field && sort.direction
                            ? `fa-solid fa-sort-${sort.direction === "asc" ? "up" : "down"}`
                            : "fa-solid fa-sort"
                        }
                      />
                    </button>
                  ) : (
                    (column.renderHeader?.(column) ?? column.header)
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={Math.max(1, visibleColumns.length)}>Loading…</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={Math.max(1, visibleColumns.length)}>
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={keyOf(row, index)}
                  {...rowProps?.(row, index)}
                  className={
                    [
                      rowProps?.(row, index)?.className,
                      typeof rowClassName === "function"
                        ? rowClassName(row, index)
                        : rowClassName,
                    ]
                      .filter(Boolean)
                      .join(" ") || undefined
                  }
                  data-selected={selectionEnabled && isSelected(row, index)}
                  tabIndex={
                    rowProps?.(row, index)?.tabIndex ??
                    (selectionEnabled ? 0 : undefined)
                  }
                  onClick={(event) => {
                    rowProps?.(row, index)?.onClick?.(event);
                    if (event.defaultPrevented) return;
                    onRowClick?.(row);
                    if (selectionEnabled) onSelectionChange?.(row);
                  }}
                  onKeyDown={(event) => {
                    rowProps?.(row, index)?.onKeyDown?.(event);
                    if (event.defaultPrevented) return;
                    if (
                      selectionEnabled &&
                      (event.key === "Enter" || event.key === " ")
                    ) {
                      event.preventDefault();
                      onSelectionChange?.(row);
                    }
                  }}
                >
                  {visibleColumns.map((column) => {
                    const value = row[column.field];
                    return (
                      <td
                        key={column.field}
                        className={column.cellClassName}
                        style={{ textAlign: column.align }}
                      >
                        {column.renderCell
                          ? column.renderCell(value, row, index)
                          : column.format
                            ? column.format(value, row)
                            : String(value ?? "")}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {renderLoadMore
        ? renderLoadMore(loadContext)
        : onLoadMore && (
            <div className="fui-table-load-more">
              <span role="status">
                {data.length}
                {totalCount !== undefined ? ` of ${totalCount}` : ""} records
                loaded
              </span>
              {hasMore && (
                <button
                  type="button"
                  disabled={loadContext.loading}
                  onClick={loadMore}
                >
                  {loadContext.loading ? "Loading…" : "Load more"}
                </button>
              )}
            </div>
          )}
    </div>
  );
}
