import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from "@angular/core";
import type {
  FlowAction,
  FlowActionItemStyle,
  FlowIconStyle,
  FlowStage,
  FlowStageStyle,
  FlowTextStyle,
  WorkflowStepperProps,
} from "@akin2unde/flowui-core";
import { FlowComponentBase } from "./base";
import { FlowIconComponent } from "./primitives";

@Component({
  selector: "fui-workflow-stepper",
  standalone: true,
  imports: [CommonModule, FlowIconComponent],
  template: `
    <div
      [class]="view().className"
      [ngStyle]="view().style"
      [attr.data-direction]="stepperDirection"
      (scroll)="close()"
    >
      <ol
        class="fui-workflow"
        [attr.data-direction]="stepperDirection"
        [attr.data-label-position]="labelPosition"
      >
        <li
          *ngFor="let stage of stages; let last = last; trackBy: stageId"
          class="fui-workflow-stage"
          [attr.data-current]="stage.IsCurrent"
          [attr.data-completed]="stage.IsCompleted"
          [attr.data-disabled]="stage.IsDisabled"
          [attr.aria-current]="stage.IsCurrent ? 'step' : null"
        >
          <span
            *ngIf="!last"
            class="fui-workflow-line"
            [style.background-color]="lineColor"
            aria-hidden="true"
          ></span>
          <div
            class="fui-workflow-box"
            [style.background-color]="
              stage.IsCurrent ? appearance(stage).backgroundColor : null
            "
            [style.--fui-workflow-marker-bg]="appearance(stage).backgroundColor"
          >
            <ng-template #contents>
              <fui-icon
                *ngIf="icon(stage) as stageIcon"
                class="fui-workflow-stage-icon"
                [icon]="stageIcon"
                [style.color]="appearance(stage).iconStyle?.color"
                [style.font-size.px]="appearance(stage).iconStyle?.size"
              />
              <span class="fui-workflow-label" [ngStyle]="textStyle(stage)">{{
                label(stage)
              }}</span>
            </ng-template>
            <button
              *ngIf="!stage.IsDisabled; else staticStage"
              type="button"
              class="fui-workflow-main"
              (click)="close(); stageClick.emit(stage)"
            >
              <ng-container *ngTemplateOutlet="contents" />
            </button>
            <ng-template #staticStage
              ><span class="fui-workflow-main"
                ><ng-container *ngTemplateOutlet="contents" /></span
            ></ng-template>
            <button
              *ngIf="canPick(stage)"
              type="button"
              class="fui-workflow-chevron"
              [attr.aria-label]="'Actions for ' + stage.Label"
              [attr.aria-expanded]="openId === stage.Id"
              (click)="toggle(stage, $event)"
            >
              <fui-icon
                icon="fa-solid fa-chevron-down"
                [style.color]="chevronStyle?.color"
                [style.font-size.px]="chevronStyle?.size"
              />
            </button>
            <div
              *ngIf="canPick(stage) && openId === stage.Id"
              class="fui-workflow-menu"
              role="group"
              [attr.aria-label]="'Actions for ' + stage.Label"
              [ngStyle]="menuStyle()"
              style="position: fixed; min-width: 12rem"
              [style.top.px]="top"
              [style.right.px]="right"
            >
              <button
                *ngFor="let action of stage.Actions; let i = index"
                type="button"
                class="fui-workflow-option"
                [disabled]="action.IsReadonly"
                [attr.aria-pressed]="isSelected(stage, action)"
                [ngStyle]="rowStyle(stage, action, i)"
                (mouseenter)="hovered = i"
                (mouseleave)="hovered = -1"
                (click)="select(stage, action)"
              >
                <fui-icon
                  *ngIf="action.Icon || action.IsReadonly"
                  [icon]="action.Icon ?? 'fa-solid fa-lock'"
                  [style.color]="iconStyle(stage, action, i).color"
                  [style.font-size.px]="iconStyle(stage, action, i).size"
                />
                <span>{{ action.Label }}</span>
                <fui-icon
                  *ngIf="isSelected(stage, action)"
                  class="fui-workflow-check"
                  icon="fa-solid fa-check"
                  [style.color]="checkmarkStyle?.color"
                  [style.font-size.px]="checkmarkStyle?.size"
                />
              </button>
            </div>
          </div>
        </li>
      </ol>
    </div>
  `,
})
export class FlowWorkflowStepperComponent extends FlowComponentBase {
  @Input() stages: readonly FlowStage[] = [];
  @Input("direction") stepperDirection: NonNullable<
    WorkflowStepperProps["direction"]
  > = "horizontal";
  @Input() labelPosition: NonNullable<WorkflowStepperProps["labelPosition"]> =
    "below";
  @Input() lineColor?: string;
  @Input() stageTextStyle?: FlowTextStyle;
  @Input() completedStyle?: FlowStageStyle;
  @Input() currentStyle?: FlowStageStyle;
  @Input() disabledStyle?: FlowStageStyle;
  @Input() actionMenuStyle?: WorkflowStepperProps["actionMenuStyle"];
  @Input() actionItemStyle?: WorkflowStepperProps["actionItemStyle"];
  @Input() checkmarkStyle?: FlowIconStyle;
  @Input() chevronStyle?: FlowIconStyle;
  @Output() stageClick = new EventEmitter<FlowStage>();
  @Output() actionChange = new EventEmitter<{
    stage: FlowStage;
    action: FlowAction;
  }>();

  private readonly selections = new Map<string, FlowAction>();
  private trigger?: HTMLButtonElement;
  openId?: string;
  hovered = -1;
  top = 0;
  right = 0;
  stageId = (_: number, stage: FlowStage) => stage.Id;
  view = () => this.resolved("fui-workflow-scroll");
  canPick = (stage: FlowStage) =>
    !!stage.IsCurrent && !stage.IsDisabled && (stage.Actions?.length ?? 0) > 1;
  stateStyle = (stage: FlowStage) =>
    stage.IsCurrent
      ? this.currentStyle
      : stage.IsCompleted
        ? this.completedStyle
        : undefined;
  appearance = (stage: FlowStage) => ({
    ...this.stateStyle(stage),
    ...(stage.IsDisabled ? this.disabledStyle : undefined),
  });
  textStyle(stage: FlowStage) {
    return this.cssText({
      ...this.stageTextStyle,
      ...this.stateStyle(stage)?.textStyle,
      ...(stage.IsDisabled ? this.disabledStyle?.textStyle : undefined),
      ...stage.TextStyle,
    });
  }
  cssText(style: FlowTextStyle) {
    return {
      ...style,
      fontSize:
        style.fontSize === undefined ? undefined : `${style.fontSize}px`,
    };
  }
  menuStyle() {
    const style = this.actionMenuStyle;
    return {
      ...style,
      borderRadius:
        style?.borderRadius === undefined
          ? undefined
          : `${style.borderRadius}px`,
    };
  }
  icon = (stage: FlowStage) =>
    this.appearance(stage).icon ??
    (stage.IsCompleted && !stage.IsCurrent ? "fa-solid fa-check" : undefined);
  current = (stage: FlowStage) =>
    stage.SelectedAction ?? this.selections.get(stage.Id);
  label = (stage: FlowStage) =>
    (stage.IsCurrent
      ? stage.Actions?.find((action) => this.isSelected(stage, action))?.Label
      : undefined) ?? stage.Label;
  isSelected = (stage: FlowStage, action: FlowAction) =>
    this.current(stage)?.Label === action.Label;
  itemStyles(
    stage: FlowStage,
    action: FlowAction,
    index: number,
  ): (FlowActionItemStyle | undefined)[] {
    return [
      this.actionItemStyle,
      this.isSelected(stage, action)
        ? this.actionItemStyle?.selected
        : undefined,
      action.IsReadonly
        ? this.actionItemStyle?.readonly
        : this.hovered === index
          ? this.actionItemStyle?.hover
          : undefined,
    ];
  }
  rowStyle(stage: FlowStage, action: FlowAction, index: number) {
    const [base, selected, state] = this.itemStyles(stage, action, index);
    return {
      backgroundColor:
        state?.backgroundColor ??
        selected?.backgroundColor ??
        base?.backgroundColor,
      ...this.cssText({
        ...base?.textStyle,
        ...selected?.textStyle,
        ...state?.textStyle,
        ...action.TextStyle,
      }),
    };
  }
  iconStyle(stage: FlowStage, action: FlowAction, index: number) {
    const [base, selected, state] = this.itemStyles(stage, action, index);
    return {
      ...base?.iconStyle,
      ...selected?.iconStyle,
      ...state?.iconStyle,
      ...action.IconStyle,
    };
  }
  toggle(stage: FlowStage, event: MouseEvent) {
    if (this.openId === stage.Id) return this.close();
    this.trigger = event.currentTarget as HTMLButtonElement;
    const box = this.trigger.parentElement!.getBoundingClientRect();
    this.top = box.bottom + 4;
    this.right = Math.max(8, window.innerWidth - Math.max(box.right, 208));
    this.hovered = -1;
    this.openId = stage.Id;
  }
  select(stage: FlowStage, action: FlowAction) {
    if (!this.canPick(stage) || action.IsReadonly) return;
    if (stage.SelectedAction === undefined)
      this.selections.set(stage.Id, action);
    this.close();
    this.trigger?.focus();
    this.actionChange.emit({ stage, action });
  }
  close() {
    this.openId = undefined;
  }
  @HostListener("document:keydown.escape") escape() {
    if (this.openId === undefined) return;
    this.close();
    this.trigger?.focus();
  }
  @HostListener("document:pointerdown", ["$event"]) outside(
    event: PointerEvent,
  ) {
    if (
      this.openId !== undefined &&
      !this.trigger?.parentElement?.contains(event.target as Node)
    )
      this.close();
  }
}
