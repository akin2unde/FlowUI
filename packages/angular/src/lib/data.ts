import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  exportTableToExcel,
  exportTableToPdf,
  type SortState,
  type TableColumn,
} from "@akin2unde/flowui-core";
import { FlowComponentBase } from "./base";
import { FlowIconComponent } from "./primitives";

@Component({
  selector: "fui-table",
  standalone: true,
  imports: [CommonModule, FlowIconComponent],
  template: `<div [class]="view().className" [ngStyle]="view().style">
    <div *ngIf="columnsConfigurable || exportable" class="fui-table-tools">
      <details *ngIf="columnsConfigurable" class="fui-column-picker">
        <summary>Columns</summary>
        <div class="fui-column-picker-menu">
          <label *ngFor="let column of columns">
            <input
              type="checkbox"
              [checked]="isColumnVisible(column.field)"
              (change)="changeColumn(column.field, $any($event.target).checked)"
            />
            {{ column.header }}
          </label>
        </div>
      </details>
      <div *ngIf="exportable" class="fui-table-export">
        <button type="button" (click)="exportExcel()">Excel</button>
        <button type="button" (click)="exportPdf()">PDF</button>
      </div>
    </div>
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

  isColumnVisible(field: string): boolean {
    return this.selectedFields.includes(field);
  }

  changeColumn(field: string, checked: boolean): void {
    const fields = checked
      ? [...this.selectedFields, field]
      : this.selectedFields.filter((selected) => selected !== field);
    this.visibleColumnFieldsChange.emit(fields);
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
