import type {
  BaseUIProps,
  SortState,
  TableColumn,
} from "@akin2unde/flowui-core";
import { exportTableToExcel, exportTableToPdf } from "@akin2unde/flowui-core";
import { useFlowProps } from "./helpers";
import { Icon } from "./primitives";

export interface TableProps<
  T extends Record<string, unknown>,
> extends BaseUIProps {
  data: T[];
  columns: TableColumn<T>[];
  sort?: SortState;
  loading?: boolean;
  emptyText?: string;
  onSortChange?: (sort: SortState) => void;
  onRowClick?: (row: T) => void;
  alternateRows?: boolean;
  columnsConfigurable?: boolean;
  visibleColumnFields?: string[];
  onVisibleColumnsChange?: (fields: string[]) => void;
  exportable?: boolean;
  exportFileName?: string;
  selectionEnabled?: boolean;
  selectedRow?: T;
  onSelectionChange?: (row: T) => void;
}
export function Table<T extends Record<string, unknown>>({
  data,
  columns,
  sort,
  loading,
  emptyText = "No records found",
  onSortChange,
  onRowClick,
  alternateRows = true,
  columnsConfigurable = false,
  visibleColumnFields,
  onVisibleColumnsChange,
  exportable = false,
  exportFileName = "table",
  selectionEnabled = false,
  selectedRow,
  onSelectionChange,
  ...props
}: TableProps<T>) {
  const flow = useFlowProps("fui-table-wrap", props);
  const selectedFields =
    visibleColumnFields ??
    columns
      .filter((column) => column.defaultVisible !== false)
      .map((column) => column.field);
  const visibleColumns = columns.filter((column) =>
    selectedFields.includes(column.field),
  );
  const changeColumns = (field: string, checked: boolean) => {
    const fields = checked
      ? [...selectedFields, field]
      : selectedFields.filter((selected) => selected !== field);
    onVisibleColumnsChange?.(fields);
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
  return (
    <div {...flow}>
      {(columnsConfigurable || exportable) && (
        <div className="fui-table-tools">
          {columnsConfigurable && (
            <details className="fui-column-picker">
              <summary>Columns</summary>
              <div className="fui-column-picker-menu">
                {columns.map((column) => (
                  <label key={column.field}>
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(column.field)}
                      onChange={(event) =>
                        changeColumns(column.field, event.target.checked)
                      }
                    />
                    {column.header}
                  </label>
                ))}
              </div>
            </details>
          )}
          {exportable && (
            <div className="fui-table-export">
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
      <table
        className="fui-table"
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
                    {column.header}
                    <Icon
                      icon={
                        sort?.field === column.field && sort.direction
                          ? `fa-solid fa-sort-${sort.direction === "asc" ? "up" : "down"}`
                          : "fa-solid fa-sort"
                      }
                    />
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={visibleColumns.length}>Loading…</td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={visibleColumns.length}>{emptyText}</td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={index}
                data-selected={selectionEnabled && selectedRow === row}
                tabIndex={selectionEnabled ? 0 : undefined}
                onClick={() => {
                  onRowClick?.(row);
                  if (selectionEnabled) onSelectionChange?.(row);
                }}
                onKeyDown={(event) => {
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
                    <td key={column.field} style={{ textAlign: column.align }}>
                      {column.format
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
  );
}
