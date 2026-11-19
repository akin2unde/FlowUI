import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  inject,
  AfterViewChecked,
  OnDestroy,
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
      [attr.aria-label]="ariaLabelledBy ? null : ariaLabel"
      [attr.aria-labelledby]="ariaLabelledBy"
      [attr.aria-describedby]="ariaDescribedBy"
      tabindex="-1"
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
export class FlowDialogComponent
  extends FlowComponentBase
  implements AfterViewChecked, OnDestroy
{
  private readonly dialogHost: ElementRef<HTMLElement> = inject(ElementRef);
  private activated = false;
  private previousFocus?: HTMLElement;
  @Input() ariaLabel = "Dialog";
  @Input() ariaLabelledBy?: string;
  @Input() ariaDescribedBy?: string;
  @Input() initialFocus?: HTMLElement;
  @Input() trapFocus = true;
  @Input() restoreFocus = true;
  get contentElement(): HTMLElement | null {
    return this.dialogHost.nativeElement.querySelector('[role="dialog"]');
  }
  ngAfterViewChecked(): void {
    if (this.open && !this.activated) {
      this.activated = true;
      this.previousFocus =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : undefined;
      (
        this.initialFocus ??
        this.contentElement?.querySelector<HTMLElement>(
          'button:not([disabled]),input:not([disabled]),textarea:not([disabled]),[tabindex="0"]',
        ) ??
        this.contentElement
      )?.focus();
    } else if (!this.open && this.activated) {
      this.activated = false;
      if (this.restoreFocus) this.previousFocus?.focus();
    }
  }
  ngOnDestroy(): void {
    if (this.activated && this.restoreFocus) this.previousFocus?.focus();
  }

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
  @HostListener("document:keydown", ["$event"]) keyboard(event: KeyboardEvent) {
    const panels = document.querySelectorAll(
      '[role="dialog"][aria-modal="true"]',
    );
    if (!this.open || panels[panels.length - 1] !== this.contentElement) return;
    if (
      event.key === "Escape" &&
      this.closeOnEscape &&
      !event.defaultPrevented
    ) {
      event.preventDefault();
      this.close();
    }
    if (event.key === "Tab" && this.trapFocus) {
      const nodes = Array.from(
        this.contentElement?.querySelectorAll<HTMLElement>(
          'button:not([disabled]),input:not([disabled]):not([type="hidden"]),textarea:not([disabled]),select:not([disabled]),a[href],[tabindex="0"]',
        ) ?? [],
      );
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (!first) {
        event.preventDefault();
        this.contentElement?.focus();
      } else if (
        event.shiftKey &&
        (document.activeElement === first ||
          !this.contentElement?.contains(document.activeElement))
      ) {
        event.preventDefault();
        last?.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !this.contentElement?.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    }
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
