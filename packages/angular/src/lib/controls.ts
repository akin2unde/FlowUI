import { buildChart } from "@akin2unde/flowui-core";
import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from "@angular/core";
import {
  clampNumber,
  resolveColorValue,
  type ChartData,
  type ChartType,
  type ColorValue,
  type PhoneCountry,
  type PhoneNumberValue,
} from "@akin2unde/flowui-core";
import { FlowComponentBase } from "./base";
import { FlowIconComponent } from "./primitives";

@Component({
  selector: "fui-knob",
  standalone: true,
  imports: [CommonModule],
  template: `
    <label
      [class]="view().className"
      [ngStyle]="view().style"
      [style.width.px]="size"
      [style.height.px]="size"
    >
      <svg [attr.viewBox]="'0 0 ' + size + ' ' + size" aria-hidden="true">
        <circle
          class="fui-knob-track"
          [attr.cx]="size / 2"
          [attr.cy]="size / 2"
          [attr.r]="radius"
          [attr.stroke]="resolvedTrackColor"
          [attr.stroke-width]="strokeWidth"
        />
        <circle
          class="fui-knob-value"
          [attr.cx]="size / 2"
          [attr.cy]="size / 2"
          [attr.r]="radius"
          [attr.stroke]="resolvedColor"
          [attr.stroke-width]="strokeWidth"
          [attr.stroke-dasharray]="circumference"
          [attr.stroke-dashoffset]="dashOffset"
        />
      </svg>
      <output *ngIf="showValue">{{ value }}{{ valueSuffix }}</output>
      <input
        type="range"
        [min]="min"
        [max]="max"
        [step]="step"
        [value]="value"
        [disabled]="disabled"
        aria-label="Knob value"
        (input)="valueChange.emit(+$any($event.target).value)"
      />
    </label>
  `,
})
export class FlowKnobComponent extends FlowComponentBase {
  @Input() value = 0;
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() size = 120;
  @Input() strokeWidth = 10;
  @Input() showValue = true;
  @Input() valueSuffix = "";
  @Input() color: ColorValue = "primary";
  @Input() trackColor: ColorValue = "border";
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<number>();
  get radius(): number {
    return (this.size - this.strokeWidth) / 2;
  }
  get circumference(): number {
    return 2 * Math.PI * this.radius;
  }
  get dashOffset(): number {
    return (
      this.circumference *
      (1 -
        (clampNumber(this.value, this.min, this.max) - this.min) /
          (this.max - this.min || 1))
    );
  }
  get resolvedColor(): string {
    return resolveColorValue(this.color);
  }
  get resolvedTrackColor(): string {
    return resolveColorValue(this.trackColor);
  }
  view = () => this.resolved("fui-knob");
}

@Component({
  selector: "fui-otp-input",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="view().className" [ngStyle]="view().style">
      <input type="hidden" [name]="name ?? ''" [value]="value" />
      <input
        #digitInput
        *ngFor="let character of characters; let index = index"
        [type]="masked ? 'password' : 'text'"
        [attr.inputmode]="numericOnly ? 'numeric' : 'text'"
        maxlength="1"
        [value]="character"
        [disabled]="disabled"
        [attr.aria-label]="'Digit ' + (index + 1)"
        (input)="update(index, $any($event.target).value)"
        (keydown)="keyDown(index, character, $event)"
        (paste)="paste($event)"
      />
    </div>
  `,
})
export class FlowOTPInputComponent extends FlowComponentBase {
  @Input() value = "";
  @Input() length = 6;
  @Input() numericOnly = true;
  @Input() masked = false;
  @Input() disabled = false;
  @Input() name?: string;
  @Output() valueChange = new EventEmitter<string>();
  @Output() completed = new EventEmitter<string>();
  @ViewChildren("digitInput") inputs!: QueryList<ElementRef<HTMLInputElement>>;
  get characters(): string[] {
    return Array.from(
      { length: this.length },
      (_, index) => this.value[index] ?? "",
    );
  }
  update(index: number, raw: string): void {
    const accepted = (this.numericOnly ? raw.replace(/\D/g, "") : raw).slice(
      -1,
    );
    const next = this.characters;
    next[index] = accepted;
    const joined = next.join("");
    this.valueChange.emit(joined);
    if (accepted) this.inputs.get(index + 1)?.nativeElement.focus();
    if (joined.length === this.length) this.completed.emit(joined);
  }
  keyDown(index: number, character: string, event: KeyboardEvent): void {
    if (event.key === "Backspace" && !character)
      this.inputs.get(index - 1)?.nativeElement.focus();
  }
  paste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = (event.clipboardData?.getData("text") ?? "")
      .replace(this.numericOnly ? /\D/g : /$^/, "")
      .slice(0, this.length);
    this.valueChange.emit(pasted);
    if (pasted.length === this.length) this.completed.emit(pasted);
  }
  view = () => this.resolved("fui-otp");
}

@Component({
  selector: "fui-phone-input",
  standalone: true,
  imports: [CommonModule, FlowIconComponent],
  template: `
    <div [class]="view().className" [ngStyle]="view().style">
      <button
        class="fui-phone-country"
        type="button"
        [disabled]="disabled"
        [attr.aria-expanded]="open"
        (click)="open = !open"
      >
        <span>{{ selectedCountry?.flag || selectedCountry?.code }}</span
        ><span>{{ selectedCountry?.dialCode }}</span
        ><fui-icon icon="fa-solid fa-chevron-down" />
      </button>
      <input
        class="fui-phone-number"
        type="tel"
        inputmode="tel"
        [name]="name ?? ''"
        [value]="current.number"
        [placeholder]="placeholder"
        [disabled]="disabled"
        (input)="setNumber($any($event.target).value)"
      />
      <div *ngIf="open" class="fui-phone-menu fui-select-menu">
        <label *ngIf="searchable" class="fui-select-search"
          ><fui-icon icon="fa-solid fa-magnifying-glass" /><input
            [value]="query"
            placeholder="Search country…"
            (input)="query = $any($event.target).value"
        /></label>
        <div class="fui-select-options">
          <button
            *ngFor="let country of matches"
            class="fui-select-option"
            type="button"
            (click)="choose(country)"
          >
            <span>{{ country.flag }} {{ country.name }}</span
            ><span>{{ country.dialCode }}</span>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class FlowPhoneInputComponent extends FlowComponentBase {
  constructor(private readonly element: ElementRef<HTMLElement>) {
    super();
  }
  @Input() value?: PhoneNumberValue;
  @Input() countries: PhoneCountry[] = [];
  @Input() searchable = true;
  @Input() placeholder = "Phone number";
  @Input() disabled = false;
  @Input() name?: string;
  @Output() valueChange = new EventEmitter<PhoneNumberValue>();
  open = false;
  query = "";
  private draft?: PhoneNumberValue;
  get selectedCountry(): PhoneCountry | undefined {
    return (
      this.countries.find(
        (item) => item.code === (this.value ?? this.draft)?.countryCode,
      ) ?? this.countries[0]
    );
  }
  get current(): PhoneNumberValue {
    return (
      this.value ??
      this.draft ?? {
        countryCode: this.selectedCountry?.code ?? "",
        dialCode: this.selectedCountry?.dialCode ?? "",
        number: "",
      }
    );
  }
  get matches(): PhoneCountry[] {
    const query = this.query.toLowerCase();
    return this.countries.filter((item) =>
      `${item.name} ${item.code} ${item.dialCode}`
        .toLowerCase()
        .includes(query),
    );
  }
  private update(value: PhoneNumberValue): void {
    if (this.value === undefined) this.draft = value;
    this.valueChange.emit(value);
  }
  choose(country: PhoneCountry): void {
    this.update({
      ...this.current,
      countryCode: country.code,
      dialCode: country.dialCode,
    });
    this.open = false;
    this.query = "";
  }
  setNumber(number: string): void {
    this.update({
      ...this.current,
      number: number.replace(/[^0-9\s()-]/g, ""),
    });
  }
  @HostListener("document:pointerdown", ["$event"]) closeOutside(
    event: PointerEvent,
  ): void {
    if (this.open && !this.element.nativeElement.contains(event.target as Node))
      this.open = false;
  }
  view = () => this.resolved("fui-phone");
}

@Component({
  selector: "fui-chart",
  standalone: true,
  imports: [CommonModule],
  template: `
    <figure
      [class]="view().className"
      [ngStyle]="view().style"
      [attr.data-animated]="animated"
    >
      <ng-container *ngIf="chart as geometry">
        <svg
          [attr.viewBox]="'0 0 ' + geometry.width + ' ' + geometry.height"
          role="img"
          [attr.aria-label]="type + ' chart'"
        >
          <ng-container *ngFor="let mark of geometry.marks">
            <path
              *ngIf="mark.path; else bar"
              [attr.d]="mark.path"
              [attr.fill]="mark.fill"
              [attr.fill-opacity]="mark.opacity"
              [attr.stroke]="mark.stroke"
              stroke-width="2.5"
            />
            <ng-template #bar>
              <rect
                [attr.x]="mark.x"
                [attr.y]="mark.y"
                [attr.width]="mark.width"
                [attr.height]="mark.height"
                rx="3"
                [attr.fill]="mark.fill"
              />
            </ng-template>
          </ng-container>
          <text
            *ngFor="let label of geometry.labels"
            [attr.x]="label.x"
            [attr.y]="label.y"
            [attr.text-anchor]="label.anchor"
          >
            {{ label.text }}
          </text>
        </svg>
        <figcaption *ngIf="showLegend">
          <span *ngFor="let item of geometry.legend"
            ><i [style.background]="item.color"></i>{{ item.label }}</span
          >
        </figcaption>
      </ng-container>
    </figure>
  `,
})
export class FlowChartComponent extends FlowComponentBase {
  @Input() type: ChartType = "bar";
  @Input() data: ChartData = { labels: [], series: [] };
  @Input() height = 260;
  @Input() showLegend = true;
  @Input() showValues = false;
  @Input() animated = true;
  get chart() {
    return buildChart(this.data, this.type, this.height, this.showValues);
  }
  view = () => this.resolved("fui-chart");
}
