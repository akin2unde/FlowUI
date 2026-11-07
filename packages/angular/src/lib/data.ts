import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from "@angular/core";
import {
  exportTableToCsv,
  exportTableToExcel,
  exportTableToPdf,
  type SortState,
  type TableColumn,
  type TableLoadMoreContext,
} from "@akin2unde/flowui-core";
import { FlowComponentBase } from "./base";
import { FlowIconComponent } from "./primitives";
import { FlowMultiSelectComponent } from "./selection";

@Component({
  selector: "fui-table",
  standalone: true,
  imports: [CommonModule, FlowIconComponent, FlowMultiSelectComponent],
  template: `<div [class]="view().className" [ngStyle]="view().style">
    <div *ngIf="columnsConfigurable || exportable" class="fui-table-tools">
      <fui-multi-select
        *ngIf="columnsConfigurable"
        [options]="columnOptions"
        [value]="selectedFields"
        [maxVisibleChips]="0"
        placeholder="Columns"
        (valueChange)="changeColumns($event)"
      />
      <div *ngIf="exportable" class="fui-table-export">
        <button type="button" (click)="exportCsv()">CSV</button>
        <button type="button" (click)="exportExcel()">Excel</button>
        <button type="button" (click)="exportPdf()">PDF</button>
      </div>
    </div>
    <div class="fui-table-scroll">
      <table
        class="fui-table"
        [attr.data-alternate-rows]="alternateRows"
        [attr.data-selection-enabled]="selectionEnabled"
      >
        <thead>
          <tr>
            <th
              *ngFor="let column of displayedColumns"
              [style.width]="column.width"
              [style.text-align]="column.align"
            >
              <button
                *ngIf="column.sortable; else plain"
                class="fui-sort-button"
                type="button"
                (click)="changeSort(column.field)"
              >
                {{ column.header
                }}<fui-icon [icon]="sortIcon(column.field)" /></button
              ><ng-template #plain>{{ column.header }}</ng-template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngIf="loading">
            <td [attr.colspan]="displayedColumns.length">Loading…</td>
          </tr>
          <tr *ngIf="!loading && data.length === 0">
            <td [attr.colspan]="displayedColumns.length">{{ emptyText }}</td>
          </tr>
          <tr
            *ngFor="let row of data"
            [attr.data-selected]="selectionEnabled && selectedRow === row"
            [tabIndex]="selectionEnabled ? 0 : -1"
            (click)="selectRow(row)"
            (keydown.enter)="selectRow(row)"
            (keydown.space)="$event.preventDefault(); selectRow(row)"
          >
            <td
              *ngFor="let column of displayedColumns"
              [style.text-align]="column.align"
            >
              {{ formatCell(row, column) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ng-container *ngIf="showLoadMore || loadMoreTemplate">
      <ng-container
        *ngIf="loadMoreTemplate; else defaultLoadMore"
        [ngTemplateOutlet]="loadMoreTemplate"
        [ngTemplateOutletContext]="{ $implicit: loadContext }"
      />
      <ng-template #defaultLoadMore>
        <div class="fui-table-load-more">
          <span role="status"
            >{{ data.length
            }}{{ totalCount === undefined ? "" : " of " + totalCount }} records
            loaded</span
          >
          <button
            *ngIf="loadContext.hasMore"
            type="button"
            [disabled]="loadContext.loading"
            (click)="requestMore()"
          >
            {{ loadContext.loading ? "Loading…" : "Load more" }}
          </button>
        </div>
      </ng-template>
    </ng-container>
  </div>`,
})
export class FlowTableComponent extends FlowComponentBase {
  @Input() data: Record<string, unknown>[] = [];
  @Input() columns: TableColumn<Record<string, unknown>>[] = [];
  @Input() sort?: SortState;
  @Input() loading = false;
  @Input() emptyText = "No records found";
  @Input() alternateRows = true;
  @Input() columnsConfigurable = false;
  @Input() visibleColumnFields?: string[];
  @Input() exportable = false;
  @Input() showLoadMore = false;
  @Input() totalCount?: number;
  @Input() hasMore?: boolean;
  @Input() loadingMore = false;
  @Input() loadMoreTemplate?: TemplateRef<{ $implicit: TableLoadMoreContext }>;
  @Output() loadMore = new EventEmitter<void>();
  private internalFields?: string[];
  @Input() exportFileName = "table";
  @Input() selectionEnabled = false;
  @Input() selectedRow?: Record<string, unknown>;
  @Output() sortChange = new EventEmitter<SortState>();
  @Output() rowSelected = new EventEmitter<Record<string, unknown>>();
  @Output() selectionChange = new EventEmitter<Record<string, unknown>>();
  @Output() visibleColumnFieldsChange = new EventEmitter<string[]>();

  get selectedFields(): string[] {
    return (
      this.visibleColumnFields ??
      this.internalFields ??
      this.columns
        .filter((column) => column.defaultVisible !== false)
        .map((column) => column.field)
    );
  }

  get displayedColumns(): TableColumn<Record<string, unknown>>[] {
    return this.columns.filter((column) =>
      this.selectedFields.includes(column.field),
    );
  }

  get columnOptions() {
    return this.columns.map((column) => ({
      display: column.header,
      value: column.field,
      other: null,
    }));
  }

  changeColumns(fields: Array<string | number>): void {
    const next = fields.map(String);
    if (this.visibleColumnFields === undefined) this.internalFields = next;
    this.visibleColumnFieldsChange.emit(next);
  }

  get loadContext(): TableLoadMoreContext {
    return {
      loadedCount: this.data.length,
      totalCount: this.totalCount,
      loading: this.loading || this.loadingMore,
      hasMore:
        this.hasMore ??
        (this.totalCount !== undefined && this.data.length < this.totalCount),
      loadMore: this.requestMore,
    };
  }

  requestMore = (): void => {
    if (this.loadContext.hasMore && !this.loadContext.loading)
      this.loadMore.emit();
  };

  exportCsv(): void {
    exportTableToCsv(this.data, this.displayedColumns, this.exportFileName);
  }

  exportExcel(): void {
    exportTableToExcel(this.data, this.displayedColumns, this.exportFileName);
  }

  exportPdf(): void {
    exportTableToPdf(this.data, this.displayedColumns, this.exportFileName);
  }

  selectRow(row: Record<string, unknown>): void {
    this.rowSelected.emit(row);
    if (this.selectionEnabled) this.selectionChange.emit(row);
  }
  changeSort(field: string) {
    const direction =
      this.sort?.field !== field
        ? "asc"
        : this.sort.direction === "asc"
          ? "desc"
          : this.sort.direction === "desc"
            ? null
            : "asc";
    this.sortChange.emit({ field, direction });
  }
  sortIcon(field: string) {
    return this.sort?.field === field && this.sort.direction
      ? `fa-solid fa-sort-${this.sort.direction === "asc" ? "up" : "down"}`
      : "fa-solid fa-sort";
  }
  formatCell(
    row: Record<string, unknown>,
    column: TableColumn<Record<string, unknown>>,
  ) {
    const value = row[column.field];
    return column.format ? column.format(value, row) : String(value ?? "");
  }
  view = () => this.resolved("fui-table-wrap");
}
