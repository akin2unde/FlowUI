import type {
  BaseUIProps,
  SortState,
  TableColumn,
} from "@akin2unde/flowui-core";
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
}
export function Table<T extends Record<string, unknown>>({
  data,
  columns,
  sort,
  loading,
  emptyText = "No records found",
  onSortChange,
  onRowClick,
  ...props
}: TableProps<T>) {
  const flow = useFlowProps("fui-table-wrap", props);
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
      <table className="fui-table">
        <thead>
          <tr>
            {columns.map((column) => (
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
              <td colSpan={columns.length}>Loading…</td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>{emptyText}</td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={index} onClick={() => onRowClick?.(row)}>
                {columns.map((column) => {
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
