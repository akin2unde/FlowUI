import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  TemplateRef,
} from "@angular/core";
import {
  enabledSelectableDescendants,
  filterTree,
  flattenTree,
  resolveColorValue,
  selectedTreeModels,
  type ColorValue,
  type DropdownModel,
  type TreeModel,
} from "@akin2unde/flowui-core";
import { FlowComponentBase } from "./base";
import { FlowIconComponent } from "./primitives";

@Component({
  selector: "fui-multi-select",
  standalone: true,
  imports: [CommonModule, FlowIconComponent],
  template: `
    <div [class]="view().className" [ngStyle]="view().style">
      <div
        class="fui-multi-select-trigger"
        role="combobox"
        [attr.aria-expanded]="open"
        [tabIndex]="disabled ? -1 : 0"
        (click)="toggleOpen()"
        (keydown.enter)="toggleOpen()"
        (keydown.space)="$event.preventDefault(); toggleOpen()"
      >
        <span class="fui-chip-list">
          <ng-container *ngIf="visibleChips.length; else placeholderContent">
            <span
              *ngFor="let option of visibleChips"
              class="fui-select-chip"
              [ngStyle]="chipStyle"
            >
              <ng-container
                *ngIf="chipTemplate; else plainChip"
                [ngTemplateOutlet]="chipTemplate"
                [ngTemplateOutletContext]="{ $implicit: option }"
              />
              <ng-template #plainChip>{{ option.display }}</ng-template>
              <button
                class="fui-select-chip-close"
                type="button"
                [ngStyle]="closeStyle"
                [disabled]="disabled"
                [attr.aria-label]="'Remove ' + option.display"
                (keydown)="$event.stopPropagation()"
                (click)="remove(option); $event.stopPropagation()"
              >
                <fui-icon icon="fa-solid fa-xmark" />
              </button>
            </span>
          </ng-container>
          <ng-template #placeholderContent>
            <span class="fui-select-placeholder">{{ placeholder }}</span>
          </ng-template>
          <span
            *ngIf="selectedOptions.length > maxVisibleChips"
            class="fui-select-chip-overflow"
          >
            +{{ selectedOptions.length - maxVisibleChips }}
          </span>
        </span>
        <button
          class="fui-multi-select-toggle"
          type="button"
          [disabled]="disabled"
          [attr.aria-expanded]="open"
          aria-label="Toggle options"
          (keydown)="$event.stopPropagation()"
          (click)="$event.stopPropagation(); toggleOpen()"
        >
          <fui-icon [icon]="'fa-solid fa-chevron-' + (open ? 'up' : 'down')" />
        </button>
      </div>

      <div *ngIf="open" class="fui-select-menu">
        <label *ngIf="searchable" class="fui-select-search">
          <fui-icon icon="fa-solid fa-magnifying-glass" />
          <input
            [value]="query"
            [placeholder]="searchPlaceholder"
            (input)="search($any($event.target).value)"
          />
        </label>
        <div
          class="fui-select-options"
          role="listbox"
          aria-multiselectable="true"
        >
          <ng-container *ngIf="matches.length; else empty">
            <ng-container *ngFor="let group of groups">
              <div *ngIf="grouped" class="fui-select-group">{{ group }}</div>
              <button
                *ngFor="let option of optionsForGroup(group)"
                class="fui-select-option"
                type="button"
                role="option"
                [disabled]="option.disabled"
                [attr.aria-selected]="isSelected(option)"
                (click)="toggle(option)"
              >
                <input
                  *ngIf="showCheckboxes"
                  type="checkbox"
                  [checked]="isSelected(option)"
                  tabindex="-1"
                  readonly
                />
                <span>
                  <ng-container
                    *ngIf="optionTemplate; else plainOption"
                    [ngTemplateOutlet]="optionTemplate"
                    [ngTemplateOutletContext]="{
                      $implicit: option,
                      selected: isSelected(option),
                    }"
                  />
                  <ng-template #plainOption>{{ option.display }}</ng-template>
                </span>
              </button>
            </ng-container>
          </ng-container>
          <ng-template #empty
            ><div class="fui-select-empty">{{ emptyText }}</div></ng-template
          >
        </div>
        <button
          *ngIf="hasMore || loading"
          class="fui-select-load-more"
          type="button"
          [disabled]="loading"
          (click)="loadMore.emit()"
        >
          {{ loading ? "Loading…" : loadMoreText }}
        </button>
      </div>
    </div>
  `,
})
export class FlowMultiSelectComponent extends FlowComponentBase {
  constructor(private readonly element: ElementRef<HTMLElement>) {
    super();
  }
  @Input() options: DropdownModel[] = [];
  @Input() value: Array<string | number> = [];
  @Input() searchable = false;
  @Input() grouped = false;
  @Input() searchPlaceholder = "Search…";
  @Input() placeholder = "Select options";
  @Input() emptyText = "No options found";
  @Input() disabled = false;
  @Input() loading = false;
  @Input() hasMore = false;
  @Input() loadMoreText = "Load more";
  @Input() maxVisibleChips = 3;
  @Input() showCheckboxes = true;
  @Input() chipTextColor?: ColorValue;
  @Input() chipBackgroundColor?: ColorValue;
  @Input() chipCloseIconColor?: ColorValue;
  @Input() optionTemplate?: TemplateRef<{
    $implicit: DropdownModel;
    selected: boolean;
  }>;
  @Input() chipTemplate?: TemplateRef<{ $implicit: DropdownModel }>;

  @Output() valueChange = new EventEmitter<Array<string | number>>();
  @Output() selectedChange = new EventEmitter<DropdownModel[]>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() loadMore = new EventEmitter<void>();

  open = false;
  query = "";

  get selectedOptions(): DropdownModel[] {
    return this.options.filter((option) => this.value.includes(option.value));
  }

  get visibleChips(): DropdownModel[] {
    return this.selectedOptions.slice(0, this.maxVisibleChips);
  }

  get matches(): DropdownModel[] {
    return this.options.filter((option) =>
      String(option.display).toLowerCase().includes(this.query.toLowerCase()),
    );
  }

  get groups(): Array<string | number | undefined> {
    return this.grouped
      ? Array.from(
          new Set(this.matches.map((option) => option.group ?? "Other")),
        )
      : [undefined];
  }

  get chipStyle(): Record<string, string | undefined> {
    return {
      color: this.chipTextColor
        ? resolveColorValue(this.chipTextColor)
        : undefined,
      backgroundColor: this.chipBackgroundColor
        ? resolveColorValue(this.chipBackgroundColor)
        : undefined,
    };
  }

  get closeStyle(): Record<string, string | undefined> {
    return {
      color: this.chipCloseIconColor
        ? resolveColorValue(this.chipCloseIconColor)
        : undefined,
    };
  }

  optionsForGroup(group: string | number | undefined): DropdownModel[] {
    return this.matches.filter(
      (option) => !this.grouped || (option.group ?? "Other") === group,
    );
  }

  isSelected(option: DropdownModel): boolean {
    return this.value.includes(option.value);
  }

  search(query: string): void {
    this.query = query;
    this.searchChange.emit(query);
  }

  toggleOpen(): void {
    if (!this.disabled) this.open = !this.open;
  }

  toggle(option: DropdownModel): void {
    if (option.disabled) return;
    this.emit(
      this.isSelected(option)
        ? this.value.filter((item) => item !== option.value)
        : [...this.value, option.value],
    );
  }

  remove(option: DropdownModel): void {
    this.emit(this.value.filter((item) => item !== option.value));
  }

  @HostListener("document:pointerdown", ["$event"])
  closeOutside(event: PointerEvent): void {
    if (
      this.open &&
      !this.element.nativeElement.contains(event.target as Node)
    ) {
      this.open = false;
    }
  }

  private emit(values: Array<string | number>): void {
    this.value = values;
    this.valueChange.emit(values);
    this.selectedChange.emit(
      this.options.filter((option) => values.includes(option.value)),
    );
  }

  view = () => this.resolved("fui-multi-select");
}

interface FlatTreeNode extends TreeModel {
  depth: number;
}

@Component({
  selector: "fui-tree-multi-select",
  standalone: true,
  imports: [CommonModule, FlowIconComponent],
  template: `
    <div [class]="view().className" [ngStyle]="view().style">
      <div
        class="fui-multi-select-trigger"
        role="combobox"
        [attr.aria-expanded]="open"
        [tabIndex]="disabled ? -1 : 0"
        (click)="toggleOpen()"
        (keydown.enter)="toggleOpen()"
        (keydown.space)="$event.preventDefault(); toggleOpen()"
      >
        <span class="fui-chip-list">
          <ng-container *ngIf="visibleChips.length; else treePlaceholder">
            <span
              *ngFor="let node of visibleChips"
              class="fui-select-chip"
              [ngStyle]="chipStyle"
            >
              <ng-container
                *ngIf="chipTemplate; else plainTreeChip"
                [ngTemplateOutlet]="chipTemplate"
                [ngTemplateOutletContext]="{ $implicit: node }"
              />
              <ng-template #plainTreeChip>{{ node.display }}</ng-template>
              <button
                class="fui-select-chip-close"
                type="button"
                [ngStyle]="closeStyle"
                [attr.aria-label]="'Remove ' + node.display"
                (keydown)="$event.stopPropagation()"
                (click)="remove(node); $event.stopPropagation()"
              >
                <fui-icon icon="fa-solid fa-xmark" />
              </button>
            </span>
          </ng-container>
          <ng-template #treePlaceholder
            ><span class="fui-select-placeholder">{{
              placeholder
            }}</span></ng-template
          >
          <span
            *ngIf="selectedNodes.length > maxVisibleChips"
            class="fui-select-chip-overflow"
            >+{{ selectedNodes.length - maxVisibleChips }}</span
          >
        </span>
        <button
          class="fui-multi-select-toggle"
          type="button"
          [disabled]="disabled"
          [attr.aria-expanded]="open"
          aria-label="Toggle tree"
          (keydown)="$event.stopPropagation()"
          (click)="$event.stopPropagation(); toggleOpen()"
        >
          <fui-icon [icon]="'fa-solid fa-chevron-' + (open ? 'up' : 'down')" />
        </button>
      </div>
      <div *ngIf="open" class="fui-select-menu">
        <label *ngIf="searchable" class="fui-select-search">
          <fui-icon icon="fa-solid fa-magnifying-glass" />
          <input
            [value]="query"
            [placeholder]="searchPlaceholder"
            (input)="search($any($event.target).value)"
          />
        </label>
        <div class="fui-tree-multi" role="tree">
          <ng-container *ngIf="visibleNodes.length; else emptyTree">
            <div
              *ngFor="let node of visibleNodes"
              class="fui-tree-multi-row"
              [style.padding-left.rem]="node.depth * 1.25"
            >
              <button
                class="fui-tree-multi-toggle"
                type="button"
                [disabled]="!hasChildren(node)"
                (click)="toggleExpanded(node)"
              >
                <fui-icon
                  *ngIf="hasChildren(node)"
                  [icon]="
                    'fa-solid fa-chevron-' +
                    (isExpanded(node) ? 'down' : 'right')
                  "
                />
              </button>
              <input
                *ngIf="node.selectable !== false"
                type="checkbox"
                [checked]="isSelected(node)"
                [indeterminate]="isIndeterminate(node)"
                [disabled]="node.disabled"
                (change)="toggle(node)"
              />
              <button
                class="fui-tree-multi-label"
                type="button"
                [disabled]="node.disabled"
                (click)="
                  node.selectable === false
                    ? toggleExpanded(node)
                    : toggle(node)
                "
              >
                <ng-container
                  *ngIf="nodeTemplate; else plainNode"
                  [ngTemplateOutlet]="nodeTemplate"
                  [ngTemplateOutletContext]="{
                    $implicit: node,
                    selected: isSelected(node),
                  }"
                />
                <ng-template #plainNode>{{ node.display }}</ng-template>
              </button>
            </div>
          </ng-container>
          <ng-template #emptyTree
            ><div class="fui-select-empty">{{ emptyText }}</div></ng-template
          >
        </div>
      </div>
    </div>
  `,
})
export class FlowTreeMultiSelectComponent extends FlowComponentBase {
  constructor(private readonly element: ElementRef<HTMLElement>) {
    super();
  }
  @Input() nodes: TreeModel[] = [];
  @Input() value: Array<string | number> = [];
  @Input() expandedValues: Array<string | number> = [];
  @Input() searchable = false;
  @Input() searchPlaceholder = "Search tree…";
  @Input() placeholder = "Select from tree";
  @Input() emptyText = "No nodes found";
  @Input() disabled = false;
  @Input() cascadeSelection = true;
  @Input() maxVisibleChips = 3;
  @Input() chipTextColor?: ColorValue;
  @Input() chipBackgroundColor?: ColorValue;
  @Input() chipCloseIconColor?: ColorValue;
  @Input() nodeTemplate?: TemplateRef<{
    $implicit: TreeModel;
    selected: boolean;
  }>;
  @Input() chipTemplate?: TemplateRef<{ $implicit: TreeModel }>;

  @Output() valueChange = new EventEmitter<Array<string | number>>();
  @Output() selectedChange = new EventEmitter<TreeModel[]>();
  @Output() expandedValuesChange = new EventEmitter<Array<string | number>>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() loadChildren = new EventEmitter<TreeModel>();

  open = false;
  query = "";

  get selectedNodes(): TreeModel[] {
    return selectedTreeModels(this.nodes, this.value);
  }

  get visibleChips(): TreeModel[] {
    return this.selectedNodes.slice(0, this.maxVisibleChips);
  }

  get chipStyle(): Record<string, string | undefined> {
    return {
      color: this.chipTextColor
        ? resolveColorValue(this.chipTextColor)
        : undefined,
      backgroundColor: this.chipBackgroundColor
        ? resolveColorValue(this.chipBackgroundColor)
        : undefined,
    };
  }

  get closeStyle(): Record<string, string | undefined> {
    return {
      color: this.chipCloseIconColor
        ? resolveColorValue(this.chipCloseIconColor)
        : undefined,
    };
  }

  get visibleNodes(): FlatTreeNode[] {
    const roots = filterTree(this.nodes, this.query);
    const result: FlatTreeNode[] = [];
    const visit = (nodes: TreeModel[], depth: number): void => {
      nodes.forEach((node) => {
        result.push({ ...node, depth });
        if (this.query || this.isExpanded(node))
          visit(node.children ?? [], depth + 1);
      });
    };
    visit(roots, 0);
    return result;
  }

  hasChildren(node: TreeModel): boolean {
    return Boolean(node.children?.length || node.hasChildren);
  }

  isExpanded(node: TreeModel): boolean {
    return this.expandedValues.includes(node.value);
  }

  isSelected(node: TreeModel): boolean {
    if (!this.cascadeSelection) return this.value.includes(node.value);
    const descendants = enabledSelectableDescendants(node);
    return (
      Boolean(descendants.length) &&
      descendants.every((item) => this.value.includes(item.value))
    );
  }

  isIndeterminate(node: TreeModel): boolean {
    if (!this.cascadeSelection) return false;
    const descendants = enabledSelectableDescendants(node);
    const count = descendants.filter((item) =>
      this.value.includes(item.value),
    ).length;
    return count > 0 && count < descendants.length;
  }

  search(query: string): void {
    this.query = query;
    this.searchChange.emit(query);
  }

  toggleOpen(): void {
    if (!this.disabled) this.open = !this.open;
  }

  toggle(node: TreeModel): void {
    if (node.disabled || node.selectable === false) return;
    const targets = this.cascadeSelection
      ? enabledSelectableDescendants(node).map((item) => item.value)
      : [node.value];
    const remove = targets.every((target) => this.value.includes(target));
    this.emit(
      remove
        ? this.value.filter((item) => !targets.includes(item))
        : Array.from(new Set([...this.value, ...targets])),
    );
  }

  remove(node: TreeModel): void {
    this.emit(this.value.filter((item) => item !== node.value));
  }

  toggleExpanded(node: TreeModel): void {
    const next = this.isExpanded(node)
      ? this.expandedValues.filter((item) => item !== node.value)
      : [...this.expandedValues, node.value];
    this.expandedValues = next;
    this.expandedValuesChange.emit(next);
    if (!node.children?.length && node.hasChildren)
      this.loadChildren.emit(node);
  }

  @HostListener("document:pointerdown", ["$event"])
  closeOutside(event: PointerEvent): void {
    if (
      this.open &&
      !this.element.nativeElement.contains(event.target as Node)
    ) {
      this.open = false;
    }
  }

  private emit(values: Array<string | number>): void {
    this.value = values;
    this.valueChange.emit(values);
    this.selectedChange.emit(selectedTreeModels(this.nodes, values));
  }

  view = () => this.resolved("fui-tree-multi-select");
}
