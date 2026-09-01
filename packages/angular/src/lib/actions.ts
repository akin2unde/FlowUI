import { CommonModule } from "@angular/common";
import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
} from "@angular/core";
import type { Subscription } from "rxjs";
import type {
  ComponentSize,
  ComponentVariant,
  Orientation,
  PaletteColor,
} from "@akin2unde/flowui-core";
import { FlowComponentBase } from "./base";
import { FlowBadgeComponent, FlowIconComponent } from "./primitives";

@Component({
  selector: "fui-button",
  standalone: true,
  imports: [CommonModule, FlowIconComponent, FlowBadgeComponent],
  template: `<button
    [id]="id"
    [class]="view().className"
    [ngStyle]="view().style"
    [type]="type"
    [disabled]="disabled || loading"
    [attr.data-variant]="variant"
    [attr.data-color]="color"
    [attr.data-size]="size"
    [attr.data-selected]="selected"
    [attr.aria-pressed]="selected"
    [attr.aria-label]="ariaLabel"
    [attr.aria-busy]="loading"
    (click)="pressed.emit($event)"
  >
    <fui-icon
      *ngIf="loading"
      icon="fa-solid fa-spinner"
      [spin]="true"
    /><fui-icon
      *ngIf="!loading && icon && iconPosition !== 'right'"
      [icon]="icon"
    /><span *ngIf="iconPosition !== 'center'"
      >{{ loading && loadingText ? loadingText : ""
      }}<ng-content *ngIf="!loading || !loadingText" /></span
    ><fui-icon
      *ngIf="!loading && icon && iconPosition === 'right'"
      [icon]="icon"
    /><fui-badge *ngIf="badge !== undefined" color="danger" size="xs">{{
      badge
    }}</fui-badge>
  </button>`,
})
export class FlowButtonComponent extends FlowComponentBase {
  @Input() type: "button" | "submit" | "reset" = "button";
  @Input() variant: ComponentVariant = "solid";
  @Input() color: PaletteColor = "primary";
  @Input() size: ComponentSize = "md";
  @Input() icon?: string;
  @Input() iconPosition: "left" | "right" | "center" = "left";
  @Input() badge?: string | number;
  @Input() loading = false;
  @Input() loadingText?: string;
  @Input() disabled = false;
  @Input() ariaLabel?: string;
  @Input() value?: string | number;
  @Input() selected = false;
  @Output() pressed = new EventEmitter<MouseEvent>();
  view = () => this.resolved("fui-button");
}

@Component({
  selector: "fui-button-group",
  standalone: true,
  imports: [CommonModule],
  template: `<div
    [class]="view().className"
    [ngStyle]="view().style"
    role="group"
    [attr.data-orientation]="orientation"
    [attr.data-attached]="attached"
  >
    <ng-content />
  </div>`,
})
export class FlowButtonGroupComponent
  extends FlowComponentBase
  implements AfterContentInit, OnDestroy
{
  @Input() orientation: Orientation = "horizontal";
  @Input() attached = true;
  @Input() selectable = false;
  @Input() value?: string | number;
  @Output() valueChange = new EventEmitter<string | number>();
  @ContentChildren(FlowButtonComponent)
  buttons!: QueryList<FlowButtonComponent>;

  private subscriptions: Subscription[] = [];

  ngAfterContentInit(): void {
    this.connectButtons();
    this.buttons.changes.subscribe(() => this.connectButtons());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private connectButtons(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];
    this.buttons.forEach((button) => {
      button.selected = this.selectable && button.value === this.value;
      this.subscriptions.push(
        button.pressed.subscribe(() => {
          if (!this.selectable || button.value === undefined) return;
          this.value = button.value;
          this.buttons.forEach(
            (item) => (item.selected = item.value === this.value),
          );
          this.valueChange.emit(button.value);
        }),
      );
    });
  }
  view = () => this.resolved("fui-button-group");
}
