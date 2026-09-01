import { CommonModule } from "@angular/common";
import {
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
  TemplateRef,
} from "@angular/core";
import type {
  BreadcrumbItem,
  DateTimeMode,
  DropdownModel,
  NotificationHorizontal,
  NotificationType,
  NotificationVertical,
  Orientation,
  TimelineItem,
  TooltipLocation,
} from "@akin2unde/flowui-core";
import { setLocalDayBoundary } from "@akin2unde/flowui-core";
import { FlowComponentBase } from "./base";
import { FlowIconComponent } from "./primitives";

@Component({
  selector: "fui-date-time",
  standalone: true,
  imports: [CommonModule, FlowIconComponent],
  template: `
    <div [class]="view().className" [ngStyle]="view().style">
      <input
        *ngIf="mode === 'time'"
        class="fui-control"
        type="time"
        [value]="value"
        [name]="name ?? ''"
        [min]="min ?? ''"
        [max]="max ?? ''"
        [disabled]="disabled"
        (input)="valueChange.emit($any($event.target).value)"
      />

      <div *ngIf="mode !== 'time'" class="fui-date-time-field">
        <button
          class="fui-date-display"
          type="button"
          [disabled]="disabled"
          (click)="toggleCalendar()"
        >
          <fui-icon icon="fa-regular fa-calendar" />
          <span>{{ selectedDate || "Select date" }}</span>
        </button>
        <input
          *ngIf="mode === 'datetime'"
          class="fui-date-time-clock"
          type="time"
          [value]="selectedTime"
          [disabled]="disabled"
          (input)="setTime($any($event.target).value)"
        />
        <div class="fui-date-time-actions">
          <button
            type="button"
            title="Today"
            [disabled]="disabled"
            (click)="selectToday()"
          >
            <fui-icon icon="fa-solid fa-calendar-day" />
          </button>
          <button
            *ngIf="mode === 'datetime' && showDayBoundaryButtons"
            type="button"
            title="Start of day"
            [disabled]="disabled"
            (click)="setBoundary('start')"
          >
            <fui-icon icon="fa-solid fa-sun" />
          </button>
          <button
            *ngIf="mode === 'datetime' && showDayBoundaryButtons"
            type="button"
            title="End of day"
            [disabled]="disabled"
            (click)="setBoundary('end')"
          >
            <fui-icon icon="fa-solid fa-moon" />
          </button>
        </div>
      </div>

      <div *ngIf="open && mode !== 'time'" class="fui-calendar" role="dialog">
        <div class="fui-calendar-header">
          <button
            type="button"
            aria-label="Previous month"
            (click)="moveMonth(-1)"
          >
            <fui-icon icon="fa-solid fa-chevron-left" />
          </button>
          <strong>{{ monthLabel }}</strong>
          <button type="button" aria-label="Next month" (click)="moveMonth(1)">
            <fui-icon icon="fa-solid fa-chevron-right" />
          </button>
        </div>
        <div class="fui-calendar-grid fui-calendar-weekdays">
          <span *ngFor="let weekday of weekdays">{{ weekday }}</span>
        </div>
        <div class="fui-calendar-grid">
          <button
            *ngFor="let day of days"
            type="button"
            [attr.data-outside]="day.getMonth() !== month.getMonth()"
            [attr.data-selected]="dateKey(day) === selectedDate"
            [attr.data-today]="dateKey(day) === dateKey(today)"
            [disabled]="dayDisabled(day)"
            (click)="selectDate(dateKey(day))"
          >
            {{ day.getDate() }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class FlowDateTimeComponent extends FlowComponentBase {
  @Input() value = "";
  @Input() mode: DateTimeMode = "datetime";
  @Input() name?: string;
  @Input() min?: string;
  @Input() max?: string;
  @Input() disabled = false;
  @Input() showDayBoundaryButtons = true;
  @Output() valueChange = new EventEmitter<string>();
  open = false;
  month = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  readonly today = new Date();
  readonly weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  get selectedDate(): string {
    return this.value.split("T")[0] ?? "";
  }

  get selectedTime(): string {
    return this.value.includes("T") ? this.value.split("T")[1] : "00:00";
  }

  get monthLabel(): string {
    return this.month.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  }

  get days(): Date[] {
    const first = new Date(this.month.getFullYear(), this.month.getMonth(), 1);
    const start = new Date(first);
    start.setDate(1 - first.getDay());
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });
  }

  dateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  dayDisabled(date: Date): boolean {
    const key = this.dateKey(date);
    return Boolean(
      (this.min && key < this.min.split("T")[0]) ||
      (this.max && key > this.max.split("T")[0]),
    );
  }

  selectDate(date: string): void {
    this.valueChange.emit(
      this.mode === "date" ? date : `${date}T${this.selectedTime || "00:00"}`,
    );
    this.open = false;
  }

  selectToday(): void {
    this.selectDate(this.dateKey(this.today));
    this.month = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  }

  setTime(time: string): void {
    this.valueChange.emit(
      `${this.selectedDate || this.dateKey(this.today)}T${time}`,
    );
  }

  moveMonth(amount: number): void {
    this.month = new Date(
      this.month.getFullYear(),
      this.month.getMonth() + amount,
      1,
    );
  }

  toggleCalendar(): void {
    if (!this.open && this.selectedDate) {
      const selected = new Date(`${this.selectedDate}T12:00`);
      this.month = new Date(selected.getFullYear(), selected.getMonth(), 1);
    }
    this.open = !this.open;
  }

  setBoundary(boundary: "start" | "end"): void {
    this.valueChange.emit(setLocalDayBoundary(this.value, boundary));
  }

  view = () => this.resolved("fui-date-time");
}

@Component({
  selector: "fui-autocomplete",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="view().className" [ngStyle]="view().style">
      <input
        class="fui-control"
        role="combobox"
        [value]="query"
        [placeholder]="placeholder ?? ''"
        [disabled]="disabled"
        [attr.aria-expanded]="open"
        (focus)="open = true"
        (input)="updateQuery($any($event.target).value)"
      />

      <div
        *ngIf="open && query.length >= minCharacters"
        class="fui-autocomplete-menu"
        role="listbox"
      >
        <button
          *ngFor="let option of matches"
          type="button"
          role="option"
          [attr.aria-selected]="value === option.value"
          (mousedown)="$event.preventDefault()"
          (click)="select(option)"
        >
          {{ option.display }}
        </button>
        <span *ngIf="matches.length === 0" class="fui-empty">No matches</span>
      </div>
    </div>
  `,
})
export class FlowAutocompleteComponent extends FlowComponentBase {
  @Input() options: DropdownModel[] = [];
  @Input() value?: string | number;
  @Input() placeholder?: string;
  @Input() minCharacters = 1;
  @Input() disabled = false;
  @Output() selected = new EventEmitter<DropdownModel>();

  query = "";
  open = false;

  get matches(): DropdownModel[] {
    const search = this.query.toLowerCase();
    return this.options.filter((option) =>
      String(option.display).toLowerCase().includes(search),
    );
  }

  updateQuery(query: string): void {
    this.query = query;
    this.open = true;
  }

  select(option: DropdownModel): void {
    this.query = String(option.display);
    this.open = false;
    this.selected.emit(option);
  }

  view = () => this.resolved("fui-autocomplete");
}

@Component({
  selector: "fui-rating",
  standalone: true,
  imports: [CommonModule, FlowIconComponent],
  template: `
    <div
      [class]="view().className"
      [ngStyle]="view().style"
      role="radiogroup"
      aria-label="Rating"
    >
      <button
        *ngFor="let point of points"
        type="button"
        role="radio"
        [class.fui-rating-active]="point <= value"
        [attr.aria-checked]="point === value"
        [attr.aria-label]="point + ' out of ' + maximum"
        [disabled]="disabled || readOnly"
        (click)="valueChange.emit(point)"
      >
        <fui-icon icon="fa-solid fa-star" />
      </button>
    </div>
  `,
})
export class FlowRatingComponent extends FlowComponentBase {
  @Input() value = 0;
  @Input() maximum = 5;
  @Input() precision: 1 | 0.5 = 1;
  @Input() readOnly = false;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<number>();

  get points(): number[] {
    return Array.from(
      { length: this.maximum / this.precision },
      (_, index) => (index + 1) * this.precision,
    );
  }

  view = () => this.resolved("fui-rating");
}

@Component({
  selector: "fui-listbox",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="view().className"
      [ngStyle]="view().style"
      role="listbox"
      [attr.aria-multiselectable]="multiple"
    >
      <button
        *ngFor="let option of options"
        type="button"
        role="option"
        [disabled]="disabled"
        [attr.aria-selected]="isSelected(option)"
        (click)="select(option)"
      >
        <ng-container
          *ngIf="optionTemplate; else defaultOption"
          [ngTemplateOutlet]="optionTemplate"
          [ngTemplateOutletContext]="{
            $implicit: option,
            selected: isSelected(option),
          }"
        />
        <ng-template #defaultOption>{{ option.display }}</ng-template>
      </button>
    </div>
  `,
})
export class FlowListboxComponent extends FlowComponentBase {
  @Input() options: DropdownModel[] = [];
  @Input() value?: string | number;
  @Input() values: Array<string | number> = [];
  @Input() multiple = false;
  @Input() disabled = false;
  @Input() optionTemplate?: TemplateRef<{
    $implicit: DropdownModel;
    selected: boolean;
  }>;
  @Output() selected = new EventEmitter<DropdownModel>();
  @Output() valuesChange = new EventEmitter<DropdownModel[]>();

  isSelected(option: DropdownModel): boolean {
    return this.multiple
      ? this.values.includes(option.value)
      : this.value === option.value;
  }

  select(option: DropdownModel): void {
    if (!this.multiple) {
      this.selected.emit(option);
      return;
    }
    const next = this.values.includes(option.value)
      ? this.values.filter((value) => value !== option.value)
      : [...this.values, option.value];
    this.valuesChange.emit(
      this.options.filter((item) => next.includes(item.value)),
    );
  }

  view = () => this.resolved("fui-listbox");
}

@Component({
  selector: "fui-timeline",
  standalone: true,
  imports: [CommonModule, FlowIconComponent],
  template: `
    <ol
      [class]="view().className"
      [ngStyle]="view().style"
      [attr.data-orientation]="orientation"
    >
      <li *ngFor="let item of items" class="fui-timeline-item">
        <span class="fui-timeline-marker">
          <img
            *ngIf="item.image; else timelineIcon"
            [src]="item.image"
            alt=""
          />
          <ng-template #timelineIcon>
            <fui-icon [icon]="item.icon ?? 'fa-solid fa-circle'" />
          </ng-template>
        </span>
        <div class="fui-timeline-content">
          <ng-container
            *ngIf="itemTemplate; else defaultItem"
            [ngTemplateOutlet]="itemTemplate"
            [ngTemplateOutletContext]="{ $implicit: item }"
          />
          <ng-template #defaultItem>
            <strong>{{ item.title }}</strong>
            <p *ngIf="item.description">{{ item.description }}</p>
            <time *ngIf="item.date">{{ item.date }}</time>
          </ng-template>
        </div>
      </li>
    </ol>
  `,
})
export class FlowTimelineComponent extends FlowComponentBase {
  @Input() items: TimelineItem[] = [];
  @Input() orientation: Orientation = "vertical";
  @Input() itemTemplate?: TemplateRef<{ $implicit: TimelineItem }>;
  view = () => this.resolved("fui-timeline");
}

@Component({
  selector: "fui-popover",
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      [class]="view().className"
      [ngStyle]="view().style"
      [attr.data-placement]="placement"
    >
      <span class="fui-popover-trigger" (click)="toggle()">
        <ng-content />
      </span>
      <div *ngIf="isOpen" class="fui-popover-content">
        <ng-container *ngIf="content" [ngTemplateOutlet]="content" />
      </div>
    </span>
  `,
})
export class FlowPopoverComponent extends FlowComponentBase {
  @Input() open?: boolean;
  @Input() placement: TooltipLocation = "bottom";
  @Input() closeOnOutsideClick = true;
  @Input() content?: TemplateRef<unknown>;
  @Output() openChange = new EventEmitter<boolean>();
  private internalOpen = false;

  constructor(private readonly element: ElementRef<HTMLElement>) {
    super();
  }

  get isOpen(): boolean {
    return this.open ?? this.internalOpen;
  }

  toggle(): void {
    this.setOpen(!this.isOpen);
  }

  private setOpen(value: boolean): void {
    if (this.open === undefined) this.internalOpen = value;
    this.openChange.emit(value);
  }

  @HostListener("document:mousedown", ["$event"])
  outsideClick(event: MouseEvent): void {
    if (
      this.isOpen &&
      this.closeOnOutsideClick &&
      !this.element.nativeElement.contains(event.target as Node)
    ) {
      this.setOpen(false);
    }
  }

  view = () => this.resolved("fui-popover");
}

interface AngularFilePreview {
  file: File;
  url?: string;
}

@Component({
  selector: "fui-file-upload",
  standalone: true,
  imports: [CommonModule, FlowIconComponent],
  template: `
    <div [class]="view().className" [ngStyle]="view().style">
      <label class="fui-file-drop">
        <fui-icon icon="fa-solid fa-cloud-arrow-up" />
        <span>Choose file{{ multiple ? "s" : "" }}</span>
        <input
          type="file"
          [accept]="accept ?? ''"
          [multiple]="multiple"
          [disabled]="disabled"
          (change)="choose($event)"
        />
      </label>
      <div *ngIf="preview && files.length" class="fui-file-previews">
        <div *ngFor="let item of files">
          <img
            *ngIf="item.url; else fileIcon"
            [src]="item.url"
            [alt]="item.file.name"
          />
          <ng-template #fileIcon
            ><fui-icon icon="fa-solid fa-file"
          /></ng-template>
          <span>{{ item.file.name }}</span>
        </div>
      </div>
    </div>
  `,
})
export class FlowFileUploadComponent extends FlowComponentBase {
  @Input() accept?: string;
  @Input() multiple = false;
  @Input() preview = true;
  @Input() maxSize?: number;
  @Input() disabled = false;
  @Output() filesChange = new EventEmitter<File[]>();
  files: AngularFilePreview[] = [];

  choose(event: Event): void {
    this.files.forEach((item) => item.url && URL.revokeObjectURL(item.url));
    const input = event.target as HTMLInputElement;
    const chosen = Array.from(input.files ?? []).filter(
      (file) => !this.maxSize || file.size <= this.maxSize,
    );
    this.files = chosen.map((file) => ({
      file,
      url:
        this.preview && file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
    }));
    this.filesChange.emit(chosen);
  }

  view = () => this.resolved("fui-file-upload");
}

@Component({
  selector: "fui-carousel",
  standalone: true,
  imports: [CommonModule, FlowIconComponent],
  template: `
    <div [class]="view().className" [ngStyle]="view().style">
      <div class="fui-carousel-slide">
        <ng-container
          *ngIf="slides[resolvedIndex]"
          [ngTemplateOutlet]="slides[resolvedIndex]"
        />
      </div>
      <button
        *ngIf="showControls && slides.length > 1"
        class="fui-carousel-prev"
        type="button"
        aria-label="Previous slide"
        (click)="select(resolvedIndex - 1)"
      >
        <fui-icon icon="fa-solid fa-chevron-left" />
      </button>
      <button
        *ngIf="showControls && slides.length > 1"
        class="fui-carousel-next"
        type="button"
        aria-label="Next slide"
        (click)="select(resolvedIndex + 1)"
      >
        <fui-icon icon="fa-solid fa-chevron-right" />
      </button>
      <div *ngIf="showIndicators" class="fui-carousel-indicators">
        <button
          *ngFor="let slide of slides; let index = index"
          type="button"
          [attr.aria-label]="'Slide ' + (index + 1)"
          [attr.aria-current]="index === resolvedIndex"
          (click)="select(index)"
        ></button>
      </div>
    </div>
  `,
})
export class FlowCarouselComponent extends FlowComponentBase {
  @ContentChildren(TemplateRef)
  slideTemplates!: QueryList<TemplateRef<unknown>>;
  @Input() activeIndex?: number;
  @Input() loop = true;
  @Input() showIndicators = true;
  @Input() showControls = true;
  @Output() activeIndexChange = new EventEmitter<number>();
  private internalIndex = 0;

  get slides(): TemplateRef<unknown>[] {
    return this.slideTemplates?.toArray() ?? [];
  }

  get resolvedIndex(): number {
    return this.activeIndex ?? this.internalIndex;
  }

  select(index: number): void {
    if (!this.slides.length) return;
    const next = this.loop
      ? (index + this.slides.length) % this.slides.length
      : Math.max(0, Math.min(index, this.slides.length - 1));
    if (this.activeIndex === undefined) this.internalIndex = next;
    this.activeIndexChange.emit(next);
  }

  view = () => this.resolved("fui-carousel");
}

@Component({
  selector: "fui-breadcrumb",
  standalone: true,
  imports: [CommonModule, FlowIconComponent],
  template: `
    <nav
      [class]="view().className"
      [ngStyle]="view().style"
      aria-label="Breadcrumb"
    >
      <ol>
        <li *ngFor="let item of items; let index = index">
          <fui-icon *ngIf="index > 0" [icon]="separatorIcon" />
          <a
            [href]="item.href ?? ''"
            [attr.aria-current]="index === items.length - 1 ? 'page' : null"
            (click)="select($event, item)"
          >
            <ng-container
              *ngIf="itemTemplate; else defaultCrumb"
              [ngTemplateOutlet]="itemTemplate"
              [ngTemplateOutletContext]="{ $implicit: item }"
            />
            <ng-template #defaultCrumb>
              <img *ngIf="item.image" [src]="item.image" alt="" />
              <fui-icon *ngIf="item.icon" [icon]="item.icon" />
              <span *ngIf="item.text">{{ item.text }}</span>
            </ng-template>
          </a>
        </li>
      </ol>
    </nav>
  `,
})
export class FlowBreadcrumbComponent extends FlowComponentBase {
  @Input() items: BreadcrumbItem[] = [];
  @Input() separatorIcon = "fa-solid fa-chevron-right";
  @Input() itemTemplate?: TemplateRef<{ $implicit: BreadcrumbItem }>;
  @Output() selected = new EventEmitter<BreadcrumbItem>();

  select(event: MouseEvent, item: BreadcrumbItem): void {
    if (!item.href) event.preventDefault();
    this.selected.emit(item);
  }

  view = () => this.resolved("fui-breadcrumb");
}

@Component({
  selector: "fui-notification",
  standalone: true,
  imports: [CommonModule, FlowIconComponent],
  template: `
    <aside
      *ngIf="open"
      [class]="view().className"
      [ngStyle]="view().style"
      [attr.data-type]="type"
      [attr.data-horizontal]="horizontal"
      [attr.data-vertical]="vertical"
      [attr.role]="type === 'error' ? 'alert' : 'status'"
    >
      <fui-icon [icon]="icon" />
      <div>
        <strong *ngIf="title">{{ title }}</strong
        ><ng-content />
      </div>
      <button
        *ngIf="dismissible"
        type="button"
        aria-label="Close notification"
        (click)="closed.emit()"
      >
        <fui-icon icon="fa-solid fa-xmark" />
      </button>
    </aside>
  `,
})
export class FlowNotificationComponent extends FlowComponentBase {
  @Input() open = true;
  @Input() title?: string;
  @Input() type: NotificationType = "info";
  @Input() horizontal: NotificationHorizontal = "right";
  @Input() vertical: NotificationVertical = "top";
  @Input() dismissible = true;
  @Output() closed = new EventEmitter<void>();

  get icon(): string {
    const icons: Record<NotificationType, string> = {
      success: "fa-circle-check",
      error: "fa-circle-xmark",
      warning: "fa-triangle-exclamation",
      info: "fa-circle-info",
    };
    return `fa-solid ${icons[this.type]}`;
  }

  view = () => this.resolved("fui-notification");
}
