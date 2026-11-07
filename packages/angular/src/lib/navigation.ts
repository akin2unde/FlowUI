import { CommonModule } from "@angular/common";
import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import type { MenuItem, TreeModel } from "@akin2unde/flowui-core";
import { FlowComponentBase } from "./base";
import { FlowBadgeComponent, FlowIconComponent } from "./primitives";

@Component({
  selector: "fui-menu",
  standalone: true,
  imports: [CommonModule, FlowIconComponent, FlowBadgeComponent],
  template: `<div
    [class]="view().className"
    [ngStyle]="view().style"
    role="menu"
  >
    <ng-container *ngFor="let item of items"
      ><div
        *ngIf="item.separator; else action"
        class="fui-menu-separator"
      ></div>
      <ng-template #action
        ><button
          class="fui-menu-item"
          role="menuitem"
          [disabled]="item.disabled"
          (click)="selected.emit(item)"
        >
          <fui-icon *ngIf="item.icon" [icon]="item.icon" /><span
            style="flex:1"
            >{{ item.label }}</span
          ><fui-badge *ngIf="item.badge !== undefined">{{
            item.badge
          }}</fui-badge>
        </button></ng-template
      ></ng-container
    >
  </div>`,
})
export class FlowMenuComponent extends FlowComponentBase {
  @Input() items: MenuItem[] = [];
  @Output() selected = new EventEmitter<MenuItem>();
  view = () => this.resolved("fui-menu");
}

interface FlatTreeModel extends TreeModel {
  depth: number;
}

@Component({
  selector: "fui-tree-dropdown",
  standalone: true,
  imports: [CommonModule, FlowIconComponent],
  template: `
    <div [class]="view().className" [ngStyle]="view().style">
      <button
        class="fui-select-trigger"
        [attr.data-clearable]="clearable && value !== undefined"
        type="button"
        [disabled]="disabled"
        (click)="open = !open"
        [attr.aria-expanded]="open"
      >
        <span>{{ selectedDisplay }}</span>
        <fui-icon [icon]="'fa-solid fa-chevron-' + (open ? 'up' : 'down')" />
      </button>

      <button
        *ngIf="clearable && value !== undefined"
        type="button"
        class="fui-select-clear fui-select-clear-single"
        aria-label="Clear selection"
        [disabled]="disabled"
        (click)="clearSelection()"
      >
        <fui-icon icon="fa-solid fa-xmark" />
      </button>
      <div *ngIf="open" class="fui-select-menu">
        <label *ngIf="searchable" class="fui-select-search">
          <fui-icon icon="fa-solid fa-magnifying-glass" />
          <input
            [value]="query"
            [placeholder]="searchPlaceholder"
            (input)="query = $any($event.target).value"
          />
        </label>
        <div class="fui-tree fui-tree-single">
          <label
            *ngFor="let option of flatOptions"
            class="fui-check-label"
            [style.padding-left.rem]="option.depth"
          >
            <input
              class="fui-check"
              type="radio"
              [checked]="value === option.value"
              (change)="choose(option)"
            />
            <span>{{ option.display }}</span>
          </label>
          <div *ngIf="!flatOptions.length" class="fui-select-empty">
            {{ emptyText }}
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FlowTreeDropdownComponent extends FlowComponentBase {
  constructor(private readonly element: ElementRef<HTMLElement>) {
    super();
  }
  @Input() value?: string | number;
  @Input() options: TreeModel[] = [];
  @Input() placeholder = "Select from tree";
  @Input() searchable = false;
  @Input() searchPlaceholder = "Search tree…";
  @Input() emptyText = "No options found";
  @Input() disabled = false;
  @Input() clearable = false;

  @Output() cleared = new EventEmitter<void>();
  @Output() selected = new EventEmitter<TreeModel>();

  open = false;
  query = "";

  get flatOptions(): FlatTreeModel[] {
    const flatten = (nodes: TreeModel[], depth = 0): FlatTreeModel[] => {
      const result: FlatTreeModel[] = [];

      for (const node of nodes) {
        result.push(
          { ...node, depth },
          ...flatten(node.children ?? [], depth + 1),
        );
      }

      return result;
    };

    return flatten(this.options).filter((option) =>
      String(option.display).toLowerCase().includes(this.query.toLowerCase()),
    );
  }

  get selectedDisplay(): string | number {
    return (
      this.flatOptions.find((option) => option.value === this.value)?.display ??
      this.placeholder
    );
  }

  choose(model: TreeModel): void {
    this.selected.emit(model);
    this.open = false;
    this.query = "";
  }

  clearSelection(): void {
    this.value = undefined;
    this.cleared.emit();
  }

  @HostListener("document:keydown.escape")
  closeOnEscape(): void {
    this.open = false;
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

  view = () => this.resolved("fui-tree-dropdown");
}

@Component({
  selector: "fui-tab",
  standalone: true,
  template: `<ng-template><ng-content /></ng-template>`,
})
export class FlowTabComponent {
  @Input({ required: true }) id!: string;
  @Input({ required: true }) label!: string;
  @Input() icon?: string;
  @Input() disabled = false;
  @ViewChild(TemplateRef, { static: true }) template!: TemplateRef<unknown>;
}

@Component({
  selector: "fui-tabs",
  standalone: true,
  imports: [CommonModule, FlowIconComponent],
  template: `<div [class]="view().className" [ngStyle]="view().style">
    <div
      class="fui-tabs-list"
      role="tablist"
      [attr.data-selected-style]="selectedStyle"
    >
      <button
        *ngFor="let tab of tabList"
        class="fui-tab"
        type="button"
        role="tab"
        [attr.aria-selected]="active === tab.id"
        [disabled]="tab.disabled"
        (click)="activate(tab.id)"
      >
        <fui-icon *ngIf="tab.icon" [icon]="tab.icon" />{{ tab.label }}
      </button>
    </div>
    <div class="fui-tab-panel" role="tabpanel">
      <ng-container *ngIf="activeTab" [ngTemplateOutlet]="activeTab.template" />
    </div>
  </div>`,
})
export class FlowTabsComponent
  extends FlowComponentBase
  implements AfterContentInit
{
  @ContentChildren(FlowTabComponent) tabs!: QueryList<FlowTabComponent>;
  @Input() value?: string;
  @Input() selectedStyle: "underline" | "fill" = "underline";
  @Output() valueChange = new EventEmitter<string>();
  internal?: string;
  get tabList() {
    return this.tabs?.toArray() ?? [];
  }
  get active() {
    const requested = this.value ?? this.internal;
    return this.tabList.some((tab) => tab.id === requested && !tab.disabled)
      ? requested
      : this.tabList.find((tab) => !tab.disabled)?.id;
  }
  get activeTab() {
    return this.tabList.find((tab) => tab.id === this.active);
  }
  ngAfterContentInit() {
    this.internal ??= this.tabList[0]?.id;
  }
  activate(id: string) {
    if (this.value === undefined) this.internal = id;
    this.valueChange.emit(id);
  }
  view = () => this.resolved("");
}

@Component({
  selector: "fui-section",
  standalone: true,
  imports: [CommonModule, FlowIconComponent],
  template: `<section [class]="view().className" [ngStyle]="view().style">
    <button
      class="fui-section-header"
      type="button"
      [attr.aria-expanded]="expanded"
      (click)="toggle()"
    >
      <span>{{ title }}</span
      ><fui-icon [icon]="'fa-solid fa-chevron-' + (expanded ? 'up' : 'down')" />
    </button>
    <div *ngIf="expanded" class="fui-section-body"><ng-content /></div>
  </section>`,
})
export class FlowSectionComponent extends FlowComponentBase {
  @Input() title = "";
  @Input() open?: boolean;
  @Input() defaultOpen = false;
  @Output() openChange = new EventEmitter<boolean>();
  internal = false;
  get expanded() {
    return this.open ?? (this.internal || this.defaultOpen);
  }
  toggle() {
    const next = !this.expanded;
    if (this.open === undefined) {
      this.internal = next;
      this.defaultOpen = false;
    }
    this.openChange.emit(next);
  }
  view = () => this.resolved("fui-section");
}
