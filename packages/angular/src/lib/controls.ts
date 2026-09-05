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
  get selectedCountry(): PhoneCountry | undefined {
    return (
      this.countries.find((item) => item.code === this.value?.countryCode) ??
      this.countries[0]
    );
  }
  get current(): PhoneNumberValue {
    return (
      this.value ?? {
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
  choose(country: PhoneCountry): void {
    this.valueChange.emit({
      ...this.current,
      countryCode: country.code,
      dialCode: country.dialCode,
    });
    this.open = false;
    this.query = "";
  }
  setNumber(number: string): void {
    this.valueChange.emit({
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

interface ChartPoint {
  x: number;
  y: number;
  value: number;
}
interface ChartSlice {
  length: number;
  offset: number;
  color: string;
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
      <svg
        [attr.viewBox]="'0 0 640 ' + height"
        [attr.aria-label]="type + ' chart'"
        role="img"
      >
        <ng-container *ngIf="type === 'bar'">
          <ng-container
            *ngFor="let series of data.series; let seriesIndex = index"
          >
            <g *ngFor="let item of series.data; let index = index">
              <rect
                [attr.x]="barX(index, seriesIndex)"
                [attr.y]="barY(item)"
                [attr.width]="barWidth - 4"
                [attr.height]="barHeight(item)"
                rx="5"
                [attr.fill]="seriesColor(seriesIndex)"
              />
              <text
                *ngIf="showValues"
                [attr.x]="barX(index, seriesIndex) + barWidth / 2"
                [attr.y]="barY(item) - 7"
              >
                {{ item }}
              </text>
            </g>
          </ng-container>
        </ng-container>
        <ng-container *ngIf="type === 'line'">
          <g *ngFor="let series of data.series; let seriesIndex = index">
            <polyline
              fill="none"
              [attr.stroke]="seriesColor(seriesIndex)"
              stroke-width="4"
              [attr.points]="linePoints(series.data)"
            />
            <g *ngFor="let point of points(series.data)">
              <circle
                [attr.cx]="point.x"
                [attr.cy]="point.y"
                r="5"
                [attr.fill]="seriesColor(seriesIndex)"
              />
              <text
                *ngIf="showValues"
                [attr.x]="point.x"
                [attr.y]="point.y - 10"
              >
                {{ point.value }}
              </text>
            </g>
          </g>
        </ng-container>
        <g
          *ngIf="type === 'pie' || type === 'doughnut'"
          [attr.transform]="'rotate(-90 320 ' + height / 2 + ')'"
        >
          <circle
            *ngFor="let slice of pieSlices"
            [attr.cx]="320"
            [attr.cy]="height / 2"
            [attr.r]="pieRadius"
            fill="none"
            [attr.stroke]="slice.color"
            [attr.stroke-width]="
              type === 'doughnut' ? pieRadius * 0.55 : pieRadius * 2
            "
            [attr.stroke-dasharray]="slice.length + ' ' + pieCircumference"
            [attr.stroke-dashoffset]="-slice.offset"
          />
        </g>
        <ng-container *ngIf="type !== 'pie' && type !== 'doughnut'">
          <text
            *ngFor="let label of data.labels; let index = index"
            class="fui-chart-label"
            [attr.x]="labelX(index)"
            [attr.y]="height - 15"
          >
            {{ label }}
          </text>
        </ng-container>
      </svg>
      <figcaption *ngIf="showLegend">
        <span *ngFor="let series of data.series; let index = index"
          ><i [style.background]="seriesColor(index)"></i
          >{{ series.name }}</span
        >
      </figcaption>
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
  readonly width = 640;
  readonly palette = ["#6d28d9", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"];
  get maximum(): number {
    return Math.max(
      1,
      ...this.data.series.reduce<number[]>(
        (values, series) => values.concat(series.data),
        [],
      ),
    );
  }
  get groupWidth(): number {
    return (this.width - 80) / Math.max(this.data.labels.length, 1);
  }
  get barWidth(): number {
    return this.groupWidth / Math.max(this.data.series.length + 1, 2);
  }
  get pieRadius(): number {
    return Math.min(this.width, this.height) * 0.28;
  }
  get pieCircumference(): number {
    return 2 * Math.PI * this.pieRadius;
  }
  get pieSlices(): ChartSlice[] {
    const values = this.data.series[0]?.data ?? [];
    const total = values.reduce((sum, value) => sum + value, 0) || 1;
    let offset = 0;
    return values.map((value, index) => {
      const length = (value / total) * this.pieCircumference;
      const slice = {
        length,
        offset,
        color: this.palette[index % this.palette.length],
      };
      offset += length;
      return slice;
    });
  }
  seriesColor(index: number): string {
    const color = this.data.series[index]?.color;
    return color
      ? resolveColorValue(color)
      : this.palette[index % this.palette.length];
  }
  barHeight(value: number): number {
    return (value / this.maximum) * (this.height - 80);
  }
  barX(index: number, seriesIndex: number): number {
    return 48 + index * this.groupWidth + seriesIndex * this.barWidth;
  }
  barY(value: number): number {
    return this.height - 42 - this.barHeight(value);
  }
  points(values: number[]): ChartPoint[] {
    return values.map((value, index) => ({
      x: 48 + index * ((this.width - 80) / Math.max(values.length - 1, 1)),
      y: this.height - 42 - (value / this.maximum) * (this.height - 80),
      value,
    }));
  }
  linePoints(values: number[]): string {
    return this.points(values)
      .map((point) => `${point.x},${point.y}`)
      .join(" ");
  }
  labelX(index: number): number {
    return (
      48 + index * ((this.width - 80) / Math.max(this.data.labels.length, 1))
    );
  }
  view = () => this.resolved("fui-chart");
}
