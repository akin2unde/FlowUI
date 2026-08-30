import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import type { SortState, TableColumn } from "@akin2unde/flowui-core";
import { FlowComponentBase } from "./base";
import { FlowIconComponent } from "./primitives";

@Component({
  selector: "fui-table",
  standalone: true,
  imports: [CommonModule, FlowIconComponent],
  template: `<div [class]="view().className" [ngStyle]="view().style">
    <table class="fui-table">
      <thead>
        <tr>
          <th
            *ngFor="let column of columns"
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
          <td [attr.colspan]="columns.length">Loading…</td>
        </tr>
        <tr *ngIf="!loading && data.length === 0">
          <td [attr.colspan]="columns.length">{{ emptyText }}</td>
        </tr>
        <tr *ngFor="let row of data" (click)="rowSelected.emit(row)">
          <td *ngFor="let column of columns" [style.text-align]="column.align">
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
  @Output() sortChange = new EventEmitter<SortState>();
  @Output() rowSelected = new EventEmitter<Record<string, unknown>>();
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
