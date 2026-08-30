import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import type {
  ComponentSize,
  ComponentVariant,
  Orientation,
  PaletteColor,
} from "@akin2unde/flowui-core";
import { FlowComponentBase } from "./base";

@Component({
  selector: "fui-hc, fui-h-stack",
  standalone: true,
  imports: [CommonModule],
  template: `<div
    [id]="id"
    [hidden]="hidden"
    [attr.data-testid]="testId"
    [class]="view().className"
    [ngStyle]="view().style"
  >
    <ng-content />
  </div>`,
})
export class FlowHStackComponent extends FlowComponentBase {
  @Input() inline = false;
  view = () => this.resolved("fui-h-stack", this.inline && "fui-inline");
  constructor() {
    super();
    this.direction = "row";
  }
}

@Component({
  selector: "fui-vc, fui-v-stack",
  standalone: true,
  imports: [CommonModule],
  template: `<div
    [id]="id"
    [hidden]="hidden"
    [attr.data-testid]="testId"
    [class]="view().className"
    [ngStyle]="view().style"
  >
    <ng-content />
  </div>`,
})
export class FlowVStackComponent extends FlowComponentBase {
  @Input() inline = false;
  view = () => this.resolved("fui-v-stack", this.inline && "fui-inline");
  constructor() {
    super();
    this.direction = "column";
  }
}

@Component({
  selector: "fui-icon",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    [class]="view().className + ' ' + icon"
    [ngStyle]="view().style"
    [attr.aria-label]="label"
    [attr.aria-hidden]="label ? null : true"
  ></i>`,
})
export class FlowIconComponent extends FlowComponentBase {
  @Input({ required: true }) icon!: string;
  @Input() label?: string;
  @Input() spin = false;
  view = () => this.resolved("fui-icon", this.spin && "fui-icon-spin");
}

@Component({
  selector: "fui-label",
  standalone: true,
  imports: [CommonModule],
  template: `<label
    [attr.for]="htmlFor"
    [class]="view().className"
    [ngStyle]="view().style"
    ><ng-content /><span *ngIf="required" class="fui-required"> *</span></label
  >`,
})
export class FlowLabelComponent extends FlowComponentBase {
  @Input() htmlFor?: string;
  @Input() required = false;
  view = () => this.resolved("fui-label");
}

@Component({
  selector: "fui-badge",
  standalone: true,
  imports: [CommonModule, FlowIconComponent],
  template: `<span
    [class]="view().className"
    [ngStyle]="view().style"
    [attr.data-color]="color"
    [attr.data-variant]="variant"
    [attr.data-size]="size"
    ><fui-icon
      *ngIf="icon && iconPosition === 'left'"
      [icon]="icon" /><ng-content /><fui-icon
      *ngIf="icon && iconPosition === 'right'"
      [icon]="icon"
  /></span>`,
})
export class FlowBadgeComponent extends FlowComponentBase {
  @Input() color: PaletteColor = "primary";
  @Input() variant: Exclude<ComponentVariant, "link"> = "solid";
  @Input() size: ComponentSize = "sm";
  @Input() icon?: string;
  @Input() iconPosition: "left" | "right" = "left";
  view = () => this.resolved("fui-badge");
}

@Component({
  selector: "fui-divider",
  standalone: true,
  imports: [CommonModule],
  template: `<div
    [class]="view().className"
    [ngStyle]="view().style"
    [attr.data-orientation]="orientation"
    role="separator"
    [attr.aria-orientation]="orientation"
  >
    {{ orientation === "horizontal" ? label : "" }}
  </div>`,
})
export class FlowDividerComponent extends FlowComponentBase {
  @Input() orientation: Orientation = "horizontal";
  @Input() label?: string;
  view = () => this.resolved("fui-divider");
}

@Component({
  selector: "fui-image",
  standalone: true,
  imports: [CommonModule],
  template: `<img
    [class]="view().className"
    [ngStyle]="view().style"
    [style.object-fit]="fit"
    [src]="currentSrc"
    [alt]="alt"
    [attr.loading]="loading"
    (error)="handleError()"
  />`,
})
export class FlowImageComponent extends FlowComponentBase {
  @Input({ required: true }) src!: string;
  @Input({ required: true }) alt!: string;
  @Input() fit: "contain" | "cover" | "fill" | "none" | "scale-down" = "cover";
  @Input() loading: "eager" | "lazy" = "lazy";
  @Input() fallbackSrc?: string;
  get currentSrc() {
    return this.failed && this.fallbackSrc ? this.fallbackSrc : this.src;
  }
  private failed = false;
  handleError() {
    this.failed = true;
  }
  view = () => this.resolved("fui-image");
}
