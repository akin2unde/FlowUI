import {
  Component,
  DestroyRef,
  Injectable,
  InjectionToken,
  Input,
  OnChanges,
  Provider,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  createAsyncLabelStore,
  type AsyncLabelCode,
  type AsyncLabelConfig,
  type AsyncLabelState,
} from "@akin2unde/flowui-core";
import { FlowComponentBase } from "./base";
const configToken = new InjectionToken<AsyncLabelConfig>(
  "FlowUI AsyncLabel configuration",
);
@Injectable()
export class AsyncLabelService {
  readonly store = createAsyncLabelStore(inject(configToken));
  constructor() {
    inject(DestroyRef).onDestroy(() => this.store.dispose());
  }
  setScope(scopeKey: string) {
    this.store.setScope(scopeKey);
  }
  invalidate(lookup?: string, code?: AsyncLabelCode) {
    this.store.invalidate(lookup, code);
  }
  prime(lookup: string, code: AsyncLabelCode, label: string | null) {
    this.store.prime(lookup, code, label);
  }
  clear() {
    this.store.clear();
  }
}
/** Register once in application providers. The factory runs in Angular's injection context. */
export function provideAsyncLabels(
  config: AsyncLabelConfig | (() => AsyncLabelConfig),
): Provider[] {
  return [
    typeof config === "function"
      ? { provide: configToken, useFactory: config }
      : { provide: configToken, useValue: config },
    AsyncLabelService,
  ];
}
@Component({
  selector: "fui-async-label",
  standalone: true,
  imports: [CommonModule],
  template: `<span
    [class]="view().className"
    [ngStyle]="view().style"
    [attr.aria-busy]="busy"
    [attr.data-state]="state().status"
  >
    <span
      *ngIf="busy && showLoader"
      class="fui-async-label-spinner"
      aria-hidden="true"
    ></span>
    <span>{{ text }}</span>
  </span>`,
})
export class FlowAsyncLabelComponent
  extends FlowComponentBase
  implements OnChanges
{
  private readonly labels = inject(AsyncLabelService);
  private unsubscribe?: () => void;
  @Input() lookup = "";
  @Input() code?: AsyncLabelCode;
  @Input() fallback?: string;
  @Input() loadingText = "Resolving…";
  @Input() showLoader = true;
  readonly state = signal<AsyncLabelState>({ status: "idle" });
  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => this.unsubscribe?.());
  }
  ngOnChanges() {
    this.unsubscribe?.();
    const update = () =>
      this.state.set(this.labels.store.getSnapshot(this.lookup, this.code));
    this.unsubscribe = this.labels.store.subscribe(
      this.lookup,
      this.code,
      update,
    );
    update();
  }
  get busy() {
    return (
      this.state().status === "loading" ||
      (this.state().status === "idle" &&
        this.code !== null &&
        this.code !== undefined &&
        String(this.code).trim() !== "")
    );
  }
  get text() {
    const state = this.state();
    return state.status === "ready"
      ? state.label
      : this.busy
        ? this.loadingText
        : (this.fallback ?? String(this.code ?? ""));
  }
  view = () => this.resolved("fui-async-label");
}
