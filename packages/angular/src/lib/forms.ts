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
import type { DropdownModel, SelectOption } from "@akin2unde/flowui-core";
import { sanitizeInputValue } from "@akin2unde/flowui-core";
import { FlowComponentBase } from "./base";
import { FlowIconComponent } from "./primitives";

@Component({
  selector: "fui-input",
  standalone: true,
  imports: [CommonModule],
  template: `
    <span *ngIf="inputMode === 'money'" class="fui-money-input">
      <span class="fui-money-symbol">{{ currencySymbol }}</span>
      <ng-container *ngTemplateOutlet="control" />
    </span>
    <ng-container *ngIf="inputMode !== 'money'" [ngTemplateOutlet]="control" />
    <ng-template #control
      ><input
        [id]="id"
        [class]="view().className"
        [ngStyle]="view().style"
        [type]="inputMode === 'text' ? type : 'text'"
        [attr.inputmode]="nativeInputMode"
        [value]="value ?? ''"
        [name]="name ?? ''"
        [placeholder]="placeholder ?? ''"
        [disabled]="disabled"
        [readOnly]="readOnly"
        [required]="required"
        [autofocus]="autoFocus"
        [tabIndex]="tabIndex"
        (input)="handleInput($any($event.target).value)"
    /></ng-template>
  `,
})
export class FlowInputComponent extends FlowComponentBase {
  @Input() type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "search"
    | "tel"
    | "url"
    | "date"
    | "time" = "text";

  @Input() value?: string | number;
  @Input() inputMode: "text" | "integer" | "decimal" | "money" | "alphabet" =
    "text";
  @Input() currencySymbol = "₦";
  @Input() name?: string;
  @Input() placeholder?: string;
  @Input() disabled = false;
  @Input() readOnly = false;
  @Input() required = false;
  @Input() autoFocus = false;
  @Input() tabIndex = 0;

  @Output() valueChange = new EventEmitter<string>();

  get nativeInputMode(): string | null {
    if (this.inputMode === "integer") return "numeric";
    if (this.inputMode === "decimal" || this.inputMode === "money")
      return "decimal";
    return null;
  }

  handleInput(value: string): void {
    this.valueChange.emit(sanitizeInputValue(value, this.inputMode));
  }

  view = () => this.resolved("fui-control");
}

@Component({
  selector: "fui-password-input",
  standalone: true,
  imports: [CommonModule, FlowIconComponent],
  template: `
    <div [class]="view().className" [ngStyle]="view().style">
      <input
        class="fui-control fui-password-control"
        [type]="isVisible ? 'text' : 'password'"
        [value]="value"
        [name]="name ?? ''"
        [placeholder]="placeholder ?? ''"
        [disabled]="disabled"
        [readOnly]="readOnly"
        [required]="required"
        (input)="valueChange.emit($any($event.target).value)"
      />

      <button
        *ngIf="showToggle"
        class="fui-password-toggle"
        type="button"
        [disabled]="disabled"
        [attr.aria-label]="isVisible ? 'Hide password' : 'Show password'"
        (click)="toggleVisibility()"
      >
        <fui-icon [icon]="'fa-solid fa-eye' + (isVisible ? '-slash' : '')" />
      </button>
    </div>
  `,
})
export class FlowPasswordInputComponent extends FlowComponentBase {
  @Input() value = "";
  @Input() name?: string;
  @Input() placeholder?: string;
  @Input() disabled = false;
  @Input() readOnly = false;
  @Input() required = false;
  @Input() showToggle = true;
  @Input() visible?: boolean;

  @Output() valueChange = new EventEmitter<string>();
  @Output() visibleChange = new EventEmitter<boolean>();

  private internalVisible = false;

  get isVisible(): boolean {
    return this.visible ?? this.internalVisible;
  }

  toggleVisibility(): void {
    const next = !this.isVisible;

    if (this.visible === undefined) {
      this.internalVisible = next;
    }

    this.visibleChange.emit(next);
  }

  view = () => this.resolved("fui-password");
}

@Component({
  selector: "fui-textarea",
  standalone: true,
  imports: [CommonModule],
  template: `
    <textarea
      [class]="view().className"
      [ngStyle]="view().style"
      [value]="value"
      [name]="name ?? ''"
      [placeholder]="placeholder ?? ''"
      [disabled]="disabled"
      [readOnly]="readOnly"
      [required]="required"
      [rows]="rows"
      (input)="valueChange.emit($any($event.target).value)"
    ></textarea>
  `,
})
export class FlowTextAreaComponent extends FlowComponentBase {
  @Input() value = "";
  @Input() name?: string;
  @Input() placeholder?: string;
  @Input() disabled = false;
  @Input() readOnly = false;
  @Input() required = false;
  @Input() rows = 4;

  @Output() valueChange = new EventEmitter<string>();

  view = () => this.resolved("fui-control fui-textarea");
}

@Component({
  selector: "fui-checkbox",
  standalone: true,
  imports: [CommonModule],
  template: `
    <label [class]="view().className" [ngStyle]="view().style">
      <input
        class="fui-check"
        type="checkbox"
        [checked]="checked"
        [name]="name ?? ''"
        [value]="value ?? ''"
        [disabled]="disabled"
        (change)="checkedChange.emit($any($event.target).checked)"
      />
      <span>{{ label }}</span>
    </label>
  `,
})
export class FlowCheckboxComponent extends FlowComponentBase {
  @Input() checked = false;
  @Input() label?: string;
  @Input() name?: string;
  @Input() value?: string;
  @Input() disabled = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  view = () => this.resolved("fui-check-label");
}

@Component({
  selector: "fui-radio",
  standalone: true,
  imports: [CommonModule],
  template: `
    <label [class]="view().className" [ngStyle]="view().style">
      <input
        class="fui-check"
        type="radio"
        [checked]="checked"
        [name]="name"
        [value]="value"
        [disabled]="disabled"
        (change)="selected.emit(value)"
      />
      <span>{{ label }}</span>
    </label>
  `,
})
export class FlowRadioButtonComponent extends FlowComponentBase {
  @Input() checked = false;
  @Input() label?: string;
  @Input() name = "";
  @Input() value = "";
  @Input() disabled = false;

  @Output() selected = new EventEmitter<string>();

  view = () => this.resolved("fui-check-label");
}

@Component({
  selector: "fui-radio-group",
  standalone: true,
  imports: [CommonModule, FlowRadioButtonComponent],
  template: `
    <div [class]="view().className" [ngStyle]="view().style" role="radiogroup">
      <fui-radio
        *ngFor="let option of options"
        [name]="name"
        [value]="option.value"
        [label]="option.label"
        [checked]="value === option.value"
        [disabled]="option.disabled ?? false"
        (selected)="valueChange.emit($event)"
      />
    </div>
  `,
})
export class FlowRadioGroupComponent extends FlowComponentBase {
  @Input({ required: true }) name!: string;
  @Input() value?: string;
  @Input() options: SelectOption[] = [];
  @Input() orientation: "horizontal" | "vertical" = "vertical";

  @Output() valueChange = new EventEmitter<string>();

  view = () =>
    this.resolved(
      this.orientation === "horizontal" ? "fui-h-stack" : "fui-v-stack",
    );
}

@Component({
  selector: "fui-color-picker",
  standalone: true,
  imports: [CommonModule],
  template: `
    <input
      [class]="view().className"
      [ngStyle]="view().style"
      type="color"
      [value]="value"
      [name]="name ?? ''"
      [disabled]="disabled"
      (input)="valueChange.emit($any($event.target).value)"
    />
  `,
})
export class FlowColorPickerComponent extends FlowComponentBase {
  @Input() value = "#2563eb";
  @Input() name?: string;
  @Input() disabled = false;

  @Output() valueChange = new EventEmitter<string>();

  view = () => this.resolved("fui-color");
}

@Component({
  selector: "fui-dropdown",
  standalone: true,
  imports: [CommonModule, FlowIconComponent],
  template: `
    <div [class]="view().className" [ngStyle]="view().style">
      <button
        class="fui-select-trigger"
        type="button"
        [disabled]="disabled"
        [attr.aria-expanded]="open"
        (click)="open = !open"
      >
        <span [class.fui-select-placeholder]="!selectedOption">
          <ng-container
            *ngIf="selectedOption && valueTemplate; else plainValue"
            [ngTemplateOutlet]="valueTemplate"
            [ngTemplateOutletContext]="{ $implicit: selectedOption }"
          />
          <ng-template #plainValue>
            {{ selectedOption?.display ?? placeholder }}
          </ng-template>
        </span>
        <fui-icon [icon]="'fa-solid fa-chevron-' + (open ? 'up' : 'down')" />
      </button>

      <div *ngIf="open" class="fui-select-menu">
        <label *ngIf="searchable" class="fui-select-search">
          <fui-icon icon="fa-solid fa-magnifying-glass" />
          <input
            [value]="query"
            [placeholder]="searchPlaceholder"
            (input)="search($any($event.target).value)"
          />
        </label>
        <div class="fui-select-options" role="listbox">
          <ng-container *ngIf="matches.length; else empty">
            <ng-container *ngFor="let group of groups">
              <div *ngIf="grouped" class="fui-select-group">{{ group }}</div>
              <button
                *ngFor="let option of optionsForGroup(group)"
                class="fui-select-option"
                type="button"
                role="option"
                [disabled]="option.disabled"
                [attr.aria-selected]="option.value === value"
                (click)="choose(option)"
              >
                <span>
                  <ng-container
                    *ngIf="optionTemplate; else plainOption"
                    [ngTemplateOutlet]="optionTemplate"
                    [ngTemplateOutletContext]="{
                      $implicit: option,
                      selected: option.value === value,
                    }"
                  />
                  <ng-template #plainOption>{{ option.display }}</ng-template>
                </span>
                <fui-icon
                  *ngIf="option.value === value"
                  icon="fa-solid fa-check"
                />
              </button>
            </ng-container>
          </ng-container>
          <ng-template #empty>
            <div class="fui-select-empty">{{ emptyText }}</div>
          </ng-template>
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
export class FlowDropdownComponent extends FlowComponentBase {
  constructor(private readonly element: ElementRef<HTMLElement>) {
    super();
  }
  @Input() value?: string | number;
  @Input() options: DropdownModel[] = [];
  @Input() placeholder = "Select an option";
  @Input() disabled = false;
  @Input() searchable = false;
  @Input() grouped = false;
  @Input() searchPlaceholder = "Search…";
  @Input() emptyText = "No options found";
  @Input() loading = false;
  @Input() hasMore = false;
  @Input() loadMoreText = "Load more";
  @Input() optionTemplate?: TemplateRef<{
    $implicit: DropdownModel;
    selected: boolean;
  }>;
  @Input() valueTemplate?: TemplateRef<{ $implicit: DropdownModel }>;

  @Output() selected = new EventEmitter<DropdownModel>();
  @Output() valueChange = new EventEmitter<string | number>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() loadMore = new EventEmitter<void>();

  open = false;
  query = "";

  get selectedOption(): DropdownModel | undefined {
    return this.options.find((option) => option.value === this.value);
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

  optionsForGroup(group: string | number | undefined): DropdownModel[] {
    return this.matches.filter(
      (option) => !this.grouped || (option.group ?? "Other") === group,
    );
  }

  search(query: string): void {
    this.query = query;
    this.searchChange.emit(query);
  }

  choose(model: DropdownModel): void {
    this.value = model.value;
    this.valueChange.emit(model.value);
    this.selected.emit(model);
    this.open = false;
    this.query = "";
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

  selectValue(value: string): void {
    const model = this.options.find((option) => String(option.value) === value);

    if (model) {
      this.selected.emit(model);
    }
  }

  view = () => this.resolved("fui-select");
}
