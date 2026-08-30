import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  TemplateRef,
} from "@angular/core";
import type { DialogPosition } from "@akin2unde/flowui-core";
import { FlowComponentBase } from "./base";
import { FlowButtonComponent } from "./actions";

@Component({
  selector: "fui-dialog",
  standalone: true,
  imports: [CommonModule, FlowButtonComponent],
  template: `<div
    *ngIf="open"
    class="fui-dialog-overlay"
    (mousedown)="overlayClick($event)"
  >
    <section
      [class]="view().className"
      [ngStyle]="view().style"
      [attr.data-position]="position"
      role="dialog"
      aria-modal="true"
    >
      <header *ngIf="header || showCloseButton" class="fui-dialog-header">
        <ng-container *ngIf="header" [ngTemplateOutlet]="header" /><fui-button
          *ngIf="showCloseButton"
          variant="ghost"
          icon="fa-solid fa-xmark"
          iconPosition="center"
          ariaLabel="Close dialog"
          (pressed)="close()"
        />
      </header>
      <div
        [class]="
          'fui-dialog-body' + (scrollableBody ? ' fui-dialog-body-scroll' : '')
        "
      >
        <ng-container *ngIf="body" [ngTemplateOutlet]="body" /><ng-content />
      </div>
      <footer *ngIf="footer" class="fui-dialog-footer">
        <ng-container [ngTemplateOutlet]="footer" />
      </footer>
    </section>
  </div>`,
})
export class FlowDialogComponent extends FlowComponentBase {
  private currentOpen = false;
  @Input() set open(value: boolean) {
    if (value && !this.currentOpen) this.opened.emit();
    this.currentOpen = value;
  }
  get open() {
    return this.currentOpen;
  }
  @Input() position: DialogPosition = "center";
  @Input() header?: TemplateRef<unknown>;
  @Input() body?: TemplateRef<unknown>;
  @Input() footer?: TemplateRef<unknown>;
  @Input() scrollableBody = true;
  @Input() closeOnOverlayClick = true;
  @Input() closeOnEscape = true;
  @Input() showCloseButton = true;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @HostListener("document:keydown.escape") escape() {
    if (this.open && this.closeOnEscape) this.close();
  }
  overlayClick(event: MouseEvent) {
    if (this.closeOnOverlayClick && event.target === event.currentTarget)
      this.close();
  }
  close() {
    this.open = false;
    this.openChange.emit(false);
    this.closed.emit();
  }
  view = () => this.resolved("fui-dialog");
}
