import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import type { DropdownModel, SelectOption } from "@akin2unde/flowui-core";
import { FlowComponentBase } from "./base";
import { FlowIconComponent } from "./primitives";

@Component({
  selector: "fui-input",
  standalone: true,
  imports: [CommonModule],
  template: `
    <input
      [id]="id"
      [class]="view().className"
      [ngStyle]="view().style"
      [type]="type"
      [value]="value ?? ''"
      [name]="name ?? ''"
      [placeholder]="placeholder ?? ''"
      [disabled]="disabled"
      [readOnly]="readOnly"
      [required]="required"
      [autofocus]="autoFocus"
      [tabIndex]="tabIndex"
      (input)="valueChange.emit($any($event.target).value)"
    />
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
  @Input() name?: string;
  @Input() placeholder?: string;
  @Input() disabled = false;
  @Input() readOnly = false;
  @Input() required = false;
  @Input() autoFocus = false;
  @Input() tabIndex = 0;

  @Output() valueChange = new EventEmitter<string>();

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
  imports: [CommonModule],
  template: `
    <select
      [class]="view().className"
      [ngStyle]="view().style"
      [value]="value ?? ''"
      [disabled]="disabled"
      (change)="selectValue($any($event.target).value)"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option *ngFor="let option of options" [value]="option.value">
        {{ option.display }}
      </option>
    </select>
  `,
})
export class FlowDropdownComponent extends FlowComponentBase {
  @Input() value?: string | number;
  @Input() options: DropdownModel[] = [];
  @Input() placeholder = "Select an option";
  @Input() disabled = false;

  @Output() selected = new EventEmitter<DropdownModel>();

  selectValue(value: string): void {
    const model = this.options.find((option) => String(option.value) === value);

    if (model) {
      this.selected.emit(model);
    }
  }

  view = () => this.resolved("fui-control");
}
